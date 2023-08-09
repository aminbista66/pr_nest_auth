import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async refreshToken(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
    });
    return this.userService.getToken({
        id: payload.id,
        username: payload.username,
        email: payload.email,
    })
  }
}
