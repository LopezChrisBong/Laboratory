import { Module } from '@nestjs/common';
import { DoctorSpecializationService } from './doctor-specialization.service';
import { DoctorSpecializationController } from './doctor-specialization.controller';
import { DoctorSpecialization } from './entities/doctor-specialization.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment, DoctorsSchedule, Patient, PatientDoctor, PatientMedtech, Service, ServiceAppointment, ServiceLabResult, ServicePackages, UserDetail, Users } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([DoctorSpecialization,UserDetail, Users, Patient, Appointment, Service, ServicePackages,PatientDoctor,PatientMedtech,ServiceLabResult,ServiceAppointment,DoctorsSchedule]),],
  controllers: [DoctorSpecializationController],
  providers: [DoctorSpecializationService],
  exports: [DoctorSpecializationService]

})
export class DoctorSpecializationModule {}
