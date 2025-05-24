import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment, Patient, PatientDoctor, PatientMedtech, Service, ServiceAppointment, ServiceLabResult, ServicePackages, UserDetail, Users } from 'src/entities';



@Module({
  imports: [TypeOrmModule.forFeature([UserDetail, Users, Patient, Appointment, Service, ServicePackages,PatientDoctor,PatientMedtech,ServiceLabResult,ServiceAppointment])],
  controllers: [AppointmentController],
  providers: [AppointmentService]
})
export class AppointmentModule {}
