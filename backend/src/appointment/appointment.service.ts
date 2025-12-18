import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Brackets, DataSource, Repository } from 'typeorm';
import { Appointment, Patient, PatientDoctor, PatientMedtech, Service, ServiceAppointment, ServiceLabResult, ServicePackages, UserDetail, Users } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDoctorDto } from './dto/update-patient-doctor.dto';
import { CreatePatientDoctorDto } from './dto/create-patient-doctor.dto';
import { CreatePatientMedtechDto } from './dto/create-patient-medtech.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { UpdateServiceResultsDto } from './dto/update-service-result.dto';
import * as dayjs from 'dayjs';
import { SmsService } from 'src/sms/sms.service';
import { newDateFormat } from 'src/shared/global-function';
import { In } from 'typeorm'
@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(UserDetail) private readonly userDetailRepository: Repository<UserDetail>,
    @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
    @InjectRepository(Patient) private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Appointment) private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Service) private readonly serviceRepository: Repository<Service>,
    @InjectRepository(ServicePackages) private readonly servicePackagesRepository: Repository<ServicePackages>,
    @InjectRepository(PatientDoctor) private readonly patientDoctorRepository: Repository<PatientDoctor>,
    @InjectRepository(PatientMedtech) private readonly patientMedtechRepository: Repository<PatientMedtech>,
    @InjectRepository(ServiceAppointment) private readonly serviceAppointmentRepository: Repository<ServiceAppointment>,
    @InjectRepository(ServiceLabResult) private readonly serviceLabResultRepository: Repository<ServiceLabResult>,
    private dataSource: DataSource,
    private readonly SMSServices:SmsService
  ){}

   async upload_lab_attachment( body:any, filename: any){
    // console.log(body, filename[0].filename)
    try {
        this.dataSource.manager.update(ServiceAppointment, body.updateID,{
        attachment:filename[0].filename,
        status:2
     })
   return {
        msg:'Successfully Added',
        status:HttpStatus.OK
      }
  } catch (error) {
  
    return {
      msg:'Error:'+error,
      status:HttpStatus.BAD_REQUEST,
      filePath:filename[0].filename,
      originalName:filename[0].originalname,
    }
  }
}

  create(createAppointmentDto: CreateAppointmentDto) {
    return 'This action adds a new appointment';
  }

 async addPatient(createPatientDto:CreatePatientDto){
  console.log(createPatientDto)
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let patient = createPatientDto;
            const isExist = await this.patientRepository.findOneBy({ f_name: patient.f_name, l_name:patient.l_name});
            if(!isExist){
          const data = queryRunner.manager.create(Patient, {
          f_name: patient.f_name,
          l_name: patient.l_name,
          suffix: patient.suffix,
          m_name: patient.m_name,
          age: patient.age,
          civil_status: patient.civil_status,
          occupation: patient.occupation,
          gender: patient.gender,
          contact_no: patient.contact_no,
          b_date: patient.b_date,
          address: patient.address,
          region: patient.region,
          province: patient.province,
          city_muni: patient.city_muni,
          baranggay: patient.baranggay,
          purok: patient.purok,
          spouse: patient.spouse
        });

        let savedCategory = await queryRunner.manager.save(data);
           await queryRunner.commitTransaction();
      return {
        
        msg: 'Saved successfully!',
        status: HttpStatus.OK,
        id:savedCategory.id,
        duplicate:false,
      };
              }

        // // console.log(savedCategory.id);
      await queryRunner.commitTransaction();
      return {
        
        msg: 'Saved successfully!',
        status: HttpStatus.OK,
        id:isExist.id,
        duplicate:true,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return {
        msg: 'Saving failed!' + error,
        status: HttpStatus.BAD_REQUEST,
        errorCode: error.code
      };
    }

    finally {
      await queryRunner.release();
    }
  }

  async bookAppointment(createAppointmentDto:CreateAppointmentDto){
    
  
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let appointment = createAppointmentDto;
      // const isExist = await this.appointmentRepository.findOneBy({patientID: appointment.patientID, status:0});
      const isExist = await this.appointmentRepository.findOne({where: {patientID: appointment.patientID,status: In([0, 1]),}})

      if(!isExist){
        const data = queryRunner.manager.create(Appointment, {
          patientID: appointment.patientID,
          date: appointment.date,
          time: appointment.time,
          clinic:appointment.clinic,
          status:appointment.status ? appointment.status : appointment.clinic != 'Others' ? 1 : 0,
          doctorID:appointment.doctorID,
        });
         let save = await queryRunner.manager.save(data);
        let patient = await queryRunner.manager.createQueryBuilder(Patient, 'pt')
        .where('pt.id = :id',{id:appointment.patientID})
        .getOne()
          let smsData = JSON.parse(createAppointmentDto.data)
          let sched_date = smsData.date
          let sched_time = smsData.time
          let patientName = smsData.f_name+' '+ smsData.l_name
          let doctorName = smsData.doctor[0].name
          let doctorSpecialization = smsData.doctor[0].specialization[0].specialty
          let message = 'Subject: Submission of Appointment to PARAGON\n';
          message+='\nHi '+patientName+',\n';
          message+='\nThank you for booking with Paragon Diagnostics & Multi-Specialty Clinic! Here are your appointment details:\n';
          message+='\nDate: '+sched_date+'\n';
          message+='Time: '+sched_time+'\n';
          message+='Doctor: '+doctorName+'\n';
          message+='Specialization: '+doctorSpecialization+'\n';
          message+='\nFor questions or clarifications, message us on our official Facebook page: Paragon Diagnostics and Multi-Specialty Clinic.\n';
        
        let sms= {
            recipient: patient.contact_no.toString(),
            message:message,
        }
        await this.SMSServices.sendSms(sms)

      
      await queryRunner.manager.update(Patient, { id: appointment.patientID}, {
      status:0,
      });
       await queryRunner.commitTransaction();
      return {
        msg: 'Saved successfully!',
        status: HttpStatus.OK,
        saveID: save.id
      };

      }else{
      await queryRunner.rollbackTransaction();
      return {
        msg: 'Theres is another appointment that is pending!',
        status: HttpStatus.BAD_REQUEST,
      };
      }

    } catch (error) {
      await queryRunner.rollbackTransaction();
      return {
        msg: 'Saving failed!' + error,
        status: HttpStatus.BAD_REQUEST,
      };
    } finally {
      await queryRunner.release();
    }
  }


    async bookDoctorPatientAppointment(createAppointmentDto:CreateAppointmentDto){

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let appointment = createAppointmentDto;
      // const isExist = await this.appointmentRepository.findOneBy({patientID: appointment.patientID, status:0});
      const isExist = await this.appointmentRepository.findOne({where: {patientID: appointment.patientID,status: In([0, 1]),}})

      if(!isExist){
        const data = queryRunner.manager.create(Appointment, {
          patientID: appointment.patientID,
          date: appointment.date,
          time: appointment.time,
          clinic:appointment.clinic,
          status:appointment.status ? appointment.status : appointment.clinic != 'Others' ? 1 : 0,
          doctorID:appointment.doctorID,
        });
         let save = await queryRunner.manager.save(data);
        // let patient = await queryRunner.manager.createQueryBuilder(Patient, 'pt')
        // .where('pt.id = :id',{id:appointment.patientID})
        // .getOne()
        
        // let sms= {
        //     recipient: patient.contact_no.toString(),
        //     message: 'You have an appointment on \nDate: '+ newDateFormat(appointment.date)+"\nTime: "+appointment.time,
        // }
        // await this.SMSServices.sendSms(sms)

      
      await queryRunner.manager.update(Patient, { id: appointment.patientID}, {
      status:0,
      });
       await queryRunner.commitTransaction();
      return {
        msg: 'Saved successfully!',
        status: HttpStatus.OK,
        saveID: save.id
      };

      }else{
      await queryRunner.rollbackTransaction();
      return {
        msg: 'Theres is another appointment that is pending!',
        status: HttpStatus.BAD_REQUEST,
      };
      }

    } catch (error) {
      await queryRunner.rollbackTransaction();
      return {
        msg: 'Saving failed!' + error,
        status: HttpStatus.BAD_REQUEST,
      };
    } finally {
      await queryRunner.release();
    }
  }


  async bookWithRange(createAppointmentDto:CreateAppointmentDto){
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
        
       let data = JSON.parse(createAppointmentDto.data)
      //  const isExist = await this.appointmentRepository.findOneBy({patientID: data.patientID, status:1});
      // const isExist = await this.appointmentRepository.findOne({where: {patientID: data.patientID,status: In([0, 1])}});
      // if(!isExist){
          for (let i = 0; i < data.dates.length; i++) {
          const saveData = queryRunner.manager.create(Appointment, {
          patientID: data.patientID,
          date: data.dates[i],
          time: data.time,
          clinic:data.clinic,
          status:data.status,
          doctorID:data.doctorID,
        });
        console.log(saveData)
          await queryRunner.manager.save(saveData);
      }

        //sms
        // let patient = await queryRunner.manager.createQueryBuilder(Patient, 'pt')
        // .where('pt.id = :id',{id:data.patientID})
        // .getOne()
        // const formattedDates = data.dates.map(d => newDateFormat(d)).join(', ')
        // let message = `You have appointments on: ${formattedDates}\nTime: ${data.time}`
        // if (message.length > 135) {
        //   message = message.slice(0, 132) + '...' 
        // }
        
        // let sms= {
        //     recipient: patient.contact_no.toString(),
        //     message
        // }
        // await this.SMSServices.sendSms(sms)


       await queryRunner.commitTransaction();
       return {
        msg: 'Saved successfully!',
        status: HttpStatus.OK,
      };


      // }else{
      //   console.log('naa na daan')
      // await queryRunner.rollbackTransaction();
      // return {
      //   msg: 'Theres is another appointment that is pending!',
      //   status: HttpStatus.BAD_REQUEST,
      // };
      // }

      
      } catch (error) {
      await queryRunner.rollbackTransaction();
      return {
        msg: 'Saving failed!' + error,
        status: HttpStatus.BAD_REQUEST,
      };
    } finally {
      await queryRunner.release();
    }

  }

  async addPatientDoctor(createPatientDoctorDto:CreatePatientDoctorDto){
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let infoID = createPatientDoctorDto;
      // // console.log(infoID)
      if(infoID.appointmentID){
        //  // console.log('Info1',infoID.appointmentID)
       const isExist = await this.patientDoctorRepository.findOneBy({appointmentID: infoID.appointmentID, patientID:infoID.patientID});
      
       if(!isExist){
      const data = queryRunner.manager.create(PatientDoctor, {
          patientID: infoID.patientID,
          doctorID: infoID.doctorID,
          appointmentID: infoID.appointmentID,
        });
        await queryRunner.manager.save(data);
      }

      await queryRunner.manager.update(PatientDoctor, { appointmentID: infoID.appointmentID }, {
       doctorID: infoID.doctorID,
        });


      await queryRunner.manager.update(Patient, { id: infoID.patientID }, {
      doctorID: infoID.doctorID,
      });

      await queryRunner.manager.update(Appointment, { id: infoID.appointmentID }, {
        doctorID: infoID.doctorID,
        });

        await queryRunner.manager.update(ServiceAppointment, { id: infoID.labID }, {
        doctorID: infoID.doctorID,
        });
      
      await queryRunner.commitTransaction();
      return {
        
        msg: 'Saved successfully!',
        status: HttpStatus.OK,
      };
      }
      else{
        //  // console.log('Info2',infoID)
         const isExist = await this.patientDoctorRepository.findOneBy({labID: infoID.labID, patientID:infoID.patientID});

        //  // console.log(isExist)

      if(!isExist){
      const data = queryRunner.manager.create(PatientDoctor, {
      patientID: infoID.patientID,
      doctorID: infoID.doctorID,
      labID: infoID.labID,
        });
        await queryRunner.manager.save(data);
      }

        await queryRunner.manager.update(PatientDoctor, { labID: infoID.labID }, {
       doctorID: infoID.doctorID,
        });


      await queryRunner.manager.update(Patient, { id: infoID.patientID }, {
      doctorID: infoID.doctorID,
      });


      await queryRunner.manager.update(ServiceAppointment, { id: infoID.labID }, {
        doctorID: infoID.doctorID,
        });

              await queryRunner.commitTransaction();
      return {
        msg: 'Saved successfully!',
        status: HttpStatus.OK,
      };

      }


    } catch (error) {
      await queryRunner.rollbackTransaction();
      return {
        msg: 'Saving failed!' + error,
        status: HttpStatus.BAD_REQUEST,
        errorCode: error.code
      };
    }

