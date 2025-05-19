import { PartialType } from '@nestjs/swagger';
import { CreateServicePackagesDto } from './create-service-packages.dto';

export class UpdateServicePackagesDto extends PartialType(CreateServicePackagesDto) {}
