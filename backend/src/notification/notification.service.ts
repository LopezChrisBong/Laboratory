import { HttpStatus, Injectable } from '@nestjs/common';
import { Appointment, Notification, Patient, Service, ServiceAppointment, ServiceCategory, ServiceLabResult, ServicePackages, UserDetail, Users } from 'src/entities';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification) private readonly notificationsRepository: Repository<Notification>,
     private dataSource: DataSource,
  ){}

 async create(createNotificationDto: CreateNotificationDto) {
  // console.log(createNotificationDto)
        const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
              let notification = createNotificationDto;
              
        
                const data = queryRunner.manager.create(Notification, {
                  appointmentID:notification.appointmentID,
                  patientID:notification.patientID,
                  title:notification.title,
                  message:notification.message,
                  route:notification.route,
                  assignedID:notification.assignedID,
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
    return `This action returns all notification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

 async getAllNotifications(id:number){
  
        // let data = await this.dataSource.manager.createQueryBuilder(Notification, 'nt')
        // .select([
        //  "nt.*",
        //    `IF(
        //       !ISNULL(pt.m_name),
        //       CONCAT(pt.f_name, ' ', SUBSTRING(pt.m_name,1,1), '. ', pt.l_name),
        //       CONCAT(pt.f_name, ' ', pt.l_name)
        //     ) AS name`,
        //   'pt.gender as sex'
        // ])
        // .leftJoin(Patient, 'pt' , 'pt.id = nt.patientID')
        // .where('nt.assignedID = :id', {id})
        // .orderBy('nt.createdAt', 'DESC')
        // .getRawMany()
        
        // console.log(data)

        // return data

        let data = await this.dataSource.manager
          .createQueryBuilder(Notification, "nt")
          .select([
            "nt.*",
            `
              IF(
                NOT ISNULL(pt.id),
                -- if patient exists directly from notification
                IF(
                  !ISNULL(pt.m_name),
                  CONCAT(pt.f_name, ' ', SUBSTRING(pt.m_name,1,1), '. ', pt.l_name),
                  CONCAT(pt.f_name, ' ', pt.l_name)
                ),
                -- else from appointment
                IF(
                  !ISNULL(pt2.m_name),
                  CONCAT(pt2.f_name, ' ', SUBSTRING(pt2.m_name,1,1), '. ', pt2.l_name),
                  CONCAT(pt2.f_name, ' ', pt2.l_name)
                )
              ) AS name
            `,
            `
              IF(
                NOT ISNULL(pt.id),
                pt.gender,
                pt2.gender
              ) AS sex
            `,
          ])
          .leftJoin(Patient, "pt", "pt.id = nt.patientID")
          .leftJoin(Appointment, "app", "app.id = nt.appointmentID")
          .leftJoin(Patient, "pt2", "pt2.id = app.patientID")

          .where("nt.assignedID = :id", { id })
          .orderBy("nt.read", "ASC")
          .addOrderBy("nt.createdAt", "DESC")
          .getRawMany();

          console.log(data)

    return data;

  }

   async getAllReceptionistNotif(){
          let data = await this.dataSource.manager
          .createQueryBuilder(Notification, "nt")
          .select([
            "nt.*",
            `
              IF(
                NOT ISNULL(pt.id),
                -- if patient exists directly from notification
                IF(
                  !ISNULL(pt.m_name),
                  CONCAT(pt.f_name, ' ', SUBSTRING(pt.m_name,1,1), '. ', pt.l_name),
                  CONCAT(pt.f_name, ' ', pt.l_name)
                ),
                -- else from appointment
                IF(
                  !ISNULL(pt2.m_name),
                  CONCAT(pt2.f_name, ' ', SUBSTRING(pt2.m_name,1,1), '. ', pt2.l_name),
                  CONCAT(pt2.f_name, ' ', pt2.l_name)
                )
              ) AS name
            `,
            `
              IF(
                NOT ISNULL(pt.id),
                pt.gender,
                pt2.gender
              ) AS sex
            `,
          ])
          .leftJoin(Patient, "pt", "pt.id = nt.patientID")
          .leftJoin(Appointment, "app", "app.id = nt.appointmentID")
          .leftJoin(Patient, "pt2", "pt2.id = app.patientID")

          .where("nt.assignedID = :id", { id:1 })
          .orderBy("nt.read", "ASC")
          .addOrderBy("nt.createdAt", "DESC")
          .getRawMany();

          console.log(data)
          return data
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    // // console.log(id, updateNotificationDto)
        try {
            this.dataSource.manager.update(Notification, id,{
              read:updateNotificationDto.read,
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

        async markAllAsRead(id: number) {
          try {
            await this.dataSource.manager.update(
              Notification,
              { assignedID: id },  
              { read: true }          
            );

            return { msg: "All notifications marked as read.", status: HttpStatus.OK };
          } catch (error) {
            console.log(error);
            return { msg: "Something went wrong.", status: HttpStatus.BAD_REQUEST };
          }
        }




  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
