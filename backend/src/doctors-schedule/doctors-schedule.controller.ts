import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DoctorsScheduleService } from './doctors-schedule.service';
import { CreateDoctorsScheduleDto } from './dto/create-doctors-schedule.dto';
import { UpdateDoctorsScheduleDto } from './dto/update-doctors-schedule.dto';

@Controller('doctors-schedule')
export class DoctorsScheduleController {
  constructor(private readonly doctorsScheduleService: DoctorsScheduleService) {}

  @Post()
  create(@Body() createDoctorsScheduleDto: CreateDoctorsScheduleDto) {
    return this.doctorsScheduleService.create(createDoctorsScheduleDto);
  }

  @Get()
  findAll() {
    return this.doctorsScheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorsScheduleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorsScheduleDto: UpdateDoctorsScheduleDto) {
    return this.doctorsScheduleService.update(+id, updateDoctorsScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorsScheduleService.remove(+id);
  }
}
