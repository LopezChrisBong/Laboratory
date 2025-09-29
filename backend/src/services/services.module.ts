import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment, Patient, Service, ServiceAppointment, ServiceCategory, ServicePackages, UserDetail, Users } from 'src/entities';
import { ServiceLabResult } from './entities/service-lab-result.dto';

@Module({
    imports: [TypeOrmModule.forFeature([Service,ServicePackages, ServiceCategory, Appointment,ServiceAppointment,ServiceLabResult,Patient,UserDetail,Users])],
  controllers: [ServicesController],
  providers: [ServicesService]
})
export class ServicesModule {}
