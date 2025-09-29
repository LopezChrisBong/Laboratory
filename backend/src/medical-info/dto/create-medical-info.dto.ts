
import { ApiProperty } from '@nestjs/swagger';

export class CreateMedicalInfoDto {

  @ApiProperty()
    patientID: number;

    @ApiProperty()
    appointmentID: number;

  @ApiProperty()
    doctorID: number;

    @ApiProperty()
    am: string;


    @ApiProperty()
    bp: string;


    @ApiProperty()
    date: string;

    @ApiProperty()
    dateDelivered: string;

    @ApiProperty()
    deliveryDate: string;

    @ApiProperty()
    deliveryMethod: string;

    @ApiProperty()
    finding: string;

    @ApiProperty()
    liveBirths: string;

    @ApiProperty()
    menstrual: string;

    @ApiProperty()
    pregnant: string;

    @ApiProperty()
    remarks: string;

    @ApiProperty()
    treatment: string;

    @ApiProperty()
    weight: string;

    @ApiProperty()
    prevPreg: string;

    @ApiProperty()
    complain: string;

    @ApiProperty()
    Pnumber: string;

    @ApiProperty()
    PAnumber: string;

    @ApiProperty()
    Gnumber: string;

    @ApiProperty()
    Lnumber: string;

    @ApiProperty()
    Anumber: string;

    @ApiProperty()
    Tnumber: string;

    @ApiProperty()
    admitted: string;

    @ApiProperty()
    discharge: string;

}