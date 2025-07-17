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
      // console.log(createDoctorsScheduleDto)
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
      // console.log(data)
    return data
  }

  async getAllDoctorsSched(data:string){
    const today = new Date();
    let newDocList = JSON.parse(data)
    let newArr = []
 
    for (let i = 0; i < newDocList.length; i++) {
      let id = newDocList[i].id
      let arrData = []
     let data = await this.doctorsScheduleRepository
      .createQueryBuilder('ds')
      .select([
        'ds.*',
        "IF (!ISNULL(ud.mname), concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,'. ',ud.lname), concat(ud.fname, ' ', ud.lname)) as name",
        'ud.profile_img as profile',
        'JSON_ARRAY() as specialization'
      ])
      .leftJoin(UserDetail, 'ud', 'ud.id = '+id)
      .leftJoin(Users, 'us', 'us.id = ud.userID')
      .where('ds.doctorID = :id', {id})
      .andWhere('ds.date >= :today', { today: today.toISOString().split('T')[0] })
      .andWhere('us.isAdminApproved = 1')
      .andWhere('us.assignedModuleID = 5')
      .orderBy('ds.date', 'ASC')
      .groupBy('ds.date')
      .getRawMany();

      for (let j = 0; j < data.length; j++) {
        let newData = await this.doctorSpecializationRepository.createQueryBuilder('ds')
        .where('ds.doctorID = :doctorID', {doctorID:data[j].doctorID}).getMany();
        data[j].specialization = newData
      }

      newArr.push(data)
    }
   
    const flatData = newArr.flat();
    //  console.log(flatData)
     return flatData
    
  }

  findAll() {
    return `This action returns all doctorsSchedule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} doctorsSchedule`;
  }

  update(id: number, updateDoctorsScheduleDto: UpdateDoctorsScheduleDto) {

      // console.log(id, updateDoctorsScheduleDto)
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
