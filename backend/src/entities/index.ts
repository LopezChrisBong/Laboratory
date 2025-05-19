
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { AssignedModule } from 'src/assigned-modules/entities/assigned-module.entity';
import { Users } from 'src/auth/entities/auth.entity';
import { Category } from 'src/category/entities/category.entity';
import { DoctorSpecialization } from 'src/doctor-specialization/entities/doctor-specialization.entity';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { LabTest } from 'src/lab-test/entities/lab-test.entity';
import { Patient } from 'src/patient/entities/patient.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { Role } from 'src/role/entities/role.entity';
import { SysModule } from 'src/sys-modules/entities/sys-module.entity';
import { TestType } from 'src/test-type/entities/test-type.entity';
import { UserDetail } from 'src/user-details/entities/user-detail.entity';
import { UserRole } from 'src/user-role/entities/user-role.entity';
import { UserType } from 'src/user-type/entities/user-type.entity';

const entities = [
  Users,
  UserDetail,
  UserType,
  UserRole,
  AssignedModule,
  SysModule,
  Appointment,
  Category,
  Doctor,
  DoctorSpecialization,
  Inventory,
  LabTest,
  Patient,
  Payment,
  Role,
  TestType,


];

export {
  Users,
  UserDetail,
  UserType,
  UserRole,
  AssignedModule,
  SysModule,
  Appointment,
  Category,
  Doctor,
  DoctorSpecialization,
  Inventory,
  LabTest,
  Patient,
  Payment,
  Role,
  TestType,

};

export default entities;
