import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MedicalInfoService } from './medical-info.service';
import { CreateMedicalInfoDto } from './dto/create-medical-info.dto';
import { UpdateMedicalInfoDto } from './dto/update-medical-info.dto';
import { CreateMedicalCertificateDto } from './dto/create-medical-certificate.dto';

@Controller('medical-info')
export class MedicalInfoController {
  constructor(private readonly medicalInfoService: MedicalInfoService) {}

  @Post()
  create(@Body() createMedicalInfoDto: CreateMedicalInfoDto) {
    return this.medicalInfoService.create(createMedicalInfoDto);
  }

    @Post('addMedicalInfo')
  addMedicalInfo(@Body() createMedicalInfoDto: CreateMedicalInfoDto) {
    return this.medicalInfoService.addMedicalInfo(createMedicalInfoDto);
  }

      @Post('addMedicalCertificate')
  addMedicalCertificate(@Body() createMedicalCertificateDto: CreateMedicalCertificateDto) {
    return this.medicalInfoService.addMedicalCertificate(createMedicalCertificateDto);
  }

  @Get()
  findAll() {
    return this.medicalInfoService.findAll();
  }

  @Get('/patientMedicalInfo/:id')
  findOne(@Param('id') id: string) {
    return this.medicalInfoService.findOne(+id);
  }
    @Get('/patientMedicalCertificate/:id')
  getAllMedicalRecords(@Param('id') id: string) {
    return this.medicalInfoService.getAllMedicalRecords(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMedicalInfoDto: UpdateMedicalInfoDto) {
    return this.medicalInfoService.update(+id, updateMedicalInfoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicalInfoService.remove(+id);
  }
}
