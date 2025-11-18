import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { hashPassword } from 'src/auth/utils/bcrypt';
import {
  Users,
  UserType,
} from 'src/entities';

import { UserTypeService } from 'src/user-type/user-type.service';
import { Brackets, DataSource, Repository } from 'typeorm';
import { CreateUserAuthDto } from './dto/create-user-auth.dto';
import { CreateUserDetailDto } from './dto/create-user-detail.dto';
import { UpdateUserAuthDto } from './dto/update-user-auth.dto';
import { UpdateUserCredential } from '../auth/dto/update-user-credential.dto';
import { UpdateUserDetailDto } from './dto/update-user-detail.dto';
import { UserDetail } from './entities/user-detail.entity';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreatePDSDto } from './dto/create-pds.dto';
import { create } from 'domain';
import e from 'express';
import { ellipse } from 'pdfkit';
import { UpdatePDSDto } from './dto/update-pds.dto';
import { UpdateMyPDSDto } from './dto/update-my-pds.dto';
import { UpdateVerifiedUser } from './dto/update-verified-user.dto';
import { UserTypeRole } from './dto/update-user-type-role.dto';
import { isNotEmpty } from 'class-validator';
import { empty } from 'rxjs';
import {
  getCurrentDateTimeString,
  trimString,
} from 'src/shared/global-function';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserDetailsService {
  constructor(
    @InjectRepository(UserDetail)
    private readonly userdetailsRepository: Repository<UserDetail>,
    private authService: AuthService,
    private usertypeService: UserTypeService,
    private dataSource: DataSource,
    private mailService: MailService,
  ) {}

  async getAllUsersToVerify(curr_user:any) {

    const user = await this.dataSource.query(
      'SELECT * FROM user_detail where id ="'+curr_user.userdetail.id+'"',
    );

    if(user[0].status == 0){
      let data = await this.dataSource.manager
      .createQueryBuilder(UserDetail, 'UD')
      .select([
        "IF (!ISNULL(UD.mname)  AND LOWER(UD.mname) != 'n/a', concat(UD.fname, ' ',SUBSTRING(UD.mname, 1, 1) ,'. ',UD.lname) ,concat(UD.fname, ' ', UD.lname)) as name",
        'UD.id as id',
        'UD.fname as fname',
        'UD.mname as mname',
        'UD.lname as lname',
        'UD.status as status',
        'UD.liscence_no as liscence_no',
      ])
      .leftJoinAndMapOne('UD.user', Users, 'user', 'UD.userID = user.id')
      .where('user.isValidated = 1')
      .andWhere('user.id != 2') //security user ID
      .andWhere('user.isAdminApproved = 0')
      .getRawMany();
    return data;
    }

    let data = await this.dataSource.manager
      .createQueryBuilder(UserDetail, 'UD')
      .select([
        "IF (!ISNULL(UD.mname)  AND LOWER(UD.mname) != 'n/a', concat(UD.fname, ' ',SUBSTRING(UD.mname, 1, 1) ,'. ',UD.lname) ,concat(UD.fname, ' ', UD.lname)) as name",
        'UD.id as id',
        'UD.fname as fname',
        'UD.mname as mname',
        'UD.lname as lname',
        'UD.status as status',
        'UD.liscence_no as liscence_no',
      ])
      .leftJoinAndMapOne('UD.user', Users, 'user', 'UD.userID = user.id')
      .where('user.isValidated = 1')
      .andWhere('user.id != 2') //security user ID
      .andWhere('user.isAdminApproved = 0')
      .andWhere('UD.status = "'+user[0].status+'"')
      .getRawMany();
    return data;
  }

  async getAllVerifiedUser(curr_user:any) {


    const user = await this.dataSource.query(
      'SELECT * FROM user_detail where id ="'+curr_user.userdetail.id+'"',
    );
    if(user[0].status == 0){
      let data = await this.dataSource.manager
      .createQueryBuilder(UserDetail, 'UD')
      .select([
        "IF (!ISNULL(UD.mname) AND LOWER(UD.mname) != 'n/a', concat(UD.fname, ' ',SUBSTRING(UD.mname, 1, 1) ,'. ',UD.lname) ,concat(UD.fname, ' ', UD.lname)) as name",
        'UD.id as id',
        'UD.fname as fname',
        'UD.mname as mname',
        'UD.lname as lname',
        'UD.status as status',
      ])
      .leftJoinAndMapOne('UD.user', Users, 'user', 'UD.userID = user.id')
      .where('user.isValidated = 1')
      .andWhere('user.id != 2') //security user ID
      .andWhere('user.isAdminApproved = 1')
      .getRawMany();
    return data;
    }
    let data = await this.dataSource.manager
      .createQueryBuilder(UserDetail, 'UD')
      .select([
        "IF (!ISNULL(UD.mname) AND LOWER(UD.mname) != 'n/a', concat(UD.fname, ' ',SUBSTRING(UD.mname, 1, 1) ,'. ',UD.lname) ,concat(UD.fname, ' ', UD.lname)) as name",
        'UD.id as id',
        'UD.fname as fname',
        'UD.mname as mname',
        'UD.lname as lname',
        'UD.status as status',
      ])
      .leftJoinAndMapOne('UD.user', Users, 'user', 'UD.userID = user.id')
      .where('user.isValidated = 1')
      .andWhere('user.id != 2') //security user ID
      .andWhere('user.isAdminApproved = 1')
      .andWhere('UD.status = "'+user[0].status+'"')
      .getRawMany();
    return data;

  }

  async TeachingRole(grade:string, curr_user:any) {
   


    let conflict = grade == 'Grade 1'? 1 : grade == 'Grade 2'? 2 : grade == 'Grade 3'? 3 :grade == 'Grade 4'? 4 :grade == 'Grade 5'? 5 :grade == 'Grade 6'? 6 :grade == 'Grade 7'? 7 :grade == 'Grade 8'? 8 :grade == 'Grade 9'? 9 :grade == 'Grade 10'? 10 :grade == 'Grade 11'? 11 : 12
    
    // // console.log('grade',conflict)


    const user = await this.dataSource.query(
      'SELECT * FROM user_detail where id ="'+curr_user.userdetail.id+'"',
    );

    // // console.log(user[0].id)

    const count = await this.dataSource.query(
      'SELECT COUNT(*) as count FROM teacher_grade_level where grade_level ="'+conflict+'"',
    );

  

    if(count[0].count == 0){
    let data = await this.dataSource.manager
      .createQueryBuilder(UserDetail, 'UD')
      .select([
        "IF (!ISNULL(UD.mname) AND LOWER(UD.mname) != 'n/a', concat(UD.fname, ' ',SUBSTRING(UD.mname, 1, 1) ,'. ',UD.lname) ,concat(UD.fname, ' ', UD.lname)) as name",
        'UD.id as id',
        'UD.fname as fname',
        'UD.mname as mname',
        'UD.lname as lname',
      ])
      .leftJoin( Users, 'user', 'UD.userID = user.id')
      .where('user.isValidated = 1')
      .andWhere('user.id != 2') //security user ID
      .andWhere('user.isAdminApproved = 1')
      .andWhere('user.user_roleID = 2')
      .andWhere('UD.status = "'+user[0].status+'"')
      .getRawMany();
    return data;
    }

        let data = await this.dataSource.manager
      .createQueryBuilder(UserDetail, 'UD')
      .select([
        "IF (!ISNULL(UD.mname) AND LOWER(UD.mname) != 'n/a', concat(UD.fname, ' ',SUBSTRING(UD.mname, 1, 1) ,'. ',UD.lname) ,concat(UD.fname, ' ', UD.lname)) as name",
        'UD.id as id',
        'UD.fname as fname',
        'UD.mname as mname',
        'UD.lname as lname',
      ])
      .leftJoinAndMapOne('UD.user', Users, 'user', 'UD.userID = user.id')
      .where('user.isValidated = 1')
      .andWhere('user.id != 2') //security user ID
      .andWhere('tg.grade_level = '+conflict+'') //security user ID
      .andWhere('user.isAdminApproved = 1')
      .andWhere('user.user_roleID = 2')
      .getRawMany();
    return data;

  }

  async TeachingRoleAdvisory(id:number, grade:string, curr_user:any) {
    let conflict = grade == 'Grade 1'? 1 : grade == 'Grade 2'? 2 : grade == 'Grade 3'? 3 :grade == 'Grade 4'? 4 :grade == 'Grade 5'? 5 :grade == 'Grade 6'? 6 :grade == 'Grade 7'? 7 :grade == 'Grade 8'? 8 :grade == 'Grade 9'? 9 :grade == 'Grade 10'? 10 :grade == 'Grade 11'? 11 : 12
    
    // // console.log('grade',conflict)


    const user = await this.dataSource.query(
      'SELECT * FROM user_detail where id ="'+curr_user.userdetail.id+'"',
    );

    let teacherId = id;
    // // console.log(user[0].id)
    if(id != null){
    
      // console.log('naay value ID',teacherId)

    }else{
      // console.log('walay value ID',teacherId)
    }

      let data = await this.dataSource.manager
      .createQueryBuilder(UserDetail, 'UD')
      .select([
        "IF (!ISNULL(UD.mname) AND LOWER(UD.mname) != 'n/a', concat(UD.fname, ' ',SUBSTRING(UD.mname, 1, 1) ,'. ',UD.lname) ,concat(UD.fname, ' ', UD.lname)) as name",
        'UD.id as id',
        'UD.fname as fname',
        'UD.mname as mname',
        'UD.lname as lname',
      ])
      .leftJoinAndMapOne('UD.user', Users, 'user', 'UD.userID = user.id')
      .where('user.isValidated = 1')
      .andWhere('user.isAdminApproved = 1')
      .andWhere('user.user_roleID = 2')
      .andWhere('UD.id = "'+id+'"')
      .andWhere('UD.status = "'+user[0].status+'"')
      .getRawMany();
      // console.log('No Null',data)
    return data;
    


  }


  async TeachingRoleSched(curr_user:any) {



    const user = await this.dataSource.query(
      'SELECT * FROM user_detail where id ="'+curr_user.userdetail.id+'"',
    );

    // // console.log(user[0].id)
    let data = await this.dataSource.manager
      .createQueryBuilder(UserDetail, 'UD')
      .select([
        "IF (!ISNULL(UD.mname) AND LOWER(UD.mname) != 'n/a', concat(UD.fname, ' ',SUBSTRING(UD.mname, 1, 1) ,'. ',UD.lname) ,concat(UD.fname, ' ', UD.lname)) as name",
        'UD.id as id',
        'UD.fname as fname',
        'UD.mname as mname',
        'UD.lname as lname',
      ])
      .leftJoin( Users, 'user', 'UD.userID = user.id')
      .where('user.isValidated = 1')
      .andWhere('user.id != 2') //security user ID
      .andWhere('user.isAdminApproved = 1')
      .andWhere('user.user_roleID = 2')
      .andWhere('UD.status = "'+user[0].status+'"')
      .getRawMany();
    return data;

  }

  async updateVerifiedUser(updateVU: UpdateVerifiedUser) {
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (updateVU.user_roleID == 5) {
        return {
          msg: 'Request cannot be granted! You cannot add new superadmin.',
          status: HttpStatus.BAD_REQUEST,
        };
      } else {
        await queryRunner.manager.update(Users, updateVU.userID, {
          isAdminApproved: true,
          usertypeID: updateVU.usertypeID,
          user_roleID: updateVU.user_roleID == null ? 3 : updateVU.user_roleID,
          assignedModuleID: updateVU.assignedModuleID,
        });

        await queryRunner.manager.update(UserDetail, updateVU.id, {
          status: updateVU.status,
          liscence_no: updateVU.liscence_no,
        });
        const user = await this.findUser(updateVU.userID);
        await this.mailService.confirmVerifyuser(user);
        await queryRunner.commitTransaction();
        return {
          msg: updateVU.update_type == 1 ? 'User verified.' : 'User updated.',
          status: HttpStatus.OK,
        };
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return {
        msg: error,
        status: HttpStatus.BAD_REQUEST,
      };
    } finally {
      await queryRunner.release();
    }
  }

    async findUser(id: number) {
      let data = await this.dataSource
        .createQueryBuilder(Users, 'u')
        .select([
          'u.*',
          "IF (!ISNULL(ud.mname) AND LOWER(ud.mname) != 'n/a', concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,'. ',ud.lname) ,concat(ud.fname, ' ', ud.lname)) as name",
        ])
        .leftJoin(UserDetail, 'ud', 'u.id = ud.userID')
        .where('u.id = :id', { id })
        .getRawOne();
        return data
    }

  async findAll() {
   
    const toReturn = await this.dataSource.query(
      'SELECT * FROM user_detail left join users on user_detail.userID = users.id where users.isAdminApproved != "false" order by lname ASC',
    );
    return toReturn;
  }
  async getUserProfileImg(curr_user: any) {
    const a = await this.userdetailsRepository
      .createQueryBuilder('ud')
      .select(['ud.profile_img as profile_img'])
      .where('ud.id = :id', { id: curr_user.userdetail.id })
      .getRawOne();

    if (a.profile_img != null) {
      return a;
    } else {
      return { profile_img: 'img_avatar.png' };
    }
  }

 async getPersonalInfo(user: any) {
    
    const id = user.userdetail.id;
    let data =  await this.dataSource
      .createQueryBuilder(UserDetail, 'ud')
      .select([
        'ud.id as id',
        'ud.fname as fname',
        'ud.mname as mname',
        'ud.lname as lname',
        'ud.suffix as suffix',
        'ud.sex as sex',
        'ud.mobile_no as mobile_no',
        'ud.profile_img as profile_img',
        'ud.status as status',
      ])
      .where('ud.id = :id', { id })
      .getRawOne();

      return data;
  }

  async uploadProfileImg(filename: string, user: any) {
    // // console.log(user.user[0].id)
    try {
      const imgupload = await this.userdetailsRepository.update(
        user.userdetail.id,
        { profile_img: filename },
      );

      if (imgupload.affected == 1) {
        return {
          msg: 'Saving successful',
          status: HttpStatus.OK,
        };
      } else {
        return {
          msg: 'Saving failed',
          status: HttpStatus.BAD_REQUEST,
        };
      }
    } catch (error) {
      return {
        msg: error,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async updateUserDetail(user: any, updateUserDetailDto: UpdateUserDetailDto) {
    try {
      const upd = await this.userdetailsRepository.update(user.userdetail.id, {
        fname: updateUserDetailDto.fname,
        mname: updateUserDetailDto.mname,
        lname: updateUserDetailDto.lname,
        suffix: updateUserDetailDto.suffix,
        sex: updateUserDetailDto.sex,
        mobile_no: updateUserDetailDto.mobile_no,
      });

      if (upd.affected == 1) {
        return {
          msg: 'Update successful.',
          status: HttpStatus.OK,
        };
      } else {
        return {
          msg: 'Update failed.',
          status: HttpStatus.BAD_REQUEST,
        };
      }
    } catch (error) {
      return {
        msg: error,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  async getTeachingNon() {
    const nonTeaching = await this.userdetailsRepository
      .createQueryBuilder('ud')
      // .leftJoin(Employee, 'e', 'ud.id = e.user_detailID')
      .leftJoin(Users, 'u', 'u.id = ud.userID')
      // .where('e.isActive = :isActive', { isActive: true })
      .andWhere("u.user_roleID = 1")
      .andWhere('u.isValidated = 1')
      .andWhere('u.isAdminApproved = 1')
      .andWhere('ud.id != 2') //security userID
      .getCount();

      
    const teaching = await this.userdetailsRepository
      .createQueryBuilder('ud')
      // .leftJoin(Employee, 'e', 'ud.id = e.user_detailID')
      .leftJoin(Users, 'u', 'u.id = ud.userID')
      // .where('e.isActive = :isActive', { isActive: true })
      .andWhere("u.user_roleID = 2")
      .andWhere('u.isValidated = 1')
      .andWhere('u.isAdminApproved = 1')
      .andWhere('ud.id != 2') //security userID
      .getCount();

      // console.log(nonTeaching,teaching);

    return {
      nonTeaching,
      teaching,
    };
  }


  async getMaleFemaleCount() {
    const male = await this.userdetailsRepository
      .createQueryBuilder('ud')
      // .leftJoin(Employee, 'e', 'ud.id = e.user_detailID')
      .leftJoin(Users, 'u', 'u.id = ud.userID')
      // .where('e.isActive = :isActive', { isActive: true })
      .andWhere("ud.sex = 'Male'")
      .andWhere('u.isValidated = 1')
      .andWhere('u.isAdminApproved = 1')
      .andWhere('ud.id != 2') //security userID
      .getCount();
    const female = await this.userdetailsRepository
      .createQueryBuilder('ud')
      // .leftJoin(Employee, 'e', 'ud.id = e.user_detailID')
      .leftJoin(Users, 'u', 'u.id = ud.userID')
      // .where('e.isActive = :isActive', { isActive: true })
      .andWhere("ud.sex = 'Female'")
      .andWhere('u.isValidated = 1')
      .andWhere('u.isAdminApproved = 1')
      .andWhere('ud.id != 2') //security userID
      .getCount();

      console.log( male,
        female,)

    return {
      male,
      female,
    };
  }

  async remove(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {

      const toReturn = await queryRunner.query(
        'DELETE users , user_detail  FROM users  INNER JOIN user_detail  WHERE users.id= user_detail.userID and user_detail.id = "'+id+'"',
      );
      await queryRunner.commitTransaction();
      return {
        
        msg: 'Deleted successfully'+ toReturn +'!',
        status: HttpStatus.OK,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return {
        msg: 'Deletion failed',
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }



  



}
