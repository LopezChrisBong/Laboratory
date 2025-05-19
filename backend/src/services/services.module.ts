import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service, ServiceCategory, ServicePackages } from 'src/entities';

@Module({
    imports: [TypeOrmModule.forFeature([Service,ServicePackages, ServiceCategory])],
  controllers: [ServicesController],
  providers: [ServicesService]
})
export class ServicesModule {}
