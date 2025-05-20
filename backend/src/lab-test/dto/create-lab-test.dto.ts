import { ApiProperty } from "@nestjs/swagger";
export class CreateLabTestDto {
                  // hahahahhaha
        @ApiProperty()
        patientId: number;
        @ApiProperty()
        testTypeId: number;
        @ApiProperty()
        result: string;
        @ApiProperty()
        date_conducted: Date;
        @ApiProperty()
        conducted_by: string;
        @ApiProperty()
        created_at: Date;
        @ApiProperty()
        updated_at: Date;

}