//     catch (error) {
//   if (error.code === '23505') { // Postgres unique violation
//     throw new ConflictException('Email already exists');
//   }
//   throw error; // rethrow if not handled
// }
    
    finally {
      await queryRunner.release();
    }
  }

    async addPatientMedTech(createPatientMedtechDto:CreatePatientMedtechDto){
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let infoID = createPatientMedtechDto
      if(infoID.appointmentID){

       const isExist = await this.patientMedtechRepository.findOneBy({appointmentID: infoID.appointmentID, patientID:infoID.patientID});
      // // console.log('INFFFOOOO',infoID)
      if(!isExist){
        // // console.log('Added')
        const data = queryRunner.manager.create(PatientMedtech, {
          patientID: infoID.patientID,
          medtechID: infoID.medtechID,
          appointmentID: infoID.appointmentID,
        });

       await queryRunner.manager.save(data);
      }


       await queryRunner.manager.update(PatientMedtech, { appointmentID: infoID.appointmentID }, {
       medtechID:infoID.medtechID,
        });


      await queryRunner.manager.update(Patient, { id: infoID.patientID }, {
      medtechID:infoID.medtechID,
      });

      await queryRunner.manager.update(Appointment, { id: infoID.appointmentID }, {
        medtechID:infoID.medtechID,
        });
        
          await queryRunner.manager.update(ServiceAppointment, { id: infoID.labID }, {
        medtechID: infoID.medtechID,
        });
      
      await queryRunner.commitTransaction();
      return {
        
        msg: 'Saved successfully!',
        status: HttpStatus.OK,
      };
    }else{
        const isExist = await this.patientMedtechRepository.findOneBy({labID: infoID.labID, patientID:infoID.patientID});

        //  // console.log(isExist)

      if(!isExist){
      const data = queryRunner.manager.create(PatientMedtech, {
      patientID: infoID.patientID,
      medtechID: infoID.medtechID,
      labID: infoID.labID,
        });
        await queryRunner.manager.save(data);
      }

        await queryRunner.manager.update(PatientMedtech, { labID: infoID.labID }, {
       medtechID: infoID.medtechID,
        });


      await queryRunner.manager.update(Patient, { id: infoID.patientID }, {
      medtechID: infoID.medtechID,
      });


      await queryRunner.manager.update(ServiceAppointment, { id: infoID.labID }, {
        medtechID: infoID.medtechID,
        });

              await queryRunner.commitTransaction();
      return {
        msg: 'Saved successfully!',
        status: HttpStatus.OK,
      };
    }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return {
        msg: 'Saving failed!' + error,
        status: HttpStatus.BAD_REQUEST,
        errorCode: error.code
      };
    }

