import { HttpStatus, Injectable } from '@nestjs/common';
import { Notification, Patient, Service, ServiceAppointment, ServiceCategory, ServiceLabResult, ServicePackages, UserDetail, Users } from 'src/entities';
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
  
        let data = await this.dataSource.manager.createQueryBuilder(Notification, 'nt')
        .select([
         "nt.*"
        ])
        .where('nt.assignedID = :id', {id})
        .orderBy('nt.createdAt', 'DESC')
        .getRawMany()
        
        // console.log(data)

        return data
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {

    // console.log(id, updateNotificationDto)
    
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

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
