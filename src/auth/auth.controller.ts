import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('refresh-token')
    async refreshToken(@Body() body: {refreshToken: string}) {
        return this.authService.refreshToken(body.refreshToken);
    }
}