//     catch (error) {
//   if (error.code === '23505') { // Postgres unique violation
//     throw new ConflictException('Email already exists');
//   }
//   throw error; // rethrow if not handled
// }
    
    finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return `This action returns all appointment`;
  }

 async findAllDoctors(){
      let data = await this.userDetailRepository
      .createQueryBuilder('ud')
      .select([
        "IF (!ISNULL(ud.mname), concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,'. ',ud.lname) ,concat(ud.fname, ' ', ud.lname)) as name",
        'ud.id as id',
      ])
      .leftJoin(Users, 'us', 'us.id = ud.userID')
      .where('us.isAdminApproved = 1')
      .andWhere('us.user_roleID = 3')
      .getRawMany();
      // // console.log(data)
      return data
  }


      async checkMobileNumber(mobile_no: string) {
      const patient = await this.patientRepository.findOne({
        where: { contact_no: mobile_no }
      });
      // console.log(patient)

      if (!patient) return { exists: false, hasPending: false };

      const appt = await this.appointmentRepository.count({
        where: {
          patientID: patient.id.toString(),
          status: In([0,1])
        }
      });
      // console.log("hasPending:", appt > 0,'exists', appt)
      return {
        exists: true,
        hasPending: appt > 0,
        patient
      };
    }


   async findAllMedtech(){
      let data = await this.userDetailRepository
      .createQueryBuilder('ud')
      .select([
        "IF (!ISNULL(ud.mname), concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,'. ',ud.lname) ,concat(ud.fname, ' ', ud.lname)) as name",
        'ud.id as id',
      ])
      .leftJoin(Users, 'us', 'us.id = ud.userID')
      .where('us.isAdminApproved = 1')
      .andWhere('us.assignedModuleID = 2')
      .getRawMany();
      // // console.log(data)
      return data
  }

  async getAllPatient(tabID:number, user:any){
    //  console.log('Love',user.userdetail.user.assignedModuleID)
    let data
    if(tabID == 1){

      if(user.userdetail.user.assignedModuleID == 3){
       data = await this.patientRepository
      .createQueryBuilder('pt')
      .select([
        "IF (!ISNULL(pt.m_name), concat(pt.f_name, ' ',SUBSTRING(pt.m_name, 1, 1) ,'. ',pt.l_name) ,concat(pt.f_name, ' ', pt.l_name)) as name",
        " ap.date as date",
        " ap.time as time",
        " ap.clinic as clinic",
        "IF (!ISNULL(ud.mname), concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,'. ',ud.lname) ,concat(ud.fname, ' ', ud.lname)) as doctor_name",
        "pt.*",
        "pt.id as patientID",

      ])
      .leftJoin(Appointment, 'ap', 'ap.patientID = pt.id')
      .leftJoin(UserDetail, 'ud', 'ud.id = ap.doctorID')
      .orderBy('ap.date', "DESC")
      .groupBy('pt.patientID')
      .getRawMany()
      }
      else{
      data = await this.patientRepository
      .createQueryBuilder('pt')
      .select([
        "IF (!ISNULL(pt.m_name), concat(pt.f_name, ' ',SUBSTRING(pt.m_name, 1, 1) ,'. ',pt.l_name) ,concat(pt.f_name, ' ', pt.l_name)) as name",
        " pt.*",
      ])
      .groupBy('pt.patientID')
      .getRawMany()
      }
    }else if(tabID == 2){
          const users = await this.serviceAppointmentRepository
            .createQueryBuilder('pt')
            .where('pt.medtechID IS NOT NULL')
            .andWhere('pt.medtechID != :empty', { empty: '' })
            .getMany();
           
        if(users){
        data = await this.patientRepository
      .createQueryBuilder('pt')
      .select([
        "IF (!ISNULL(pt.m_name), concat(pt.f_name, ' ',SUBSTRING(pt.m_name, 1, 1) ,'. ',pt.l_name) ,concat(pt.f_name, ' ', pt.l_name)) as name",
        " pt.*",
      ])
      .leftJoin(ServiceAppointment, 'ap', 'ap.patientID = pt.id')
      .where('ap.status = 0 OR ap.status = 1')
      // .andWhere('ap.medtechID != :empty', { empty: '' })
      .groupBy('pt.patientID')
      .getRawMany()
        }else{
          console.log('Wala')
           data = []
        }
      

    }else if(tabID == 3){

        const users = await this.appointmentRepository
          .createQueryBuilder('pt')
          .where('pt.status = 1')  
          .getMany();

            if (users) {
              data = await this.patientRepository
                .createQueryBuilder('pt')
                .select([
                  "IF (!ISNULL(pt.m_name), concat(pt.f_name, ' ',SUBSTRING(pt.m_name, 1, 1) ,'. ',pt.l_name) ,concat(pt.f_name, ' ', pt.l_name)) as name",
                  "IF (!ISNULL(ud.mname), concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,'. ',ud.lname) ,concat(ud.fname, ' ', ud.lname)) as doctor_name",
                  "ap.*",
                  "ap.id as appointmentID",
                  "ap.date as date",
                  "ap.clinic as clinic",
                ])
                .leftJoin(Appointment, 'ap', 'ap.patientID = pt.id')
                .leftJoin(UserDetail, 'ud', 'ud.id = ap.doctorID')
                .where('ap.status = 1')            
                .andWhere('ap.doctorID IS NOT NULL')
                .orderBy('ap.date', 'DESC')
                .groupBy('pt.patientID')
                .getRawMany();
            } else {
              console.log('NAA');
              data = [];
            }

    }else if(tabID == 4){
       data = await this.patientRepository
      .createQueryBuilder('pt')
      .select([
        "IF (!ISNULL(pt.m_name), concat(pt.f_name, ' ',SUBSTRING(pt.m_name, 1, 1) ,'. ',pt.l_name) ,concat(pt.f_name, ' ', pt.l_name)) as name",
        " pt.*",
      ])
      .where('pt.status = 3')
      .getRawMany()
    }
      return data
  }

  //   async getAllPatientForDoctor(doctorID:number){
  //   const data = await this.appointmentRepository
  //     .createQueryBuilder("ap")
  //     .innerJoin(
  //       qb =>
  //         qb
  //           .from(Appointment, "sub")
  //           .select("sub.patientID", "patientID")
  //           .addSelect(`
  //             CASE 
  //               WHEN SUM(sub.status = 1) > 0 
  //                 THEN MIN(CASE WHEN sub.status = 1 THEN sub.date END)
  //               ELSE MAX(CASE WHEN sub.status = 3 THEN sub.date END)
  //             END
  //           `, "targetDate")

  //           .where("sub.doctorID = :doctorID", { doctorID })
  //           .groupBy("sub.patientID"),
  //       "target",
  //       "target.patientID = ap.patientID AND target.targetDate = ap.date"
  //     )
  //     .leftJoin(Patient, "pt", "pt.id = ap.patientID")
  //     .leftJoin(UserDetail, "ud", "ud.id = ap.doctorID")
  //     .select([
  //       "IF (!ISNULL(pt.m_name), concat(pt.f_name, ' ',SUBSTRING(pt.m_name, 1, 1) ,'. ',pt.l_name) ,concat(pt.f_name, ' ', pt.l_name)) as name",
  //       "IF (!ISNULL(ud.mname), concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,'. ',ud.lname) ,concat(ud.fname, ' ', ud.lname)) as doctor_name",
  //       "pt.*",
  //       "ap.*",
  //       "ap.id as appointmentID",
  //       "ap.date as date",
  //       "ap.time as time"
  //     ])
  //     .orderBy("ap.date", "ASC")
  //     .addOrderBy("ap.time", "ASC")
  //     .getRawMany();
  //     return data
  // }
  async getAllPatientForDoctor(doctorID: number) {
  const data = await this.appointmentRepository
    .createQueryBuilder("ap")
    .where("ap.doctorID = :doctorID", { doctorID })
    .innerJoin(
      qb => qb
        .from(Appointment, "sub")
        .select("sub.patientID", "patientID")
        .addSelect(`
          CASE 
            WHEN SUM(sub.status = 1) > 0 
              THEN MIN(CASE WHEN sub.status = 1 THEN sub.date END)
            ELSE MAX(CASE WHEN sub.status = 3 THEN sub.date END)
          END
        `, "targetDate")
        .where("sub.doctorID = :doctorID", { doctorID })
        .groupBy("sub.patientID")
        .having("COUNT(sub.id) > 0"),  
      "target",
      "target.patientID = ap.patientID AND target.targetDate = ap.date"
    )
    .innerJoin(Patient, "pt", "pt.id = ap.patientID") 

    .leftJoin(UserDetail, "ud", "ud.id = ap.doctorID")
    .select([
      "IF (!ISNULL(pt.m_name), concat(pt.f_name, ' ',SUBSTRING(pt.m_name, 1, 1) ,'. ',pt.l_name) ,concat(pt.f_name, ' ', pt.l_name)) as name",
      "IF (!ISNULL(ud.mname), concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,'. ',ud.lname) ,concat(ud.fname, ' ', ud.lname)) as doctor_name",
      "pt.*",
      "ap.*",
      "ap.id as appointmentID",
      "ap.date as date",
      "ap.time as time"
    ])
    .orderBy("ap.date", "ASC")
    .addOrderBy("ap.time", "ASC")
    .getRawMany();

  return data;
}


