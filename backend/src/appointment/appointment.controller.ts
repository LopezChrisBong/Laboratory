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

    @Get('getAllPatient/:tabID')
  getAllPatient(@Param('tabID') tabID: string,@Headers() headers,) {
       var head_str = headers.authorization;
        const curr_user = currentUser(head_str);
    return this.appointmentService.getAllPatient(+tabID, curr_user);
  }
     @Get('getAllPatientForDoctor/:doctorID')
  getAllPatientForDoctor(@Param('doctorID') doctorID: string) {
    return this.appointmentService.getAllPatientForDoctor(+doctorID);
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

  @Get('getAllScheduleAppointment/AllAppointment')
  getAllScheduleAppointment() {
  return this.appointmentService.getAllScheduleAppointment();
}

  @Get('getBookedAppointment/:id')
  getBookedAppointment(@Param('id') id: string) {
    return this.appointmentService.getBookedAppointment(+id);
  }

    @Get('getAssignedBookedAppointment/Doctor/:id/:patientID')
  getAssignedBookedAppointmentDoctor(@Param('id') id: string,@Param('patientID') patientID: string) {
    return this.appointmentService.getAssignedBookedAppointmentDoctor(+id,+patientID);
  }

      @Get('getAssignedBookedAppointment/Medtech/:id/:patientID')
  getAssignedBookedAppointmentMedtech(@Param('id') id: string,@Param('patientID') patientID: string) {
    return this.appointmentService.getAssignedBookedAppointmentMedtech(+id,+patientID);
  }

      @Get('getAssignedBookedAppointment/Receptionist')
  getAssignedBookedAppointmentReceptionist() {
    return this.appointmentService.getAssignedBookedAppointmentReceptionist();
  }

    @Get('checkPatient/dataExist/:f_name/:l_name')
    checkPatient(@Param('f_name') f_name: string,@Param('l_name') l_name: string) {
    return this.appointmentService.checkPatient(f_name,l_name);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentService.update(+id, updateAppointmentDto);
  }


    @Patch('updatePatientInfo/:id')
  updatePatientInfo(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.appointmentService.updatePatientInfo(+id, updatePatientDto);
  }

    @Patch('updateServiceResult/:id')
  updateServiceResult(@Param('id') id: string, @Body() updateServiceResultsDto: UpdateServiceResultsDto) {
    return this.appointmentService.updateServiceResult(+id, updateServiceResultsDto);
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
