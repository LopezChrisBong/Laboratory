import { PartialType } from '@nestjs/swagger';
import { CreateDoctorsScheduleDto } from './create-doctors-schedule.dto';

export class UpdateDoctorsScheduleDto extends PartialType(CreateDoctorsScheduleDto) {}