async getAllPatientForMedtech(medtechID: number) {
  const data = await this.serviceAppointmentRepository
  .createQueryBuilder("sa")
  .innerJoin(
    qb => qb
      .from("service_appointment", "latest")
      .select("MAX(latest.id)", "latestId")
      .addSelect("latest.patientID", "patientID")
      .where("latest.medtechID = :medtechID", { medtechID })
      .groupBy("latest.patientID"),
    "l",
    "l.latestId = sa.id"
  )
  .leftJoin(Patient, "pt", "pt.id = sa.patientID")
  .select([
    `IF(
      !ISNULL(pt.m_name),
      CONCAT(pt.f_name, ' ', SUBSTRING(pt.m_name,1,1), '. ', pt.l_name),
      CONCAT(pt.f_name, ' ', pt.l_name)
    ) AS name`,
    "pt.*",
    "sa.*",
    "pt.id AS patientID",
    "sa.service_list",
    "sa.package_list",
    "sa.status",
    `(
      SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
          'id', ss.id,
          'type', ss.service_type,
          'description', ss.service_description,
          'price', ss.service_price
        )
      )
      FROM service ss
      WHERE JSON_CONTAINS(sa.service_list, CAST(ss.id AS JSON))
      ORDER BY ss.service_description ASC
    ) AS availed_services`,

    // Latest packages only
    `(
      SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
          'id', spp.id,
          'description', spp.description,
          'price', spp.price,
          'services',
            (
              SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                  'id', ps2.id,
                  'type', ps2.service_type,
                  'description', ps2.service_description,
                  'price', ps2.service_price
                )
              )
              FROM service ps2
              WHERE JSON_CONTAINS(JSON_EXTRACT(spp.selected_modules, '$[*].id'), CAST(ps2.id AS JSON))
              ORDER BY ps2.service_description ASC
            )
        )
      )
      FROM service_packages spp
      WHERE JSON_CONTAINS(sa.package_list, CAST(spp.id AS JSON))
      ORDER BY spp.description ASC
    ) AS availed_packages`
  ])
  .setParameter("medtechID", medtechID)
  .getRawMany();

    console.log(data)

  return data;
}


  async getAllPatientByRole(doctorID: number, user:any, tab:number) {
   
 
          let role = user.userdetail.user.assignedModuleID
    let query;
    if (role === 2) {
      query = this.serviceAppointmentRepository
        .createQueryBuilder("sa")
        .leftJoin(Patient, "pt", "pt.id = sa.patientID")

        .leftJoin(
          Service,
          "s",
          `JSON_CONTAINS(sa.service_list, CAST(s.id AS JSON))`
        )

        .leftJoin(
          ServicePackages,
          "sp",
          `JSON_CONTAINS(sa.package_list, CAST(sp.id AS JSON))`
        )

        .leftJoin(
          Service,
          "ps",
          `JSON_CONTAINS(JSON_EXTRACT(sp.selected_modules, '$[*].id'), CAST(ps.id AS JSON))`
        )

        .select([
          `IF(
            !ISNULL(pt.m_name),
            CONCAT(pt.f_name, ' ', SUBSTRING(pt.m_name, 1, 1), '. ', pt.l_name),
            CONCAT(pt.f_name, ' ', pt.l_name)
          ) AS name`,

          "pt.*",
          "pt.id AS patientID",

          "sa.service_list AS sa_service_list",
          "sa.package_list AS sa_package_list",

          "sa.status",
          "sa.doctorID",
          "sa.medtechID",
          "sa.created_at",
          "sa.updated_at",
          "sa.attachment",
          `
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', s.id,
              'type', s.service_type,
              'description', s.service_description,
              'price', s.service_price
            )
          ) AS availed_services
          `,

          `
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', sp.id,
              'description', sp.description,
              'price', sp.price,
              'services',
                (
                  SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                      'id', ps2.id,
                      'type', ps2.service_type,
                      'description', ps2.service_description,
                      'price', ps2.service_price
                    )
                  )
                  FROM service ps2
                  WHERE JSON_CONTAINS(JSON_EXTRACT(sp.selected_modules, '$[*].id'), CAST(ps2.id AS JSON))
                )
            )
          ) AS availed_packages
          `
        ])

        .where("sa.medtechID = :doctorID", { doctorID })
        .andWhere("sa.status IN (0,1)")
        .groupBy("pt.id");
  
    } 
    else if (role === 5) {
     query = this.appointmentRepository
      .createQueryBuilder('ap')
      .select([
        "IF (!ISNULL(pt.m_name), concat(pt.f_name, ' ',SUBSTRING(pt.m_name, 1, 1) ,'. ',pt.l_name) ,concat(pt.f_name, ' ', pt.l_name)) as name",
        "IF (!ISNULL(ud.mname), concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,'. ',ud.lname) ,concat(ud.fname, ' ', ud.lname)) as doctor_name",
        "pt.*",
        "ap.id as appointmentID",
        "ap.date as date",
        "ap.time as time",
        "pt.id as patientID",
      ])
      .leftJoin(Patient, 'pt', 'pt.id = ap.patientID')
      .leftJoin(UserDetail, 'ud', 'ud.id = ap.doctorID')
      .where('ap.doctorID = :doctorID', { doctorID })
      .andWhere('ap.status = 1')
      .andWhere(`
        ap.id = (
            SELECT ap2.id
            FROM appointment ap2
            WHERE ap2.patientID = ap.patientID
            AND ap2.status = 1
            ORDER BY ap2.date ASC, ap2.time ASC
            LIMIT 1
        )
      `) 
      .orderBy('ap.date', 'ASC')
      .addOrderBy('ap.time', 'ASC')
    // query.andWhere('pt.medtechID IS EQUAL NULL');
    // query.andWhere('pt.medtechID == :empty', { empty: '' })
    }else{
       query = this.serviceAppointmentRepository
        .createQueryBuilder("sa")
        .leftJoin(Patient, "pt", "pt.id = sa.patientID")

        .leftJoin(
          Service,
          "s",
          `JSON_CONTAINS(sa.service_list, CAST(s.id AS JSON))`
        )

        .leftJoin(
          ServicePackages,
          "sp",
          `JSON_CONTAINS(sa.package_list, CAST(sp.id AS JSON))`
        )

        .leftJoin(
          Service,
          "ps",
          `JSON_CONTAINS(JSON_EXTRACT(sp.selected_modules, '$[*].id'), CAST(ps.id AS JSON))`
        )

        .select([
          `IF(
            !ISNULL(pt.m_name),
            CONCAT(pt.f_name, ' ', SUBSTRING(pt.m_name, 1, 1), '. ', pt.l_name),
            CONCAT(pt.f_name, ' ', pt.l_name)
          ) AS name`,

          "pt.*",
          "pt.id AS patientID",

          "sa.service_list AS sa_service_list",
          "sa.package_list AS sa_package_list",

          "sa.status",
          "sa.doctorID",
          "sa.medtechID",
          "sa.created_at",
          "sa.updated_at",
          "sa.attachment",
          `
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', s.id,
              'type', s.service_type,
              'description', s.service_description,
              'price', s.service_price
            )
          ) AS availed_services
          `,
          `
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', sp.id,
              'description', sp.description,
              'price', sp.price,
              'services',
                (
                  SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                      'id', ps2.id,
                      'type', ps2.service_type,
                      'description', ps2.service_description,
                      'price', ps2.service_price
                    )
                  )
                  FROM service ps2
                  WHERE JSON_CONTAINS(JSON_EXTRACT(sp.selected_modules, '$[*].id'), CAST(ps2.id AS JSON))
                )
            )
          ) AS availed_packages
          `
        ])
        .where("sa.status IN (0,1)")
        .groupBy("pt.id")
      }
    const data = await query.getRawMany();
  
  return data;
}

    async getBookedAppointment(id:number){
      // // console.log(id)
      let data = await this.appointmentRepository
      .createQueryBuilder('ap')
      .select([
        " ap.*",
         "IF (!ISNULL(ud.mname), concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,'. ',ud.lname) ,concat(ud.fname, ' ', ud.lname)) as Doc_name",
         "IF (!ISNULL(us.mname), concat(us.fname, ' ',SUBSTRING(us.mname, 1, 1) ,'. ',us.lname) ,concat(us.fname, ' ', us.lname)) as Med_name",
         "us.liscence_no as liscence_no",
         "pm.medtechID as medtechID",
         "pd.doctorID as doctorID",
         "sa.service_list as service",
         "sa.package_list as service_package",
         "sa.id as labID",
         
      ])
      .leftJoin(Patient, 'pt', 'pt.id = ap.patientID')
      .leftJoin(ServiceAppointment, 'sa', 'sa.appointmentID = ap.id')
      .leftJoin(PatientDoctor, 'pd', 'pd.appointmentID = ap.id')
      .leftJoin(PatientMedtech, 'pm', 'pm.appointmentID = ap.id')
      .leftJoin(UserDetail, 'ud', 'ud.id = pd.doctorID')
      .leftJoin(UserDetail, 'us', 'us.id = pm.medtechID')
     
      .where('ap.patientID = :id',{id})
      .andWhere('ap.date != "null" ')
      .andWhere('ap.date != "null" ')
      .orderBy('ap.date', 'DESC')
      .getRawMany()
      // // console.log(data)
      return data
  }

  async getAssignedBookedAppointmentDoctor(id: number, patientID: number) {
  const data = await this.serviceAppointmentRepository
    .createQueryBuilder('sa')
    .select([
      'sa.*',
      'us.liscence_no AS liscence_no',
    ])
    .leftJoin(Patient, 'pt', 'pt.id = sa.patientID')
    .leftJoin(UserDetail, 'us', 'us.id = sa.medtechID')
    .andWhere('sa.patientID = :patientID', { patientID })
    .getRawMany();

  return await this.attachServiceAndPackages1(data);
}

