import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateDoctorsScheduleDto } from './dto/create-doctors-schedule.dto';
import { UpdateDoctorsScheduleDto } from './dto/update-doctors-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment, DoctorSpecialization, DoctorsSchedule, Patient, PatientDoctor, PatientMedtech, Service, ServiceAppointment, ServiceLabResult, ServicePackages, UserDetail, Users } from 'src/entities';
import { DataSource, Repository } from 'typeorm';
import { groupBy } from 'rxjs';

@Injectable()

export class DoctorsScheduleService {
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
      @InjectRepository(DoctorsSchedule) private readonly doctorsScheduleRepository: Repository<DoctorsSchedule>,
      @InjectRepository(DoctorSpecialization) private readonly doctorSpecializationRepository: Repository<DoctorSpecialization>,
      private dataSource: DataSource,
    ){}
    
 async create(createDoctorsScheduleDto: CreateDoctorsScheduleDto){
      // // console.log(createDoctorsScheduleDto)
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        let schedule = createDoctorsScheduleDto;
        const isExist = await this.doctorsScheduleRepository.findOneBy({doctorID:schedule.doctorID, date:schedule.date, day:schedule.day});
  
        if(!isExist){
          const data = queryRunner.manager.create(DoctorsSchedule, {
            doctorID: schedule.doctorID,
            date:schedule.date,
            day: schedule.day,
            timeFrom: schedule.timeFrom,
            timeTo:schedule.timeTo
          });
  
          await queryRunner.manager.save(data);
          
        // await queryRunner.manager.update(Patient, { id: appointment.patientID}, {
        // status:0,
        // });
         await queryRunner.commitTransaction();
        return {
          msg: 'Saved successfully!',
          status: HttpStatus.OK,
        };
  
        }else{
        await queryRunner.rollbackTransaction();
        return {
          msg: 'Schedule already exist please select another date!',
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

  async getMySchedule(id: number) {
    const today = new Date();
    let data = await this.doctorsScheduleRepository
      .createQueryBuilder('ds')
      .select([
        'ds.*',
      ])
      .where('ds.doctorID = :id', {id})
      .andWhere('ds.date >= :today', { today: today.toISOString().split('T')[0] })
      .orderBy('ds.date', 'ASC')
      .getRawMany();
      // // console.log(data)
    return data
  }

  // async getAllDoctorsSched(data:string){

  //   const today = new Date();
  //   let newDocList = JSON.parse(data)
  //   let newArr = []
 
  //   for (let i = 0; i < newDocList.length; i++) {
  //     let id = newDocList[i].id
  //     let arrData = []
  //    let data = await this.doctorsScheduleRepository
  //     .createQueryBuilder('ds')
  //     .select([
  //       'ds.*',
  //       "IF (!ISNULL(ud.mname), concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,'. ',ud.lname), concat(ud.fname, ' ', ud.lname)) as name",
  //       'ud.profile_img as profile',
  //       'JSON_ARRAY() as specialization'
  //     ])
  //     .leftJoin(UserDetail, 'ud', 'ud.id = '+id)
  //     .leftJoin(Users, 'us', 'us.id = ud.userID')
  //     .where('ds.doctorID = :id', {id})
  //     .andWhere('ds.date >= :today', { today: today.toISOString().split('T')[0] })
  //     .andWhere('us.isAdminApproved = 1')
  //     .andWhere('us.assignedModuleID = 5')
  //     .orderBy('ds.date', 'ASC')
  //     .groupBy('ds.date')
  //     .getRawMany();

  //     for (let j = 0; j < data.length; j++) {
  //       let newData = await this.doctorSpecializationRepository.createQueryBuilder('ds')
  //       .where('ds.doctorID = :doctorID', {doctorID:data[j].doctorID}).getMany();
  //       data[j].specialization = newData
  //     }
      
  //     newArr.push(data)
  //   }
   
  //   const flatData = newArr.flat();
  //     console.log(flatData)
  //    return flatData
    
  // }

  async getAllDoctorsSched(data: string) {

    const today = new Date().toISOString().split('T')[0];
    let doctorList = JSON.parse(data);
    let allSchedules: any[] = [];

    for (let i = 0; i < doctorList.length; i++) {
      let id = doctorList[i].id;

      const schedules = await this.doctorsScheduleRepository
        .createQueryBuilder('ds')
        .select([
          'ds.*',
          "IF (!ISNULL(ud.mname), concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,'. ',ud.lname), concat(ud.fname, ' ', ud.lname)) as name",
          'ud.profile_img as profile',
        ])
        .leftJoin(UserDetail, 'ud', 'ud.id = ' + id)
        .leftJoin(Users, 'us', 'us.id = ud.userID')
        .where('ds.doctorID = :id', { id })
        .andWhere('ds.date >= :today', { today })
        .andWhere('us.isAdminApproved = 1')
        .andWhere('us.assignedModuleID = 5')
        .orderBy('ds.date', 'ASC')
        .getRawMany();

      allSchedules.push(...schedules); 
    }

    const grouped = Object.values(
      allSchedules.reduce((acc: any, item: any) => {
        if (!acc[item.date]) {
          acc[item.date] = {
            date: item.date,
            doctors: []
          };
        }
        acc[item.date].doctors.push(item);
        return acc;
      }, {})
    );

    console.log('GROUPED:', grouped);

    return grouped;
  }


async getAllDoctorsDashboard() {
  const today = new Date().toISOString().split('T')[0];

  // Get all doctors (moduleID = 5, approved)
  const doctors = await this.userDetailRepository
    .createQueryBuilder('ud')
    .select([
      'ud.id as doctorID',
      "IF (!ISNULL(ud.mname), CONCAT(ud.fname, ' ', SUBSTRING(ud.mname,1,1), '. ', ud.lname), CONCAT(ud.fname, ' ', ud.lname)) as name",
      'ud.profile_img as profile'
    ])
    .leftJoin(Users, 'us', 'us.id = ud.userID')
    .where('us.isAdminApproved = 1')
    .andWhere('us.assignedModuleID = 5')
    .getRawMany();

  let result = [];

for (let doc of doctors) {
  // Get doctor schedules
  const schedulesRaw = await this.doctorsScheduleRepository
    .createQueryBuilder('ds')
    .select([
      'ds.id as id',
      'ds.date as date',
      'ds.day as day',
      'ds.timeFrom as timeFrom',
      'ds.timeTo as timeTo'
    ])
    .where('ds.doctorID = :id', { id: doc.doctorID })
    .andWhere('ds.date >= :today', { today })
    .orderBy('ds.date', 'ASC')
    .getRawMany();

  // 👉 Format schedule objects so your frontend can use `items.schedule`
  const schedules = schedulesRaw.map(s => ({
    id: s.id,
    schedule: `${s.date} (${s.day}) From: ${s.timeFrom} To: ${s.timeTo}`
  }));

  // Get doctor specializations
  const specialization = await this.doctorSpecializationRepository
    .createQueryBuilder('sp')
    .select([
      'sp.specialty as specialty',
      'sp.specialty_description as specialty_description'
    ])
    .where('sp.doctorID = :id', { id: doc.doctorID })
    .getRawMany();

  result.push({
    doctorID: doc.doctorID,
    name: doc.name,
    profile: doc.profile,
    specialization,
    schedules // 👈 now contains `schedule` property
  });
}

console.log(result)
  return result;
}

  

  findAll() {
    return `This action returns all doctorsSchedule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} doctorsSchedule`;
  }

  update(id: number, updateDoctorsScheduleDto: UpdateDoctorsScheduleDto) {

      // // console.log(id, updateDoctorsScheduleDto)
          try {
         this.dataSource.manager.update(DoctorsSchedule, id,{
            date:updateDoctorsScheduleDto.date,
            day: updateDoctorsScheduleDto.day,
            timeFrom: updateDoctorsScheduleDto.timeFrom,
            timeTo:updateDoctorsScheduleDto.timeTo
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
      await this.doctorsScheduleRepository.delete(id);
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
