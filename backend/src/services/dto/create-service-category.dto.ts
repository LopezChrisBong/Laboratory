import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceCategoryDto {
  @ApiProperty()
  category_description: string ='[]';

  @ApiProperty()
  service_type: number;

  @ApiProperty()
    removed_category:string = '[]'

}