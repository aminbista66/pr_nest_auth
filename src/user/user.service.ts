import { ForbiddenException, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { User } from './entities/use.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCreateDTO } from './dto/user-create.dto';
import * as argon from 'argon2';
import { UserCredsDTO } from './dto/user-credential.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly entityManager: EntityManager,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async createUser(requestBody: UserCreateDTO) {
    const user = new User({
      username: requestBody.username,
      email: requestBody.email,
      password: await argon.hash(requestBody.password),
    });
    return this.BuildResponse(await this.entityManager.save(user));
  }

  async signin(requestBody: UserCredsDTO) {
    const user = await this.usersRepository.findOneBy({
      username: requestBody.username,
    });
    if (!user) {
      throw new ForbiddenException('Invalid username or password');
    }
    const isPasswordValid = await argon.verify(
      user.password,
      requestBody.password,
    );
    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid username or password');
    }
    return this.getToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  }

  async getToken(
    payload: Object,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: '1d',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private BuildResponse(user: User) {
    return {
      id: user.id,
      email: user.email,
    };
  }
}
