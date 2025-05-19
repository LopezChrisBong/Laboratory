import { ApiProperty } from "@nestjs/swagger";

export class CreateDoctorDto {
                // hahahahhaha
    @ApiProperty()
    name: number;
    @ApiProperty()
    contact_number: number;
    @ApiProperty()
    email: Date;
    @ApiProperty()
    specializationId: number;
}