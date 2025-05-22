import { Controller, Get, Post, Body, Patch, Param, Delete,Headers, } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { CreatePatientDto } from './dto/create-patient.dto';
import { CreatePatientDoctorDto } from './dto/create-patient-doctor.dto';
import { CreatePatientMedtechDto } from './dto/create-patient-medtech.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { currentUser } from 'src/shared/jwtDecode';
import { UpdateServiceResultsDto } from './dto/update-service-result.dto';

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

    @Post('addPatient/Doctor')
  addPatientDoctor(@Body() createPatientDoctorDto: CreatePatientDoctorDto) {
    return this.appointmentService.addPatientDoctor(createPatientDoctorDto);
  }

      @Post('addPatient/Medtech')
  addPatientMedTech(@Body() createPatientMedtechDto: CreatePatientMedtechDto) {
    return this.appointmentService.addPatientMedTech(createPatientMedtechDto);
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
    @Get('findAllMedtech')
  findAllMedtech() {
    return this.appointmentService.findAllMedtech();
  }

    @Get('getAllPatient')
  getAllPatient() {
    return this.appointmentService.getAllPatient();
  }
     @Get('getAllPatientByRole/:doctorID')
  getAllPatientByRole(@Headers() headers,@Param('doctorID') doctorID: string) {
       var head_str = headers.authorization;
    const curr_user = currentUser(head_str);
    return this.appointmentService.getAllPatientByRole(+doctorID,curr_user);
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

    @Patch('updateServiceResult/:id')
  updateServiceResult(@Param('id') id: string, @Body() updateServiceResultsDto: UpdateServiceResultsDto) {
    return this.appointmentService.updateServiceResult(+id, updateServiceResultsDto);
  }


    @Patch('updateServices/:id')
  updateServices(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentService.updateServices(+id, updateAppointmentDto);
  }
  

      @Patch('updateAppointmentStatus/:id')
  updateAppointmentStatus(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentService.updateAppointmentStatus(+id, updateAppointmentDto);
  }

        @Patch('updatePatientStatus/:id')
  updatePatientStatus(@Param('id') id: string,  @Body() updatePatientDto: UpdatePatientDto) {
  
    return this.appointmentService.updatePatientStatus(+id, updatePatientDto);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(+id);
  }
}
