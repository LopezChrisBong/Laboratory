import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Brackets, DataSource, Repository } from 'typeorm';
import { Appointment, Patient, Service, ServicePackages, UserDetail, Users } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePatientDto } from './dto/create-patient.dto';
@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(UserDetail) private readonly userDetailRepository: Repository<UserDetail>,
    @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
    @InjectRepository(Patient) private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Appointment) private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Service) private readonly serviceRepository: Repository<Service>,
    @InjectRepository(ServicePackages) private readonly servicePackagesRepository: Repository<ServicePackages>,
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
        console.log(savedCategory.id);
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
    console.log(createAppointmentDto)
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let appointment = createAppointmentDto;

        const data = queryRunner.manager.create(Appointment, {
          patientID: appointment.patientID,
          date: appointment.date,
          time: appointment.time,
          service:appointment.service,
          service_package:appointment.service_package
        });

        await queryRunner.manager.save(data);
      
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
      };
    } finally {
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
      // console.log(data)
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

    async getBookedAppointment(id:number){
      console.log(id)
      let data = await this.appointmentRepository
      .createQueryBuilder('ap')
      .select([
        " ap.*",
      ])
      .where('ap.patientID = :id',{id})
      .getRawMany()
      // console.log(data)
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
console.log('Appointment',data);
      return data
  }

  async checkPatient(f_name: string, l_name:string) {
    console.log(f_name)
    const isExist = await this.patientRepository.findOneBy({ f_name, l_name});
    console.log(isExist)
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

    async updateServices(id: number, updateAppointmentDto: UpdateAppointmentDto) {
      console.log('Data ID',id)
      console.log('Data',updateAppointmentDto)
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

      console.log('Service',JSON.stringify(selectedData))
    
      
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

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
