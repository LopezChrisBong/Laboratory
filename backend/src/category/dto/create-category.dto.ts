import { ApiProperty } from "@nestjs/swagger";

export class CreateCategoryDto {
    @ApiProperty()
    CategoryName: string;
}