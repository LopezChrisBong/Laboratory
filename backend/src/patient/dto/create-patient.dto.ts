import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber } from "class-validator";
export class CreatePatientDto {
     @ApiProperty()
            @ApiProperty()
            p_name: string;
            @ApiProperty()
            address: string;
            @ApiProperty()
            contact_no: string;
            @ApiProperty()
            dob: string;
            @ApiProperty()
            civil_status: string;
            @ApiProperty()
            occupation:string;
            @ApiProperty()
            gender:string;
            @ApiProperty()
            age:number;
            @ApiProperty()
            n_spouse:string;
            @ApiProperty()
            created_at: Date;
            @ApiProperty()
            updated_at: Date;
}
