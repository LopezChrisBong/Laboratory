import { Module } from '@nestjs/common';
import { DoctorsScheduleService } from './doctors-schedule.service';
import { DoctorsScheduleController } from './doctors-schedule.controller';

@Module({
  controllers: [DoctorsScheduleController],
  providers: [DoctorsScheduleService]
})
export class DoctorsScheduleModule {}
