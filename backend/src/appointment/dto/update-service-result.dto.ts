import { ApiProperty } from '@nestjs/swagger';
// import { IsNotEmpty } from 'class-validator';

export class UpdateServiceResultsDto {
//   @ApiProperty()
// //   @IsNotEmpty()
//   user_detailID: number;

  @ApiProperty()
  service_result: string;

  @ApiProperty()
  package_result: string;

}
