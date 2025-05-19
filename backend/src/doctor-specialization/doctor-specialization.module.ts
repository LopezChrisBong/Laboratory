import { Module } from '@nestjs/common';
import { DoctorSpecializationService } from './doctor-specialization.service';
import { DoctorSpecializationController } from './doctor-specialization.controller';
import { DoctorSpecialization } from './entities/doctor-specialization.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DoctorSpecialization]),],
  controllers: [DoctorSpecializationController],
  providers: [DoctorSpecializationService],
  exports: [DoctorSpecializationService]

})
export class DoctorSpecializationModule {}
