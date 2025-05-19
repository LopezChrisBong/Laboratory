
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Patient } from 'src/appointment/entities/patient.entity';
import { AssignedModule } from 'src/assigned-modules/entities/assigned-module.entity';
import { Users } from 'src/auth/entities/auth.entity';
import { ServiceCategory } from 'src/services/entities/service-category.entity';
import { ServicePackages } from 'src/services/entities/service-packages.entity';
import { Service } from 'src/services/entities/service.entity';
import { SysModule } from 'src/sys-modules/entities/sys-module.entity';
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
  Patient,
  Appointment,
  Service,
  ServicePackages,
  ServiceCategory

];

export {
  Users,
  UserDetail,
  UserType,
  UserRole,
  AssignedModule,
  SysModule,
  Patient,
  Appointment,
  Service,
  ServicePackages,
  ServiceCategory

};

export default entities;
