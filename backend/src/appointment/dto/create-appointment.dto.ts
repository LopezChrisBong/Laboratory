import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {

    @ApiProperty()
    patientID: string;

    @ApiProperty()
    date: string;

    @ApiProperty()
    time: string;

    @ApiProperty()
    service: string;

    @ApiProperty()
    service_package: string;


}
