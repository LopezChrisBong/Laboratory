import { ApiProperty } from "@nestjs/swagger";

export class CreateTestTypeDto {
                // hahahahhaha
    @ApiProperty()
    TestName: string;
    @ApiProperty()
    CategoryId: number;
}