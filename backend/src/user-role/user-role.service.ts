import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UserRole } from './entities/user-role.entity';

@Injectable()
export class UserRoleService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(UserRole)
    private readonly userRoleRep: Repository<UserRole>,
  ) {}
  create(createUserRoleDto: CreateUserRoleDto) {
    return 'This action adds a new userRole';
  }

 async findAll() {
    let data = await this.userRoleRep.find();
    // .createQueryBuilder('ur')
    // .where('ur.id != 5')
    // .getMany();
    return data
  }

  findOne(id: number) {
    return this.userRoleRep.findOneBy({ id });
  }

  update(id: number, updateUserRoleDto: UpdateUserRoleDto) {
    return `This action updates a #${id} userRole`;
  }

  remove(id: number) {
    return `This action removes a #${id} userRole`;
  }
}
