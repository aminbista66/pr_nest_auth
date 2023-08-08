import { IsEmail } from "class-validator";

export class UserCreateDTO {
    username: string;
    password: string;

    @IsEmail()
    email: string;
}