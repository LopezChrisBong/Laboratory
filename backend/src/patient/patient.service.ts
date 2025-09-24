import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { DataSource } from 'typeorm';
import { Patient, Prescription, UserDetail } from 'src/entities';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';

@Injectable()
export class PatientService {
  constructor(private dataSource: DataSource,){}
  create(createPatientDto: CreatePatientDto) {
    return 'This action adds a new patient';
  }

   async addPrescription(createPrescriptionDto:CreatePrescriptionDto){
    // console.log(createPrescriptionDto)
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
          let prescription = createPrescriptionDto
            const data = queryRunner.manager.create(Prescription, {
              patientID:prescription.patientID,
              doctorID:prescription.doctorID,
              address:prescription.address,
              description:prescription.description,
              age:prescription.age,
              date:prescription.date,
              name:prescription.name
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
          errorCode: error.code
        };
      }
      finally {
        await queryRunner.release();
      }
    }

    async getAllPatientPrecription(patientID:number){
          let data = await this.dataSource
          .createQueryBuilder(Prescription,'ap')
          .select([
            "IF (!ISNULL(pt.m_name), concat(pt.f_name, ' ',SUBSTRING(pt.m_name, 1, 1) ,'. ',pt.l_name) ,concat(pt.f_name, ' ', pt.l_name)) as name",
            "IF (!ISNULL(ud.mname), concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,'. ',ud.lname) ,concat(ud.fname, ' ', ud.lname)) as doctor_name",
            " ap.*",
          ])
          .leftJoin(Patient, 'pt', 'pt.id = ap.patientID')
          .leftJoin(UserDetail, 'ud', 'ud.id = ap.doctorID')
          // .where('(pt.doctorID = :doctorID OR pt.medtechID = :doctorID)', { doctorID })
          .where('ap.patientID = :patientID', { patientID })
          // .andWhere('(pt.status = :doctorID OR pt.medtechID = :doctorID)', { doctorID })
          // .groupBy('pt.patientID')
          .orderBy('ap.date', 'DESC')
          .getRawMany()
          return data
    }


  findAll() {
    return `This action returns all patient`;
  }

  findOne(id: number) {
    return `This action returns a #${id} patient`;
  }

  update(id: number, updatePrescriptionDto: UpdatePrescriptionDto) {
              try {
               this.dataSource.manager.update(Prescription, id,{
                    description:updatePrescriptionDto.description
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
    return `This action removes a #${id} patient`;
  }
}
