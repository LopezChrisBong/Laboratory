import { Module } from '@nestjs/common';
import { LabTestService } from './lab-test.service';
import { LabTestController } from './lab-test.controller';
import { LabTest } from './entities/lab-test.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([LabTest]),],
  controllers: [LabTestController],
  providers: [LabTestService],
  exports: [LabTestService]

})
export class LabTestModule {}
