import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
    @ApiProperty()
    patientID: number;

    @ApiProperty()
    title: string;

    @ApiProperty()
    message: string;

    @ApiProperty()
    route: string;

    @ApiProperty()
    read: boolean;

    @ApiProperty()
    assignedID: number;

    @ApiProperty()
    appointmentID: number;

}
