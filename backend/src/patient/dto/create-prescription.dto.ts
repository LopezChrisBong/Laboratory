import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber } from "class-validator";
export class CreatePrescriptionDto {

            @ApiProperty()
            patientID: number;

            @ApiProperty()
            doctorID: number;

            @ApiProperty()
            age:string;

            @ApiProperty()
            address:string;

            @ApiProperty()
            description: string;

            @ApiProperty()
            date: string;

            @ApiProperty()
            name: string;
}
