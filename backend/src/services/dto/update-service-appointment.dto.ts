import { PartialType } from '@nestjs/swagger';
import { CreateServiceAppointmentDto } from './create-service-appointment.dto';

export class UpdateServiceAppointmentDto extends PartialType(CreateServiceAppointmentDto) {}
