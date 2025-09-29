import { PartialType } from '@nestjs/swagger';
import { CreatePatientMedtechDto } from './create-patient-medtech.dto';

export class UpdatePatientMedtechDto extends PartialType(CreatePatientMedtechDto) {}
