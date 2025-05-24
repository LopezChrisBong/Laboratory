import { PartialType } from '@nestjs/swagger';
import { CreateServiceLabResultDto } from './create-service-lab-result.dto';

export class UpdateServiceLabResultDto extends PartialType(CreateServiceLabResultDto) {}