async attachServiceAndPackages1(data: any[]) {
  for (const row of data) {
    const serviceIds = JSON.parse(row.service_list || '[]');
    row.services_availed = serviceIds.length
      ? await this.serviceRepository
          .createQueryBuilder('s')
          .where('s.id IN (:...ids)', { ids: serviceIds })
          .getMany()
      : [];

    const packageIds = JSON.parse(row.package_list || '[]');
    row.packages_availed = packageIds.length
      ? await this.servicePackagesRepository
          .createQueryBuilder('sp')
          .where('sp.id IN (:...ids)', { ids: packageIds })
          .getMany()
      : [];
  }

  console.log(data);
  return data;
}

//   async getAssignedBookedAppointmentDoctor(id: number, patientID: number) {
//   const data = await this.serviceAppointmentRepository
//     .createQueryBuilder('sa')
//     .select([
//       'sa.*',
//       "IF (!ISNULL(ud.mname), concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1), '. ',ud.lname), concat(ud.fname, ' ', ud.lname)) AS Doc_name",
//       "IF (!ISNULL(us.mname), concat(us.fname, ' ',SUBSTRING(us.mname, 1, 1), '. ',us.lname), concat(us.fname, ' ', us.lname)) AS Med_name",
//       'us.liscence_no AS liscence_no',
//     ])
//     .leftJoin(Patient, 'pt', 'pt.id = sa.patientID')
//     .leftJoin(UserDetail, 'ud', 'ud.id = sa.doctorID')
//     .leftJoin(UserDetail, 'us', 'us.id = sa.medtechID')
//     .andWhere('sa.patientID = :patientID', { patientID })
//     .getRawMany();

