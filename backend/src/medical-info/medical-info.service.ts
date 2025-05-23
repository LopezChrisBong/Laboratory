import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateMedicalInfoDto } from './dto/create-medical-info.dto';
import { UpdateMedicalInfoDto } from './dto/update-medical-info.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, Repository } from 'typeorm';
import { Appointment, MedicalInfo, Patient, PatientDoctor, PatientMedtech, Service, ServicePackages, UserDetail, Users } from 'src/entities';
@Injectable()
export class MedicalInfoService {
    constructor(
      @InjectRepository(UserDetail) private readonly userDetailRepository: Repository<UserDetail>,
      @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
      @InjectRepository(Patient) private readonly patientRepository: Repository<Patient>,
      @InjectRepository(Appointment) private readonly appointmentRepository: Repository<Appointment>,
      @InjectRepository(Service) private readonly serviceRepository: Repository<Service>,
      @InjectRepository(ServicePackages) private readonly servicePackagesRepository: Repository<ServicePackages>,
      @InjectRepository(PatientDoctor) private readonly patientDoctorRepository: Repository<PatientDoctor>,
      @InjectRepository(PatientMedtech) private readonly patientMedtechRepository: Repository<PatientMedtech>,
      @InjectRepository(MedicalInfo) private readonly medicalInfoRepository: Repository<MedicalInfo>,
      private dataSource: DataSource,
    ){}
  create(createMedicalInfoDto: CreateMedicalInfoDto) {
    return 'This action adds a new medicalInfo';
  }
   async addMedicalInfo(createMedicalInfoDto:CreateMedicalInfoDto){
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        let medicalInfo = createMedicalInfoDto;
        console.log(medicalInfo)
  
          const data = queryRunner.manager.create(MedicalInfo, {
            patientID: medicalInfo.patientID,
            appointmentID: medicalInfo.appointmentID,
            doctorID: medicalInfo.doctorID,
            am: medicalInfo.am,
            bp: medicalInfo.bp,
            date: medicalInfo.date,
            dateDelivered: medicalInfo.dateDelivered,
            deliveryDate: medicalInfo.deliveryDate,
            deliveryMethod: medicalInfo.deliveryMethod,
            finding: medicalInfo.finding,
            liveBirths: medicalInfo.liveBirths,
            menstrual: medicalInfo.menstrual,
            pregnant: medicalInfo.pregnant,
            remarks: medicalInfo.remarks,
            treatment: medicalInfo.treatment,
            weight: medicalInfo.weight,
            prevPreg: medicalInfo.prevPreg,
          });
  
         const savedCategory = await queryRunner.manager.save(data);
         
        this.dataSource.manager.update(Patient, medicalInfo.patientID,{
        status:3,
     })
         

        if(medicalInfo.appointmentID != null){
              this.dataSource.manager.update(Appointment, medicalInfo.appointmentID,{
        status:3,
     })
        }

         
    

  
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

  findAll() {
    return `This action returns all medicalInfo`;
  }

  async findOne(id: number) {
   let data = await this.medicalInfoRepository
  .createQueryBuilder('mi')
  .select([
    'mi.*'
  ])
  .where('mi.patientID = :id',{id})
  .getRawMany();
  return data
  
  }

  update(id: number, updateMedicalInfoDto: UpdateMedicalInfoDto) {
    return `This action updates a #${id} medicalInfo`;
  }

  remove(id: number) {
    return `This action removes a #${id} medicalInfo`;
  }
}
