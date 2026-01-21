import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateDoctorsScheduleDto } from './dto/create-doctors-schedule.dto';
import { UpdateDoctorsScheduleDto } from './dto/update-doctors-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment, DoctorSpecialization, DoctorsSchedule, Patient, PatientDoctor, PatientMedtech, Service, ServiceAppointment, ServiceLabResult, ServicePackages, UserDetail, Users } from 'src/entities';
import { DataSource, Repository } from 'typeorm';
import { groupBy } from 'rxjs';
interface GroupedSchedule {
  date: string;
  doctors: any[];
}
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

 async addMonthlySchedule(createDoctorsScheduleDto: CreateDoctorsScheduleDto){
  
  const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {

     const months = JSON.parse(createDoctorsScheduleDto.months);

      const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      // const names = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

      const result = [];

      for (const monthStr of months) {
        const [year, month] = monthStr.split('-').map(Number);
        const date = new Date(year, month - 1, 1);

        // while (date.getMonth() === month - 1) {
        //   result.push(
        //     `${date.getDate()}-${names[date.getDay()]}`
        //   );
        //   date.setDate(date.getDate() + 1);
        // }
          while (date.getMonth() === month - 1) {
            const day = date.getDay();

            //  Monday (1) to Friday (5) only
            if (day >= 1 && day <= 6) {
              result.push(
                `${date.getDate()}-${names[day]}-${year}-${month}`
              );
            }

            date.setDate(date.getDate() + 1);
          }
      
      }
           for (let i = 0; i < result.length; i++) {
              let newData = result[i].split('-')
              // let datas = {
              //   dayNum:newData[0],
              //   dayString:newData[1],
              //   year:newData[2],
              //   month:newData[3],
              //   date:newData[2]+'-'+newData[3]+'-'+newData[0]
              // }
              const year = newData[2];
              const month = String(newData[3]).padStart(2, '0');
              const day = String(newData[0]).padStart(2, '0');

              const date = `${year}-${month}-${day}`;

            const data = queryRunner.manager.create(DoctorsSchedule, {
            doctorID: createDoctorsScheduleDto.doctorID,
            date:date,
            day: newData[1],
            timeFrom: createDoctorsScheduleDto.timeFrom,
            timeTo:createDoctorsScheduleDto.timeTo
            });
            console.log(data)
            await queryRunner.manager.save(data);
            }
     

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
        const doctorList = JSON.parse(data);
        let allSchedules: any[] = [];
        for (let i = 0; i < doctorList.length; i++) {
          const id = doctorList[i].id;

          const schedules = await this.doctorsScheduleRepository
            .createQueryBuilder('ds')
            .select([
              'ds.*',
              "IF (!ISNULL(ud.mname), concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,'. ',ud.lname), concat(ud.fname, ' ', ud.lname)) as name",
              'ud.profile_img as profile',
              'JSON_ARRAY() as specialization'
            ])
            .leftJoin(UserDetail, 'ud', 'ud.id = :id', { id })
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
      ) as GroupedSchedule[];

      for (let i = 0; i < grouped.length; i++) {
        for (let j = 0; j < grouped[i].doctors.length; j++) {
          const doctorID = grouped[i].doctors[j].doctorID;

          const newData = await this.doctorSpecializationRepository
            .createQueryBuilder('ds')
            .where('ds.doctorID = :doctorID', { doctorID })
            .getMany();

          grouped[i].doctors[j].specialization = newData;
        }
    }

  return grouped;
}


  async getSpecificDoctorData(id:number){
      const today = new Date().toISOString().split('T')[0];
      const schedules = await this.doctorsScheduleRepository
        .createQueryBuilder('ds')
        .select([
          'ds.*',
          // "IF (!ISNULL(ud.mname), concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,'. ',ud.lname), concat(ud.fname, ' ', ud.lname)) as name",
          'ud.profile_img as profile', 
          // 'JSON_ARRAY() as specialization'
        ])
        .leftJoin(UserDetail, 'ud', 'ud.id = :id', { id })
        .leftJoin(Users, 'us', 'us.id = ud.userID')
        .where('ds.doctorID = :id', { id })
        .andWhere('ds.date >= :today', { today })
        .andWhere('us.isAdminApproved = 1')
        .andWhere('us.assignedModuleID = 5')
        .orderBy('ds.date', 'ASC')
        .getRawMany();
        console.log(schedules)
        return schedules
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
              msg:'Updated successfully!', status:HttpStatus.OK
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
