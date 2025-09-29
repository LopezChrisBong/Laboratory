import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Notification, Appointment, Patient, Service, ServiceAppointment, ServiceCategory, ServiceLabResult, ServicePackages, UserDetail, Users } from 'src/entities';

@Module({
      imports: [TypeOrmModule.forFeature([Notification,Service,ServicePackages, ServiceCategory, Appointment,ServiceAppointment,ServiceLabResult,Patient,UserDetail,Users])],
  controllers: [NotificationController],
  providers: [NotificationService]
})
export class NotificationModule {}
