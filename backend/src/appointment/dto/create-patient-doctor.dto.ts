import { ApiProperty } from '@nestjs/swagger';

export class CreatePatientDoctorDto {


  @ApiProperty()
    patientID: number;

    @ApiProperty()
    appointmentID: number;

  @ApiProperty()
    doctorID: number;

    @ApiProperty()
    labID: number;

}