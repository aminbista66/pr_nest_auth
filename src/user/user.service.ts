import { ForbiddenException, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { User } from './entities/use.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCreateDTO } from './dto/user-create.dto';
import * as argon from 'argon2';
import { UserCredsDTO } from './dto/user-credential.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly entityManager: EntityManager,
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
    const isPasswordValid = await argon.verify(user.password, requestBody.password);
    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid username or password');
    }
    return {message: "you are signed in"};
  }

  private BuildResponse(user: User) {
    return {
      id: user.id,
      email: user.email,
    };
  }
}
