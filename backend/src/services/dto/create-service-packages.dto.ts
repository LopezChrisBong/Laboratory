import { ApiProperty } from '@nestjs/swagger';

export class CreateServicePackagesDto {
  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  assign_mods: string;
}