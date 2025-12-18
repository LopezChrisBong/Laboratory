import { ApiProperty } from '@nestjs/swagger';

export class CreateMedicalCertificateDto {
  @ApiProperty()
  patientID: number;

  @ApiProperty()
  doctorID: number;

  @ApiProperty()
  diagnosis: string;

  @ApiProperty()
  recommendations: string;

  @ApiProperty()
  date: string;

 
}
