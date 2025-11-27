import { ApiProperty } from '@nestjs/swagger';

export class CreatePatientDto {
  @ApiProperty()
  f_name: string;

  @ApiProperty()
  l_name: string;

  @ApiProperty()
  suffix: string;

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
  region: string;

    @ApiProperty()
  province: string;

    @ApiProperty()
  city_muni: string;

    @ApiProperty()
  baranggay: string;

    @ApiProperty()
  purok: string;

     @ApiProperty()
  spouse: string;

  @ApiProperty()
  contact_no: number;

  @ApiProperty()
  status: number;

  @ApiProperty()
  b_date: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
    doctorID: number;

   @ApiProperty()
    medtechID: number;

     @ApiProperty()
    updateID: number;

}