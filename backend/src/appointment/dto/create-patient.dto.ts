import { ApiProperty } from '@nestjs/swagger';

export class CreatePatientDto {
  @ApiProperty()
  f_name: string;

  @ApiProperty()
  l_name: string;

  @ApiProperty()
  m_name: string;

  @ApiProperty()
  age: number;

  @ApiProperty()
  civil_status: string;

  @ApiProperty()
  occupation: string;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  contact_no: number;

  @ApiProperty()
  b_date: string;

  @ApiProperty()
  address: string;

}