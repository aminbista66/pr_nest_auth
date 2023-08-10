import { ForbiddenException, Injectable } from '@nestjs/common';
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
    try {
      const palyload = this.jwtService.verify(refreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
      return this.userService.getToken({
        userId: palyload.id,
        email: palyload.email,
        username: palyload.username,
      });
    } catch (error) {
      throw new ForbiddenException('Invalid token');
    }
  }
}
