import { Module } from '@nestjs/common';
import { MedicalInfoService } from './medical-info.service';
import { MedicalInfoController } from './medical-info.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment, MedicalInfo, Patient, PatientDoctor, PatientMedtech, Service, ServicePackages, UserDetail, Users } from 'src/entities';

@Module({
    imports: [TypeOrmModule.forFeature([UserDetail, Users, Patient, Appointment, Service, ServicePackages,PatientDoctor,PatientMedtech, MedicalInfo])],
  controllers: [MedicalInfoController],
  providers: [MedicalInfoService]
})
export class MedicalInfoModule {}
