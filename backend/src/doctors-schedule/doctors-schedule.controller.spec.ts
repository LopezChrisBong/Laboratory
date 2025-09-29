import { Test, TestingModule } from '@nestjs/testing';
import { DoctorsScheduleController } from './doctors-schedule.controller';
import { DoctorsScheduleService } from './doctors-schedule.service';

describe('DoctorsScheduleController', () => {
  let controller: DoctorsScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctorsScheduleController],
      providers: [DoctorsScheduleService],
    }).compile();

    controller = module.get<DoctorsScheduleController>(DoctorsScheduleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
