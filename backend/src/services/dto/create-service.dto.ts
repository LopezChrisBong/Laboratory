import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {

    @ApiProperty()
    service_type: number;

    @ApiProperty()
    service_description: string;

    @ApiProperty()
    service_price: number;

    @ApiProperty()
    service_category:string
}
