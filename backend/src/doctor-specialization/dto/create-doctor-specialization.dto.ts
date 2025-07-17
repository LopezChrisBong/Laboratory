import { ApiProperty } from "@nestjs/swagger";

export class CreateDoctorSpecializationDto {

     @ApiProperty()
    doctorID: number;

    @ApiProperty()
    specialty: string;

    @ApiProperty()
    specialty_description: string;
}