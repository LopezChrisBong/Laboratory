import { ApiProperty } from "@nestjs/swagger";

export class CreateAppointmentDto {
                // hahahahhaha
    @ApiProperty()
    patientId: number;
    @ApiProperty()
    userId: number;
    @ApiProperty()
    date: Date;
    @ApiProperty()
    time: number;
    @ApiProperty()
    status: number;
    @ApiProperty()
    created_at: String;
    @ApiProperty()
    updated_at: String;
}