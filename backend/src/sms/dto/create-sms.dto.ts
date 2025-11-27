import { ApiProperty } from '@nestjs/swagger';

export class CreateSmsDto {
  @ApiProperty()
  supplierName: string;
}
