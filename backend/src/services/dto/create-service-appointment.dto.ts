import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceAppointmentDto {
  @ApiProperty()
  patientID: number;

  @ApiProperty()
  appointmentID: number;

  @ApiProperty()
  labID: number;

  @ApiProperty()
  doctorID:number ;

  @ApiProperty()
  medtechID:number ;
  
  @ApiProperty()
  service_list:string ;

  @ApiProperty()
  package_list:string ;

  @ApiProperty()
  status:number;

  @ApiProperty()
  attachment:string;

  @ApiProperty()
  created_by:string;

}