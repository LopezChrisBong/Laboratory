import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DoctorSpecializationService } from './doctor-specialization.service';
import { CreateDoctorSpecializationDto } from './dto/create-doctor-specialization.dto';
import { UpdateDoctorSpecializationDto } from './dto/update-doctor-specialization.dto';

@Controller('doctor-specialization')
export class DoctorSpecializationController {
  constructor(private readonly doctorSpecializationService: DoctorSpecializationService) {}

  @Post()
  create(@Body() createDoctorSpecializationDto: CreateDoctorSpecializationDto) {
    return this.doctorSpecializationService.create(createDoctorSpecializationDto);
  }
  
  @Get('getAllClinic')
  getAllClinic() {
    return this.doctorSpecializationService.getAllClinic();
  }

  @Get()
  findAll() {
    return this.doctorSpecializationService.findAll();
  }

    @Get('getMyScpecialty/:id')
  getMyScpecialty(@Param('id') id: string) {
    return this.doctorSpecializationService.getMyScpecialty(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorSpecializationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorSpecializationDto: UpdateDoctorSpecializationDto) {
    return this.doctorSpecializationService.update(+id, updateDoctorSpecializationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorSpecializationService.remove(+id);
  }
}
