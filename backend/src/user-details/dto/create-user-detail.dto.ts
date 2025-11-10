import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class CreateUserDetailDto {
    @ApiProperty()
    @IsNotEmpty()
    fname: string;

    @ApiProperty()
    mname: string;

    @ApiProperty()
    @IsNotEmpty()
    lname: string;

    @ApiProperty()
    suffix: string;

    @ApiProperty()
    hired: string;

    @ApiProperty()
    education: string;

    @ApiProperty()
    liscence_no: string;

    @ApiProperty()
    @IsNotEmpty()
    address: string;

    @ApiProperty()
    @IsNotEmpty()
    statusID: number;

    @ApiProperty()
    @IsNotEmpty()
    usertypeID: number;



}