//   return await this.attachServiceAndPackages(data);
// }


  //   async getAssignedBookedAppointmentMedtech(id:number, patientID: number){
  //     console.log(id,patientID)
  //     let data = await this.serviceAppointmentRepository
  //     .createQueryBuilder('sa')
  //     .select([
  //       " sa.*",
  //        "us.liscence_no as liscence_no",
  //     ])
  //     .leftJoin(Patient, 'pt', 'pt.id = sa.patientID')
  //     .leftJoin(UserDetail, 'us', 'us.id = sa.medtechID')
  //     .where('sa.medtechID = :id',{id})
  //     .andWhere('sa.patientID = :patientID',{patientID})
  //     .getRawMany()
  //     console.log(data)
  //     return data
  // }

  async getAssignedBookedAppointmentMedtech(id: number, patientID: number) {
  const results = await this.serviceAppointmentRepository
    .createQueryBuilder('sa')
    .select('sa.*')
    .addSelect('us.liscence_no', 'liscence_no')
    .leftJoin(UserDetail, 'us', 'us.id = sa.medtechID')
    .where('sa.medtechID = :id', { id })
    .andWhere('sa.patientID = :patientID', { patientID })
    .getRawMany();

  return await this.attachServiceAndPackages(results);
}

async attachServiceAndPackages(data: any[]) {
  for (const row of data) {

    const serviceIds = JSON.parse(row.service_list || "[]");
    const packageIds = JSON.parse(row.package_list || "[]");

    row.services_availed = serviceIds.length
      ? await this.serviceRepository
          .createQueryBuilder("s")
          .where("s.id IN (:...ids)", { ids: serviceIds })
          .getMany()
      : [];

    row.packages_availed = packageIds.length
      ? await this.servicePackagesRepository
          .createQueryBuilder("sp")
          .where("sp.id IN (:...ids)", { ids: packageIds })
          .getMany()
      : [];
  }
  console.log(data)
  return data;
}

      async getAssignedBookedAppointmentReceptionist(){
     
      let data = await this.appointmentRepository
      .createQueryBuilder('ap')
      .select([
        " ap.*",
         "IF (!ISNULL(us.mname), concat(us.fname, ' ',SUBSTRING(us.mname, 1, 1) ,'. ',us.lname) ,concat(us.fname, ' ', us.lname)) as Med_name",
         "us.liscence_no as liscence_no",
      ])
      .leftJoin(Patient, 'pt', 'pt.id = ap.patientID')
      .leftJoin(UserDetail, 'us', 'us.id = pm.medtechID')
      .where('ap.service IS NOT NULL')
      .andWhere('ap.service_package IS NOT NULL')
      .getRawMany()
      // // console.log(data)
      return data
  } 

 async getAllScheduleData(){
let data = await this.appointmentRepository
  .createQueryBuilder('ap')
  .select([
    'ap.date AS date',
    'ap.time AS time'
  ])
  .getRawMany();

//     let data =[
//   { date: "2025-05-18", time: "08:00 AM" },
//   { date: "2025-05-18", time: "09:00 AM" },
  // { date: "2025-05-19", time: "10:00 AM" }
// ] 
// // console.log('Appointment',data);
      return data
  }

   async getAllScheduleAppointment(tab:number){
  let data = await this.appointmentRepository
  .createQueryBuilder('ap')
  .select([
    'ap.*',
    "IF (!ISNULL(p.m_name), concat(p.f_name, ' ',SUBSTRING(p.m_name, 1, 1) ,'. ',p.l_name) ,concat(p.f_name, ' ', p.l_name)) as name",
    'p.patientID as unique_patientID',
     "IF (!ISNULL(ud.mname), concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,'. ',ud.lname) ,concat(ud.fname, ' ', ud.lname)) as doctor_name",
  ])
  .leftJoin(Patient, 'p', 'p.id = ap.patientID')
  .leftJoin(UserDetail, 'ud', 'ud.id = ap.doctorID')
  .where('ap.medtechID IS NULL')
  if(tab == 1){
    data.andWhere('ap.status = 0')
  }else{
    data.andWhere('ap.status != 0')
  }
  data.orderBy('ap.date', 'DESC')
  let newData = await data.getRawMany();
  console.log(newData)
  return newData
  }

  async getAllAppointmentDashboard(){
  let totalPatient = await this.appointmentRepository
  .createQueryBuilder('ap')
  .select([
    'ap.*',
    "IF (!ISNULL(p.m_name), concat(p.f_name, ' ',SUBSTRING(p.m_name, 1, 1) ,'. ',p.l_name) ,concat(p.f_name, ' ', p.l_name)) as name",
    'p.patientID as unique_patientID'
  ])
  .leftJoin(Patient, 'p', 'p.id = ap.patientID')
  .where('ap.medtechID IS NULL')
  .andWhere('ap.status != 0')
  .getRawMany();

 let totalPatient30Days = await this.appointmentRepository
  .createQueryBuilder('ap')
  .select([
    'ap.*',
    "IF (!ISNULL(p.m_name), concat(p.f_name, ' ',SUBSTRING(p.m_name, 1, 1) ,'. ',p.l_name) ,concat(p.f_name, ' ', p.l_name)) as name",
    'p.patientID as unique_patientID'
  ])
  .leftJoin(Patient, 'p', 'p.id = ap.patientID')
  .where('ap.medtechID IS NULL')
  .andWhere('ap.date BETWEEN DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND CURDATE()')
  .andWhere('ap.status != 0')
  .getRawMany();

   let totalDoctors = await this.userDetailRepository
  .createQueryBuilder('ud')
  .select([
    'ud.*',
    "IF (!ISNULL(ud.mname), concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,'. ',ud.lname) ,concat(ud.fname, ' ', ud.lname)) as name",
  ])
  .leftJoin(Users, 'u', 'u.id = ud.userID')
  .where('u.assignedModuleID = 5')
  .getRawMany();


  return {totalPatient:totalPatient,totalPatient30Days:totalPatient30Days,totalDoctors:totalDoctors}
  }

