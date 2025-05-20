import { PartialType } from '@nestjs/swagger';
import { CreateDoctorSpecializationDto } from './create-doctor-specialization.dto';

export class UpdateDoctorSpecializationDto extends PartialType(CreateDoctorSpecializationDto) {}
