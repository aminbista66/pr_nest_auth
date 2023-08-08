import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDTO } from './dto/user-create.dto';
import { UserCredsDTO } from './dto/user-credential.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    register(@Body() requestBody: UserCreateDTO) {
        return this.userService.createUser(requestBody);
    }

    @Post('signin')
    signin(@Body() requestBody: UserCredsDTO) {
        return this.userService.signin(requestBody);
    }
}
