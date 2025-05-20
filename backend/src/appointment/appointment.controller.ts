import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { CreatePatientDto } from './dto/create-patient.dto';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create(createAppointmentDto);
  }

  @Post('addPatient')
  addPatient(@Body() createPatientDto: CreatePatientDto) {
    return this.appointmentService.addPatient(createPatientDto);
  }

  @Post('bookAppointment')
  bookAppointment(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.bookAppointment(createAppointmentDto);
  }

  @Get()
  findAll() {
    return this.appointmentService.findAll();
  }
  @Get('findAllDoctors')
  findAllDoctors() {
    return this.appointmentService.findAllDoctors();
  }

    @Get('getAllPatient')
  getAllPatient() {
    return this.appointmentService.getAllPatient();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(+id);
  }
  @Get('getAllSchedule/DataAppointment')
  getAllScheduleData() {
  return this.appointmentService.getAllScheduleData();
}


  @Get('getBookedAppointment/:id')
  getBookedAppointment(@Param('id') id: string) {
    return this.appointmentService.getBookedAppointment(+id);
  }

    @Get('checkPatient/dataExist/:f_name/:l_name')
    checkPatient(@Param('f_name') f_name: string,@Param('l_name') l_name: string) {
    return this.appointmentService.checkPatient(f_name,l_name);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentService.update(+id, updateAppointmentDto);
  }


    @Patch('updateServices/:id')
  updateServices(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentService.updateServices(+id, updateAppointmentDto);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(+id);
  }
}
