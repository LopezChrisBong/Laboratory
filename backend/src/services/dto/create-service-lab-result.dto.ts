import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceLabResultDto {
  @ApiProperty()
  labID: number;

  @ApiProperty()
  patientID: number;

   @ApiProperty()
  serviceID: number;

  @ApiProperty()
  service_description:string ;

  @ApiProperty()
  service_price:number ;
  
  @ApiProperty()
  service_result:string ;


}