import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { SmsService } from './sms.service';
import { SmsModuleOptions } from './interfaces/sms-options.interface';
import { SMS_OPTIONS } from './constants/sms.constants';
import { PhilSmsProvider } from './provider/philsms.provider';
import { SmsController } from './sms.controller';
// import { Sms } from './entities/sms.entity';

// @Module({
//   imports: [TypeOrmModule.forFeature([Sms])],
//   controllers: [SmsController],
//   providers: [SmsService],
//   exports: [SmsService],
// })
// export class SmsModule {}
@Module({})
export class SmsModule {
  static forRoot(options: SmsModuleOptions): DynamicModule {
    return {
      module: SmsModule,
      imports: [HttpModule],
      providers: [
        {
          provide: SMS_OPTIONS,
          useValue: options,
        },
        PhilSmsProvider,
        SmsService,
      ],
      controllers: [SmsController],
      exports: [SmsService],
      global: true,
    };
  }
}
