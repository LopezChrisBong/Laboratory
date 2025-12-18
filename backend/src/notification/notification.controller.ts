import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from 'src/entities';
import { DataSource, Repository } from 'typeorm';
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService,
              private dataSource: DataSource,
  ) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Get()
  findAll() {
    return this.notificationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(+id);
  }

    @Get('getAllNotifications/:id')
  getAllNotifications(@Param('id') id: string) {
    return this.notificationService.getAllNotifications(+id);
  }

      @Get('getAllReceptionist/Notification')
  getAllReceptionistNotif() {
    return this.notificationService.getAllReceptionistNotif();
  }
  

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationService.update(+id, updateNotificationDto);
  }

  @Patch('mark-all-read/:id')
  markAllAsRead(@Param('id') id: string) {
    // console.log(id)
    return this.notificationService.markAllAsRead(+id);
  }




  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationService.remove(+id);
  }
}
