import { PartialType } from '@nestjs/swagger';
import { CreateMedicalInfoDto } from './create-medical-info.dto';

export class UpdateMedicalInfoDto extends PartialType(CreateMedicalInfoDto) {}
