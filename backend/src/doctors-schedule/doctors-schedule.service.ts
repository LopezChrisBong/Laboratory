import { Injectable } from '@nestjs/common';
import { CreateDoctorsScheduleDto } from './dto/create-doctors-schedule.dto';
import { UpdateDoctorsScheduleDto } from './dto/update-doctors-schedule.dto';

@Injectable()
export class DoctorsScheduleService {
  create(createDoctorsScheduleDto: CreateDoctorsScheduleDto) {
    return 'This action adds a new doctorsSchedule';
  }

  findAll() {
    return `This action returns all doctorsSchedule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} doctorsSchedule`;
  }

  update(id: number, updateDoctorsScheduleDto: UpdateDoctorsScheduleDto) {
    return `This action updates a #${id} doctorsSchedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} doctorsSchedule`;
  }
}
