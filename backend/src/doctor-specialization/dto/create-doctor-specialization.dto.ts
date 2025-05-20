import { ApiProperty } from "@nestjs/swagger";

export class CreateDoctorSpecializationDto {
    @ApiProperty()
    specialization_name: string;
}