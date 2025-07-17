import { ApiProperty } from '@nestjs/swagger';

export class CreateDoctorsScheduleDto {

     @ApiProperty()
        doctorID: number;

    @ApiProperty()
        day: string;

    @ApiProperty()
        date: string;

    @ApiProperty()
        timeFrom: string;

    @ApiProperty()
        timeTo: string;


}
