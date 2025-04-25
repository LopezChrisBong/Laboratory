import { ApiProperty } from "@nestjs/swagger";
import { IsAscii, IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class ChangePasswordDto {

    @ApiProperty()
    @IsNotEmpty()
    old_password: string;

    @ApiProperty()
    @IsNotEmpty()
    new_password: string;

}
