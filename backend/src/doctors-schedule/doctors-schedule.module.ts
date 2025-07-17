import { Module } from '@nestjs/common';
import { DoctorsScheduleService } from './doctors-schedule.service';
import { DoctorsScheduleController } from './doctors-schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDetail } from 'src/user-details/entities/user-detail.entity';
import { Appointment, DoctorSpecialization, DoctorsSchedule, Patient, PatientDoctor, PatientMedtech, Service, ServiceAppointment, ServiceLabResult, ServicePackages, Users } from 'src/entities';

@Module({
    imports: [TypeOrmModule.forFeature([UserDetail, Users, Patient, Appointment, Service, ServicePackages,PatientDoctor,PatientMedtech,ServiceLabResult,ServiceAppointment,DoctorsSchedule, DoctorSpecialization])],
  controllers: [DoctorsScheduleController],
  providers: [DoctorsScheduleService],
  exports:[DoctorsScheduleService]
})
export class DoctorsScheduleModule {}