async patientOverview(year: number) {
  let resultLab = await this.serviceAppointmentRepository.query(`
    SELECT 
        months.m AS month,
        COALESCE(COUNT(sa.id), 0) AS total
    FROM (
        SELECT 1 AS m UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION
        SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION
        SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12
    ) AS months
    LEFT JOIN service_appointment sa 
        ON MONTH(sa.created_at) = months.m
       AND YEAR(sa.created_at) = ?
       AND sa.status != 0
    GROUP BY months.m
    ORDER BY months.m
  `, [year]);
  
  let resultAppointment = await this.appointmentRepository.query(`
    SELECT 
        months.m AS month,
        COALESCE(COUNT(a.id), 0) AS total
    FROM (
        SELECT 1 AS m UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION
        SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION
        SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12
    ) AS months
    LEFT JOIN appointment a 
        ON MONTH(a.date) = months.m
       AND YEAR(a.date) = ?
       AND a.status != 0
    GROUP BY months.m
    ORDER BY months.m
  `, [year]);

  let totalLaboratory = resultLab.map(r => Number(r.total));
  let totalAppointment = resultAppointment.map(r => Number(r.total));

  return {
    totalLaboratory,
    totalAppointment,
  };
}


async getAllDoctorsAppointment(id: number) {
  const data = await this.appointmentRepository
    .createQueryBuilder('ap')
    .select([
      'ap.*',
      "IF (!ISNULL(p.m_name), concat(p.f_name, ' ',SUBSTRING(p.m_name, 1, 1) ,'. ',p.l_name) ,concat(p.f_name, ' ', p.l_name)) as name",
      'p.patientID as unique_patientID'
    ])
    .leftJoin(Patient, 'p', 'p.id = ap.patientID')
    .where('ap.medtechID IS NULL')
    .andWhere('ap.doctorID = :id', { id })
    .andWhere('ap.status != 3')
    .getRawMany();

  const colors = ['blue', 'green', 'orange', 'red', 'purple', 'indigo', 'teal'];

  const events = data.map(item => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const start = dayjs(`${item.date} ${item.time}`, 'YYYY-MM-DD hh:mm A');
    const end = start.add(30, 'minute'); 

    return {
      name: item.name,
      status: item.status,
      start: start.format('YYYY-MM-DD HH:mm'),
      end: end.format('YYYY-MM-DD HH:mm'),
      color: randomColor,
      time: item.time,
      date: item.date
    };
  });

  return events;
}


