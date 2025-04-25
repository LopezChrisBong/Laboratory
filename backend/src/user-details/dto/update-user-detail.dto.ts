import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDetailDto } from './create-user-detail.dto';

export class UpdateUserDetailDto extends PartialType(CreateUserDetailDto) { 

    @ApiProperty()
    id: number

    @ApiProperty()
    fname: string

    @ApiProperty()
    mname: string

    @ApiProperty()
    lname: string

    @ApiProperty()
    suffix: string

    @ApiProperty()
    sex: string

    @ApiProperty()
    mobile_no: string

    @ApiProperty()
    hired: string

    @ApiProperty()
    education: string
}
