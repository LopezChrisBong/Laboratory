import { ApiProperty } from '@nestjs/swagger';

export class CreatePatientMedtechDto {


  @ApiProperty()
    patientID: number;

    @ApiProperty()
    appointmentID: number;

  @ApiProperty()
    medtechID: number;

}