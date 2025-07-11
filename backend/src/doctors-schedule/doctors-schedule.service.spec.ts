import { Test, TestingModule } from '@nestjs/testing';
import { DoctorsScheduleService } from './doctors-schedule.service';

describe('DoctorsScheduleService', () => {
  let service: DoctorsScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoctorsScheduleService],
    }).compile();

    service = module.get<DoctorsScheduleService>(DoctorsScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
