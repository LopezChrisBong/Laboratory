import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateMedicalInfoDto } from './dto/create-medical-info.dto';
import { UpdateMedicalInfoDto } from './dto/update-medical-info.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, Repository } from 'typeorm';
import {
  Appointment,
  MedicalCertificate,
  MedicalInfo,
  Patient,
  PatientDoctor,
  Service,
  ServicePackages,
  UserDetail,
  Users,
} from 'src/entities';
import { CreateMedicalCertificateDto } from './dto/create-medical-certificate.dto';
@Injectable()
export class MedicalInfoService {
  constructor(
    @InjectRepository(UserDetail)
    private readonly userDetailRepository: Repository<UserDetail>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(ServicePackages)
    private readonly servicePackagesRepository: Repository<ServicePackages>,
    @InjectRepository(PatientDoctor)
    private readonly patientDoctorRepository: Repository<PatientDoctor>,
    @InjectRepository(MedicalCertificate)
    private readonly medicalCertificateRepository: Repository<MedicalCertificate>,
    @InjectRepository(MedicalInfo)
    private readonly medicalInfoRepository: Repository<MedicalInfo>,
    private dataSource: DataSource,
  ) {}
  create(createMedicalInfoDto: CreateMedicalInfoDto) {
    return 'This action adds a new medicalInfo';
  }
  async addMedicalInfo(createMedicalInfoDto: CreateMedicalInfoDto) {
    console.log(createMedicalInfoDto);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let medicalInfo = createMedicalInfoDto;
      // console.log(medicalInfo)

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
        Tnumber: medicalInfo.Tnumber,
        Pnumber: medicalInfo.Pnumber,
        PAnumber: medicalInfo.PAnumber,
        Lnumber: medicalInfo.Lnumber,
        Anumber: medicalInfo.Anumber,
        Gnumber: medicalInfo.Gnumber,
        discharge: medicalInfo.discharge,
        complain: medicalInfo.complain,
        admitted: medicalInfo.admitted,
        age: medicalInfo.age,
        referred_by: medicalInfo.referred_by,
        civil_status: medicalInfo.civil_status,
        spouse: medicalInfo.spouse,
      });

      const savedCategory = await queryRunner.manager.save(data);

      //     this.dataSource.manager.update(Patient, medicalInfo.patientID,{
      //     status:3,
      //  })
      //     if(medicalInfo.appointmentID != null){
      //     this.dataSource.manager.update(Appointment, medicalInfo.appointmentID,{
      //     status:3,
      //  })
      //     }

      // console.log(savedCategory.id);
      await queryRunner.commitTransaction();
      return {
        msg: 'Saved successfully!',
        status: HttpStatus.OK,
        id: savedCategory.id,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return {
        msg: 'Saving failed!' + error,
        status: HttpStatus.BAD_REQUEST,
        errorCode: error.code,
      };
    } finally {
      await queryRunner.release();
    }
  }

    async addMedicalCertificate(createMedicalCertificateDto: CreateMedicalCertificateDto) {
    console.log(createMedicalCertificateDto);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let medicalInfo = createMedicalCertificateDto;
      // console.log(medicalInfo)

      const data = queryRunner.manager.create(MedicalCertificate, {
        patientID: medicalInfo.patientID,
        doctorID: medicalInfo.doctorID,
        date: medicalInfo.date,
        diagnosis:medicalInfo.diagnosis,
        recommendations:medicalInfo.recommendations
     
      });

      const savedCategory = await queryRunner.manager.save(data);
      await queryRunner.commitTransaction();
      return {
        msg: 'Saved successfully!',
        status: HttpStatus.OK,
        id: savedCategory.id,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return {
        msg: 'Saving failed!' + error,
        status: HttpStatus.BAD_REQUEST,
        errorCode: error.code,
      };
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return `This action returns all medicalInfo`;
  }

  async findOne(id: number) {
    let data = await this.medicalInfoRepository
      .createQueryBuilder('mi')
      .select(['mi.*'])
      .where('mi.patientID = :id', { id })
      .orderBy('mi.created_at', 'DESC')
      .getRawMany();
    return data;
  }

    async getAllMedicalRecords(id: number) {
    let data = await this.medicalCertificateRepository
      .createQueryBuilder('mi')
      .select([
        'mi.*',
         `IF (
          !ISNULL(p.m_name) AND LOWER(p.m_name) != 'n/a',
          CONCAT(p.f_name, ' ', SUBSTRING(p.m_name, 1, 1), '. ', p.l_name),
          CONCAT(p.f_name, ' ', p.l_name)
        ) AS name`,
         `IF (
          !ISNULL(ud.mname) AND LOWER(ud.mname) != 'n/a',
          CONCAT(ud.fname, ' ', SUBSTRING(ud.mname, 1, 1), '. ', ud.lname),
          CONCAT(ud.fname, ' ', ud.lname)
        ) AS doctor_name`,
      ])
      .leftJoin(Patient, 'p', 'p.id = mi.patientID')
      .leftJoin(UserDetail, 'ud', 'ud.id = mi.doctorID')
      .where('mi.patientID = :id', { id })
      .orderBy('mi.created_at', 'DESC')
      .getRawMany();
    return data;
  }

  update(id: number, updateMedicalInfoDto: UpdateMedicalInfoDto) {
    return `This action updates a #${id} medicalInfo`;
  }

  remove(id: number) {
    return `This action removes a #${id} medicalInfo`;
  }
}
