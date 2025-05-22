import { Test, TestingModule } from '@nestjs/testing';
import { DoctorSpecializationController } from './doctor-specialization.controller';
import { DoctorSpecializationService } from './doctor-specialization.service';

describe('DoctorSpecializationController', () => {
  let controller: DoctorSpecializationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctorSpecializationController],
      providers: [DoctorSpecializationService],
    }).compile();

    controller = module.get<DoctorSpecializationController>(DoctorSpecializationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
