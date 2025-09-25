import { Controller, Get, Post, Body, Patch, Param, Delete,Headers, UseInterceptors,Request, Res, UploadedFiles, StreamableFile } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { CreatePatientDto } from './dto/create-patient.dto';
import { CreatePatientDoctorDto } from './dto/create-patient-doctor.dto';
import { CreatePatientMedtechDto } from './dto/create-patient-medtech.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { currentUser } from 'src/shared/jwtDecode';
import { UpdateServiceResultsDto } from './dto/update-service-result.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Helper } from 'src/shared/helper';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  
    @Post('/upload')
    @UseInterceptors(
      FilesInterceptor('file', 10, {
        storage: diskStorage({
          destination: Helper.lab_result_attachment,
          filename: Helper.customFileName,
        }),
      }),
    )
    upload_lab_attachment(
      @UploadedFiles()
      files: Array<Express.Multer.File>,
      @Request() request,
    ) {
      const bodystring = JSON.parse(request.body.body);
          // console.log(files,bodystring);
      return this.appointmentService.upload_lab_attachment(
        bodystring,
        files,
      );
    }
  
@Get('view/attachment/:data')
    getFile(
      @Param('data') data: string,
      @Res({ passthrough: true }) res,
    ): StreamableFile {
      let content_type = '';
      const datasplited = data.split('.');
      const ext = datasplited[datasplited.length - 1].toLowerCase();

      if (ext === 'jpeg') {
        content_type = 'image/jpeg';
      } else if (ext === 'jpg') {
        content_type = 'image/jpg';
      } else if (ext === 'png') {
        content_type = 'image/png';
      } else if (ext === 'pdf') {
        content_type = 'application/pdf';
      } else if (ext === 'mp4') {
        content_type = 'video/mp4';
      } else if (ext === 'avi') {
        content_type = 'video/x-msvideo';
      } else if (ext === 'mov') {
        content_type = 'video/quicktime';
      } else if (ext === 'wmv') {
        content_type = 'video/x-ms-wmv';
      } else if (ext === '3gp') {
        content_type = 'video/3gpp';
      } else if (ext === 'flv') {
        content_type = 'video/x-flv';
      } else if (ext === 'doc') {
        content_type = 'application/msword';
      } else if (ext === 'docx') {
        content_type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      } else if (ext === 'xls') {
        content_type = 'application/vnd.ms-excel';
      } else if (ext === 'xlsx') {
        content_type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      } else if (ext === 'ppt') {
        content_type = 'application/vnd.ms-powerpoint';
      } else if (ext === 'pptx') {
        content_type = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      } else if (ext === 'csv') {
        content_type = 'text/csv';
      } else if (ext === 'txt') {
        content_type = 'text/plain';
      } else if (ext === 'json') {
        content_type = 'application/json';
      } else if (ext === 'zip') {
        content_type = 'application/zip';
      } else if (ext === 'rar') {
        content_type = 'application/vnd.rar';
      } else if (ext === '7z') {
        content_type = 'application/x-7z-compressed';
      } else {
        content_type = 'application/octet-stream'; 
      }

      // const file = createReadStream(join(process.cwd(), '/lab_result_attachment/' + data));
      const file = createReadStream(join(process.cwd(), '/../lab_result_attachment/' + data));

      res.set({
        'Content-Type': content_type,
      });

      return new StreamableFile(file);
    }

  

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


     @Get('getAllPatientForMedtech/:medtechID')
  getAllPatientForMedtech(@Param('medtechID') medtechID: string) {
    return this.appointmentService.getAllPatientForMedtech(+medtechID);
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

  @Get('getAllAppointmentDashboard/DashboardData')
  getAllAppointmentDashboard() {
  return this.appointmentService.getAllAppointmentDashboard();
}

  @Get('getAllOverview/patientOverview/:year')
  patientOverview(@Param('year') year: string) {
  return this.appointmentService.patientOverview(+year);
}

  @Get('getAllDoctorsAppointment/:id')
  getAllDoctorsAppointment(@Param('id') id: string) {
  return this.appointmentService.getAllDoctorsAppointment(+id);
}

  @Get('getAllMedtechAppointment/:id')
  getAllMedtechAppointment(@Param('id') id: string) {
  return this.appointmentService.getAllMedtechAppointment(+id);
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


      @Patch('confirmAppointment/:id')
      confirmAppointment(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
        return this.appointmentService.confirmAppointment(+id, updateAppointmentDto);
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
