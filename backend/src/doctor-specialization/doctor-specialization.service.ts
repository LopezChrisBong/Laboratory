import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateDoctorSpecializationDto } from './dto/create-doctor-specialization.dto';
import { UpdateDoctorSpecializationDto } from './dto/update-doctor-specialization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Appointment, DoctorSpecialization, DoctorsSchedule, Patient, PatientDoctor, PatientMedtech, Service, ServiceAppointment, ServiceLabResult, ServicePackages, UserDetail, Users } from 'src/entities';

@Injectable()
export class DoctorSpecializationService {
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
 async create(createDoctorSpecializationDto: CreateDoctorSpecializationDto) {
          // // console.log(createDoctorSpecializationDto)
          const queryRunner = this.dataSource.createQueryRunner();
          await queryRunner.connect();
          await queryRunner.startTransaction();
          try {
            let specialization = createDoctorSpecializationDto;
            const isExist = await this.doctorSpecializationRepository.findOneBy({doctorID:specialization.doctorID });
      
            if(!isExist){
              const data = queryRunner.manager.create(DoctorSpecialization, {
                doctorID: specialization.doctorID,
                specialty: specialization.specialty,
                specialty_description: specialization.specialty_description,
               
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
              msg: 'Doctor already added a specialization, Saving failed!',
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
   async getMyScpecialty(id:number){
      const today = new Date();
      let data = await this.doctorSpecializationRepository
      .createQueryBuilder('ds')
      .select([
        'ds.*',
      ])
      .where('ds.doctorID = :id', {id})
      .orderBy('ds.specialty', 'ASC')
      .getRawMany();
      // // console.log(data)
    return data
  }

  async getSpecificClinic(specialty:string){
          const rawData = await this.userDetailRepository
          .createQueryBuilder('ud')
          .select([
            "ds.specialty as specialty",
            "ds.specialty_description as description",
            "IF (!ISNULL(ud.mname), concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,'. ',ud.lname), concat(ud.fname, ' ', ud.lname)) as name",
            'ud.id as doctorId',
          ])
          .leftJoin(Users, 'us', 'us.id = ud.userID')
          .leftJoin(DoctorSpecialization, 'ds', 'ds.doctorID = ud.id')
          .where('us.isAdminApproved = 1')
          .andWhere('us.assignedModuleID = 5')
          .andWhere('ds.specialty = :specialty', {specialty})
          .orderBy('ds.specialty', 'ASC')
          .getRawMany();
        const grouped = {};
          for (const item of rawData) {
            const key = item.specialty;
            if (!grouped[key]) {
              grouped[key] = {
                specialty: key,
                description: item.description,
                doctors: [],
              };
            }
            grouped[key].doctors.push({
              id: item.doctorId,
              name: item.name,
            });
          }
          const result = Object.values(grouped)[0];
          // // console.log("Sample Clinic Data:", result);

          return result
  }
 async getAllClinic(){
  
      const rawData = await this.userDetailRepository
          .createQueryBuilder('ud')
          .select([
            "ds.specialty as specialty",
            "ds.specialty_description as description",
            "IF (!ISNULL(ud.mname), concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,'. ',ud.lname), concat(ud.fname, ' ', ud.lname)) as name",
            'ud.id as doctorId',
          ])
          .leftJoin(Users, 'us', 'us.id = ud.userID')
          .leftJoin(DoctorSpecialization, 'ds', 'ds.doctorID = ud.id')
          .where('us.isAdminApproved = 1')
          .andWhere('us.assignedModuleID = 5')
          .orderBy('ds.specialty', 'ASC')
          .getRawMany();
          const grouped = {};
              for (const item of rawData) {
                const key = item.specialty;
                if (!grouped[key]) {
                  grouped[key] = {
                    specialty: key,
                    description: item.description,
                    doctors: [],
                  };
                }
                grouped[key].doctors.push({
                  id: item.doctorId,
                  name: item.name,
                });
              }
          // // console.log('Sample Clinic Data:',grouped)
          return grouped
  }
   async getAllDoctorClinic(id:number){
  
      const rawData = await this.userDetailRepository
          .createQueryBuilder('ud')
          .select([
            "ds.specialty as specialty",
            "ds.specialty_description as description",
            "IF (!ISNULL(ud.mname), concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,'. ',ud.lname), concat(ud.fname, ' ', ud.lname)) as name",
            'ud.id as doctorId',
          ])
          .leftJoin(Users, 'us', 'us.id = ud.userID')
          .leftJoin(DoctorSpecialization, 'ds', 'ds.doctorID = ud.id')
          .where('us.isAdminApproved = 1')
          .andWhere('us.assignedModuleID = 5')
          .andWhere('ds.doctorID = '+ id)
          .orderBy('ds.specialty', 'ASC')
          .getRawMany();
          const grouped = {};
              for (const item of rawData) {
                const key = item.specialty;
                if (!grouped[key]) {
                  grouped[key] = {
                    specialty: key,
                    description: item.description,
                    doctors: [],
                  };
                }
                grouped[key].doctors.push({
                  id: item.doctorId,
                  name: item.name,
                });
              }
          // // console.log('Sample Clinic Data:',grouped)
          return grouped
  }


  findAll() {
    return `This action returns all doctorSpecialization`;
  }

  findOne(id: number) {
    return `This action returns a #${id} doctorSpecialization`;
  }

  update(id: number, updateDoctorSpecializationDto: UpdateDoctorSpecializationDto) {
          // console.log(id, updateDoctorSpecializationDto)
          try {
           this.dataSource.manager.update(DoctorSpecialization, id,{
                specialty: updateDoctorSpecializationDto.specialty,
                specialty_description: updateDoctorSpecializationDto.specialty_description,
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
      await this.doctorSpecializationRepository.delete(id);
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
