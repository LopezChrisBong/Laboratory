import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Brackets, DataSource, Repository } from 'typeorm';
import { Appointment, Patient, PatientDoctor, PatientMedtech, Service, ServicePackages, UserDetail, Users } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDoctorDto } from './dto/update-patient-doctor.dto';
import { CreatePatientDoctorDto } from './dto/create-patient-doctor.dto';
import { CreatePatientMedtechDto } from './dto/create-patient-medtech.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { UpdateServiceResultsDto } from './dto/update-service-result.dto';
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
    private dataSource: DataSource,
  ){}
  create(createAppointmentDto: CreateAppointmentDto) {
    return 'This action adds a new appointment';
  }

 async addPatient(createPatientDto:CreatePatientDto){
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let patient = createPatientDto;

        const data = queryRunner.manager.create(Patient, {
          f_name: patient.f_name,
          l_name: patient.l_name,
          m_name: patient.m_name,
          age: patient.age,
          civil_status: patient.civil_status,
          occupation: patient.occupation,
          gender: patient.gender,
          contact_no: patient.contact_no,
          b_date: patient.b_date,
          address: patient.address,
        });

       const savedCategory = await queryRunner.manager.save(data);
        // console.log(savedCategory.id);
      await queryRunner.commitTransaction();
      return {
        
        msg: 'Saved successfully!',
        status: HttpStatus.OK,
        id:savedCategory.id,
      };
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

  async bookAppointment(createAppointmentDto:CreateAppointmentDto){
    // console.log(createAppointmentDto)
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let appointment = createAppointmentDto;
      const isExist = await this.appointmentRepository.findOneBy({patientID: appointment.patientID, status:0});

      if(!isExist){
        const data = queryRunner.manager.create(Appointment, {
          patientID: appointment.patientID,
          date: appointment.date,
          time: appointment.time,
          service:appointment.service,
          service_package:appointment.service_package,
          clinic:appointment.clinic
        });

        await queryRunner.manager.save(data);
        
      await queryRunner.manager.update(Patient, { id: appointment.patientID}, {
      status:0,
      });
       await queryRunner.commitTransaction();
      return {
        msg: 'Saved successfully!',
        status: HttpStatus.OK,
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

  async addPatientDoctor(createPatientDoctorDto:CreatePatientDoctorDto){
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let infoID = createPatientDoctorDto;
      // console.log('Info',infoID)
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
      
      await queryRunner.commitTransaction();
      return {
        
        msg: 'Saved successfully!',
        status: HttpStatus.OK,
      };
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
       const isExist = await this.patientMedtechRepository.findOneBy({appointmentID: infoID.appointmentID, patientID:infoID.patientID});
      // console.log('INFFFOOOO',infoID)
      // console.log('INFFFOOOO',isExist)
      if(!isExist){
        // console.log('Added')
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

      
      await queryRunner.commitTransaction();
      return {
        
        msg: 'Saved successfully!',
        status: HttpStatus.OK,
      };
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
      console.log(data)
      return data
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
      console.log(data)
      return data
  }

  async getAllPatient(){
      let data = await this.patientRepository
      .createQueryBuilder('pt')
      .select([
        "IF (!ISNULL(pt.m_name), concat(pt.f_name, ' ',SUBSTRING(pt.m_name, 1, 1) ,'. ',pt.l_name) ,concat(pt.f_name, ' ', pt.l_name)) as name",
        " pt.*",
      ])
      .getRawMany()
      // console.log(data)
      return data
  }

    async getAllPatientForDoctor(doctorID:number){
      let data = await this.patientRepository
      .createQueryBuilder('pt')
      .select([
        "IF (!ISNULL(pt.m_name), concat(pt.f_name, ' ',SUBSTRING(pt.m_name, 1, 1) ,'. ',pt.l_name) ,concat(pt.f_name, ' ', pt.l_name)) as name",
        " pt.*",
      ])
      .leftJoin(PatientDoctor, 'pd', 'pt.patientID = pt.id')
      .where('(pt.doctorID = :doctorID OR pt.medtechID = :doctorID)', { doctorID })
      // .andWhere('pt.status = 2 OR pt.status = 1')
      // .andWhere('(pt.status = :doctorID OR pt.medtechID = :doctorID)', { doctorID })
      .getRawMany()
      // console.log(data)
      return data
  }

  async getAllPatientByRole(doctorID: number, user:any) {
    // console.log(user.userdetail.user.assignedModuleID)
    let role = user.userdetail.user.assignedModuleID
  const query = this.patientRepository
    .createQueryBuilder('pt')
    .select([
      "IF (!ISNULL(pt.m_name), concat(pt.f_name, ' ',SUBSTRING(pt.m_name, 1, 1) ,'. ',pt.l_name) ,concat(pt.f_name, ' ', pt.l_name)) as name",
      "pt.*",
    ])
    .where('(pt.doctorID = :doctorID OR pt.medtechID = :doctorID)', { doctorID });

  if (role === 2) {
    query.andWhere('pt.status = 1');
  } 
  else if (role === 5) {
    query.andWhere('pt.status IN (1, 2)');
  }

  const data = await query.getRawMany();
  // console.log(data);
  return data;
}


    async getBookedAppointment(id:number){
      // console.log(id)
      let data = await this.appointmentRepository
      .createQueryBuilder('ap')
      .select([
        " ap.*",
         "IF (!ISNULL(ud.mname), concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,'. ',ud.lname) ,concat(ud.fname, ' ', ud.lname)) as Doc_name",
         "IF (!ISNULL(us.mname), concat(us.fname, ' ',SUBSTRING(us.mname, 1, 1) ,'. ',us.lname) ,concat(us.fname, ' ', us.lname)) as Med_name",
         "us.liscence_no as liscence_no",
         "pm.medtechID as medtechID",
         "pd.doctorID as doctorID",
      ])
      .leftJoin(Patient, 'pt', 'pt.id = ap.patientID')
      .leftJoin(PatientDoctor, 'pd', 'pd.appointmentID = ap.id')
      .leftJoin(PatientMedtech, 'pm', 'pm.appointmentID = ap.id')
      .leftJoin(UserDetail, 'ud', 'ud.id = pd.doctorID')
      .leftJoin(UserDetail, 'us', 'us.id = pm.medtechID')
     
      .where('ap.patientID = :id',{id})
      .andWhere('ap.date != "null" ')
      .andWhere('ap.date != "null" ')
      .getRawMany()
      // console.log(data)
      return data
  }

      async getAssignedBookedAppointment(id:number){
      // console.log(id)
      let data = await this.appointmentRepository
      .createQueryBuilder('ap')
      .select([
        " ap.*",
         "IF (!ISNULL(ud.mname), concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,'. ',ud.lname) ,concat(ud.fname, ' ', ud.lname)) as Doc_name",
         "IF (!ISNULL(us.mname), concat(us.fname, ' ',SUBSTRING(us.mname, 1, 1) ,'. ',us.lname) ,concat(us.fname, ' ', us.lname)) as Med_name",
         "us.liscence_no as liscence_no",
         "pm.medtechID as medtechID",
         "pd.doctorID as doctorID",
      ])
      .leftJoin(Patient, 'pt', 'pt.id = ap.patientID')
      .leftJoin(PatientDoctor, 'pd', 'pd.appointmentID = ap.id')
      .leftJoin(PatientMedtech, 'pm', 'pm.appointmentID = ap.id')
      .leftJoin(UserDetail, 'ud', 'ud.id = pd.doctorID')
      .leftJoin(UserDetail, 'us', 'us.id = pm.medtechID')
      // .where('(pd.doctorID = :doctorID OR pd.medtechID = :id)', { id })
      .where('pd.doctorID = :id',{id})
      .andWhere('ap.service != "null"')
      .andWhere('ap.service_package != "null"')
      .getRawMany()
      console.log(data)
      return data
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
      console.log(data)
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
// console.log('Appointment',data);
      return data
  }

  async checkPatient(f_name: string, l_name:string) {
    // console.log(f_name)
    const isExist = await this.patientRepository.findOneBy({ f_name, l_name});
    // console.log(isExist)
    return isExist;
  }


  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
       try {
       this.dataSource.manager.update(Appointment, id,{
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


    async updateServiceResult(id: number, updateServiceResultsDto: UpdateServiceResultsDto) {
     
      let service_result = JSON.parse(updateServiceResultsDto.service_result)
      let package_result = JSON.parse(updateServiceResultsDto.package_result)
      // console.log(service_result, package_result)
        const isExist = await this.appointmentRepository.findOneBy({id});
      let service_data= JSON.parse(isExist.service)
      let package_data= JSON.parse(isExist.service_package)
      // console.log(service_data,package_data)


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


    async updateServices(id: number, updateAppointmentDto: UpdateAppointmentDto) {
      // console.log('Data ID',id)
      // console.log('Data',updateAppointmentDto)
      let serviceArr = JSON.parse(updateAppointmentDto.service)
      let packageArr = JSON.parse(updateAppointmentDto.service_package)
      let newArr = []
      let newArr1 = []
      let selectedData = []
      let selectedData1 = []
      for (let i = 0; i < serviceArr.length; i++) {
        newArr.push(await this.serviceRepository.findOneBy({id:serviceArr[i]}))
      }
      for (let i = 0; i < newArr.length; i++) {
        selectedData.push({
          id: newArr[i].id,
          description: newArr[i].service_description,
          price: newArr[i].service_price,
          category: newArr[i].service_category,
        });
      }

      for (let i = 0; i < packageArr.length; i++) {
        newArr1.push(await this.servicePackagesRepository.findOneBy({id:packageArr[i]}))
      }

        for (let i = 0; i < newArr1.length; i++) {
        selectedData1.push({
          id: newArr1[i].id,
          description: newArr1[i].description,
          price: newArr1[i].price,
        });
      }

      // console.log('Service',JSON.stringify(selectedData))
    
      
       try {
       this.dataSource.manager.update(Appointment, id,{
        service:JSON.stringify(selectedData),
        service_package:JSON.stringify(selectedData1),
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

      async updateAppointmentStatus(id: number, updateAppointmentDto: UpdateAppointmentDto) {
      // console.log('Data ID',id)
      // console.log('Data',updateAppointmentDto)
      
       try {
       this.dataSource.manager.update(Appointment, id,{
        status:updateAppointmentDto.status,
     })

         this.dataSource.manager.update(Patient, updateAppointmentDto.userID,{
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

 async updatePatientStatus(id: number, updatePatientDto: UpdatePatientDto) {
      // console.log('Data ID',id)
      // console.log('Data',updatePatientDto)
      
       try {

         this.dataSource.manager.update(Patient, id,{
        status:updatePatientDto.status,
     })

       this.dataSource.manager.update(Appointment, updatePatientDto.updateID,{
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
