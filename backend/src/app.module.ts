import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserDetailsModule } from './user-details/user-details.module';
import { UserTypeModule } from './user-type/user-type.module';

// import config from '../ormconfig';
import entities from './entities';
import { PDFModule } from '@t00nday/nestjs-pdf';

import { PdfGeneratorModule } from './pdf-generator/pdf-generator.module';
import { MailModule } from './mail/mail.module';
import { SysModulesModule } from './sys-modules/sys-modules.module';
import { AssignedModulesModule } from './assigned-modules/assigned-modules.module';
import { UserRoleModule } from './user-role/user-role.module';
import { DoctorSpecializationModule } from './doctor-specialization/doctor-specialization.module';
import { CategoryModule } from './category/category.module';
import { DoctorModule } from './doctor/doctor.module';
import { TestTypeModule } from './test-type/test-type.module';
import { AppointmentModule } from './appointment/appointment.module';
import { RoleModule } from './role/role.module';
import { LabTestModule } from './lab-test/lab-test.module';
import { PaymentModule } from './payment/payment.module';
import { PatientModule } from './patient/patient.module';
import { InventoryModule } from './inventory/inventory.module';
import { ServicesModule } from './services/services.module';
import { MedicalInfoModule } from './medical-info/medical-info.module';
import { NotificationModule } from './notification/notification.module';
import { DoctorsScheduleModule } from './doctors-schedule/doctors-schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: entities,
      synchronize: true, //for production this is set to be false
    }),
    PDFModule.register({
      isGlobal: true,
      view: {
        root: '',
        engine: 'htmling',
      },
    }),
    AuthModule,
    UserDetailsModule,
    UserTypeModule,
    PdfGeneratorModule,
    MailModule,
    SysModulesModule,
    AssignedModulesModule,
    UserDetailsModule,
    UserRoleModule,
    DoctorSpecializationModule,
    CategoryModule,
    DoctorModule,
    TestTypeModule,
    AppointmentModule,
    RoleModule,
    LabTestModule,
    PaymentModule,
    PatientModule,
    InventoryModule,
    ServicesModule,
    MedicalInfoModule,
    NotificationModule,
    DoctorsScheduleModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // constructor(private dataSource: DataSource) { }
}
