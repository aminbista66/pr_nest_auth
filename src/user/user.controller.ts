import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDTO } from './dto/user-create.dto';
import { UserCredsDTO } from './dto/user-credential.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

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

  @Post('echo')
  @UseGuards(AuthGuard('jwt'))
  getUser(@Req() req: Request) {
    return { message: 'Congrats! You are authenticated!', echo: req.body };
  }
}