async getAllMedtechAppointment(id: number) {
  const data = await this.serviceAppointmentRepository
    .createQueryBuilder('ap')
    .select([
      "IF (!ISNULL(pt.m_name), concat(pt.f_name, ' ',SUBSTRING(pt.m_name, 1, 1) ,'. ',pt.l_name) ,concat(pt.f_name, ' ', pt.l_name)) as name",
      "ap.*",
    ])
    .leftJoin(Patient, 'pt', 'ap.patientID = pt.id')
    .where('ap.status = 0')
    .andWhere('ap.medtechID = :id', { id })
    .getRawMany();

  const colors = ['blue', 'green', 'orange', 'red', 'purple', 'indigo', 'teal'];

  const events = data.map(item => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    // use created_at field and convert to 24-hour format
    const createdAt = dayjs(item.created_at).format('YYYY-MM-DD HH:mm');

    return {
      name: item.name,
      start: createdAt,
      end: createdAt, // or maybe + some duration if you want
      color: randomColor,
    };
  });

  // console.log(events)
  return events;
}
   



  async checkPatient(f_name: string, l_name:string) {
    // // console.log(f_name)
    const isExist = await this.patientRepository.findOneBy({ f_name, l_name});
    // // console.log(isExist)
    return isExist;
  }


  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    // // console.log(updateAppointmentDto)
       try {
       this.dataSource.manager.update(Appointment, id,{
        clinic:updateAppointmentDto.clinic,
        date:updateAppointmentDto.date,
        time:updateAppointmentDto.time,
     })
     return{
       msg:'Updated successfully!', status:HttpStatus.CREATED
     }
   } catch (error) {
     return{
       msg:'Something went wrong!'+ error, status:HttpStatus.BAD_REQUEST
     }
   }
  }

  updatePatientInfo(id: number, updatePatientDto: UpdatePatientDto) {
    // // console.log(id)
       try {
       this.dataSource.manager.update(Patient, id,{
          f_name: updatePatientDto.f_name,
          l_name: updatePatientDto.l_name,
          suffix: updatePatientDto.suffix,
          m_name: updatePatientDto.m_name,
          age: updatePatientDto.age,
          civil_status: updatePatientDto.civil_status,
          occupation: updatePatientDto.occupation,
          gender: updatePatientDto.gender,
          contact_no: updatePatientDto.contact_no,
          b_date: updatePatientDto.b_date,
          address: updatePatientDto.address,
          spouse:updatePatientDto.spouse
     })
     return{
       msg:'Updated successfully!', status:HttpStatus.CREATED
     }
   } catch (error) {
     return{
       msg:'Something went wrong!'+ error, status:HttpStatus.BAD_REQUEST
     }
   }
  }


    async updateServiceResult(id: number, updateServiceResultsDto: UpdateServiceResultsDto) {
     
      let service_result = JSON.parse(updateServiceResultsDto.service_result)
      let package_result = JSON.parse(updateServiceResultsDto.package_result)
      // // console.log(service_result, package_result)
        const isExist = await this.appointmentRepository.findOneBy({id});
      // let service_data= JSON.parse(isExist.service)
      // let package_data= JSON.parse(isExist.service_package)
      // // console.log(service_data,package_data)


  //      try {
  //      this.dataSource.manager.update(Appointment, id,{
  //       date:updateAppointmentDto.date,
  //       time:updateAppointmentDto.time,
  //    })
  //    return{
  //      msg:'Updated successfully!', status:HttpStatus.CREATED
  //    }
  //  } catch (error) {
  //    return{
  //      msg:'Something went wrong!'+ error, status:HttpStatus.BAD_REQUEST
  //    }
  //  }
  }




 async updateAppointmentStatus(id: number, updateAppointmentDto: UpdateAppointmentDto) {
  // console.log('Data ID',id)
      console.log('Data',updateAppointmentDto)
      
       try {
         
       this.dataSource.manager.update(ServiceAppointment, id,{
            status:updateAppointmentDto.status,
        })
     
      return{
        msg:'Updated successfully!', status:HttpStatus.CREATED
      }
 
   } catch (error) {
     return{
       msg:'Something went wrong!'+ error, status:HttpStatus.BAD_REQUEST
     }
   }
  }

    async confirmAppointment(id: number, updateAppointmentDto: UpdateAppointmentDto){
          // console.log(id,updateAppointmentDto)
        try {
          // const isExist = await this.appointmentRepository.findOneBy({id});
          
          let updated = await this.dataSource.manager.update(Appointment, id,{
          status:updateAppointmentDto.status,
          date:updateAppointmentDto.date,
          time:updateAppointmentDto.time,
          dataRescheduled:updateAppointmentDto.data,
          isRescheduled:true
          })


        if(updated.affected == 1){
        let patient = await this.dataSource.manager.createQueryBuilder(Patient, 'pt')
        .where('pt.id = :id',{id:updateAppointmentDto.patientID})
        .getOne()

        let sms= {
            recipient: patient.contact_no.toString(),
            message: updateAppointmentDto.remarks ,
          }
        await this.SMSServices.sendSms(sms)
        }

        
        return{
        msg:'Updated successfully!', status:HttpStatus.OK,
        updateAppointment:{
        // id:isExist.doctorID,
        }
        }
       
        } catch (error) {
        return{
       msg:'Something went wrong!'+ error, status:HttpStatus.BAD_REQUEST
     }
   }
        
    }
    async doneCheckup(id: number,  updateAppointmentDto: UpdateAppointmentDto){
        try {
          const isExist = await this.appointmentRepository.findOneBy({id});
           await this.dataSource.manager.update(Appointment, id,{
          status:updateAppointmentDto.status,
          })
        
        return{
        msg:'Updated successfully!', status:HttpStatus.OK,
        updateAppointment:{
        id:isExist.doctorID,
        }
        }
       
        } catch (error) {
        return{
       msg:'Something went wrong!'+ error, status:HttpStatus.BAD_REQUEST
     }
    }
  }

 async updatePatientStatus(id: number, updatePatientDto: UpdatePatientDto) {
      // // console.log('Data ID',id)
      // // console.log('Data',updatePatientDto)
      
       try {

         this.dataSource.manager.update(Patient, id,{
        status:updatePatientDto.status,
     })

       this.dataSource.manager.update(ServiceAppointment, updatePatientDto.updateID,{
        status:updatePatientDto.status,
     })
     
     return{
       msg:'Updated successfully!', status:HttpStatus.CREATED
     }
   } catch (error) {
     return{
       msg:'Something went wrong!'+ error, status:HttpStatus.BAD_REQUEST
     }
   }
  }


  async remove(id: number) {
    try {
      await this.appointmentRepository.delete(id);
      return {
        msg: 'Deleted successfully.',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        msg: 'Deletion failed',
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }
}
