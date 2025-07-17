
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { PatientDoctor } from 'src/appointment/entities/patient-doctor.entity';
import { PatientMedtech } from 'src/appointment/entities/patient-medtech.entity';
import { MedicalInfo } from 'src/medical-info/entities/medical-info.entity';
import { AssignedModule } from 'src/assigned-modules/entities/assigned-module.entity';
import { Users } from 'src/auth/entities/auth.entity';
import { Category } from 'src/category/entities/category.entity';
import { DoctorSpecialization } from 'src/doctor-specialization/entities/doctor-specialization.entity';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { LabTest } from 'src/lab-test/entities/lab-test.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { Role } from 'src/role/entities/role.entity';
import { Patient } from 'src/appointment/entities/patient.entity';
import { ServiceCategory } from 'src/services/entities/service-category.entity';
import { ServicePackages } from 'src/services/entities/service-packages.entity';
import { Service } from 'src/services/entities/service.entity';
import { SysModule } from 'src/sys-modules/entities/sys-module.entity';
import { TestType } from 'src/test-type/entities/test-type.entity';
import { UserDetail } from 'src/user-details/entities/user-detail.entity';
import { UserRole } from 'src/user-role/entities/user-role.entity';
import { UserType } from 'src/user-type/entities/user-type.entity';
import { ServiceAppointment } from 'src/services/entities/service-appointment.entity';
import { ServiceLabResult } from 'src/services/entities/service-lab-result.dto';
import { Notification } from 'src/notification/entities/notification.entity';
import { DoctorsSchedule } from 'src/doctors-schedule/entities/doctors-schedule.entity';

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
  Service,
  ServicePackages,
  ServiceCategory,
  PatientDoctor,
  PatientMedtech,
  MedicalInfo,
  ServiceAppointment,
  ServiceLabResult,
  Notification,
  DoctorsSchedule,
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
  Service,
  ServicePackages,
  ServiceCategory,
  PatientDoctor,
  PatientMedtech,
  MedicalInfo,
  ServiceAppointment,
  ServiceLabResult,
  Notification,
  DoctorsSchedule,

};

export default entities;
