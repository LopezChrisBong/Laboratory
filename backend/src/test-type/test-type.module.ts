import { Module } from '@nestjs/common';
import { TestTypeService } from './test-type.service';
import { TestTypeController } from './test-type.controller';
import { TestType } from './entities/test-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TestType]),],
  controllers: [TestTypeController],
  providers: [TestTypeService],
  exports: [TestTypeService]

})
export class TestTypeModule {}
