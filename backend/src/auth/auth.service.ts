import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { LoginDto } from './dto/login.dto';
import { Users } from './entities/auth.entity';
import { comparePassword, hashPassword } from './utils/bcrypt';
import { DataSource, Repository } from 'typeorm';
import { UpdateUserCredential } from 'src/auth/dto/update-user-credential.dto';
import { ChangePasswordDto } from './dto/change-pass.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from 'src/mail/mail.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { ConfirmOTPDto } from './dto/confirm-otp.dto';
import { UserDetail, UserLogs, UserType } from 'src/entities';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private jwtService: JwtService,
    private dataSource: DataSource,
    private mailService: MailService,
  ) {}

  // async sendMail() {
  //   const dataForEmail = {
  //     name: 'Jan Florenz D. Igcasama',
  //     email: 'janflorenz.igcasama@dnsc.edu.ph',
  //     OTP: '123456',
  //   };

  //   await this.mailService.sendOTP(dataForEmail);
  // }

  async create(registerUser: RegisterUserDto) {

    // // console.log(registerUser)
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
     
      const otp = Math.floor(100000 + Math.random() * 9000);
      const hashOtp = hashPassword(otp.toString());

      // CREATING NEW USER
      const newUser = queryRunner.manager.create(Users, {
        email: registerUser.email,
        otp: hashOtp,
        usertypeID: 2,
        password: hashPassword(registerUser.password),
      });
     

      const newUserSaved = await queryRunner.manager.save(newUser);

      const newUserDetail = queryRunner.manager.create(UserDetail, {
        liscence_no:registerUser.liscence_no,
        fname: registerUser.fname,
        mname: registerUser.mname,
        lname: registerUser.lname,
        suffix: registerUser.suffix,
        userID: newUserSaved.id,
      });
    await queryRunner.manager.save(newUserDetail);

      await queryRunner.commitTransaction();

      return {
        status: HttpStatus.CREATED,
        message: 'User saved.',
      };
      
    } catch (err) {
      await queryRunner.rollbackTransaction();
      const toReturn = {
        message: err,
        status: HttpStatus.BAD_REQUEST,
      };
      return toReturn;
      // // console.log(err)
    } finally {
      await queryRunner.release();
    }
  }

  async login(loginUser: LoginDto) {
    const res_user = await this.findUser(loginUser.email.toString());
 
   
    if (res_user) {
      // comparing hashed password in the database with the user's password
 
      const isMatch = comparePassword(
        loginUser.password.toString(),
        res_user.password,
      );
      if (isMatch) {
          
        const adminApproved = res_user.isAdminApproved
        if(adminApproved != false){
          const userdetail = await this.dataSource
          .getRepository(UserDetail)
          .createQueryBuilder('userdetail')
          .leftJoinAndMapOne(
            'userdetail.user',
            Users,
            'user',
            'userdetail.userID = user.id',
          )
          .leftJoinAndMapOne(
            'userdetail.usertype',
            UserType,
            'usertype',
            'user.usertypeID = usertype.id',
          )
          .where('userdetail.userID = :userid', { userid: res_user.id })
          .getOne();

        const {
          bdate,
          birth_place,
          sex,
          email,
          mobile_no,
          ...rest
        } = userdetail;
        const payload = { userdetail: rest };
        let saveLogs = await  this.dataSource.manager.create(UserLogs, {
          email:res_user.email,
          userID:res_user.id
        })
        await this.dataSource.manager.save(saveLogs);
        return {
          status: HttpStatus.OK,
          token: this.jwtService.sign(payload),
        };
        }else{
          return new HttpException(
            'Please contact admin for the approval of your account!.',
            HttpStatus.NOT_FOUND,
          );
        }
   
      } else {
        return new HttpException(
          'Password do not match.',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    return new HttpException(
      'Invalid email or password.',
      HttpStatus.NOT_FOUND,
    );
  }

  async checkEmail(email: string) {
    const isExist = await this.usersRepository.findOneBy({ email });
    return isExist ? true : false;
  }

  // async confirmOTP(conOTP: ConfirmOTPDto) {
  //   const user = await this.usersRepository.findOneBy({ email: conOTP.email });
  //   try {
  //     const isMatch = comparePassword(conOTP.otp, user.otp);
  //     if (isMatch) {
  //       const toConfirm = await this.usersRepository.update(user.id, {
  //         isValidated: true,
  //       });
  //       if (toConfirm.affected == 1) {
  //         const dataForEmail = {
  //           email: conOTP.email,
  //         };

  //         await this.mailService.sendConfirmation(dataForEmail);

  //         return {
  //           msg: 'OTP matched.',
  //           status: HttpStatus.OK,
  //         };
  //       }
  //     } else {
  //       return {
  //         msg: 'OTP do not match.',
  //         status: HttpStatus.BAD_REQUEST,
  //       };
  //     }
  //   } catch (error) {
  //     return {
  //       msg: error,
  //       status: HttpStatus.BAD_REQUEST,
  //     };
  //   }
  // }

  getDecoded(token: string) {
    // const decodedJwtAccessToken = this.jwtService.decode(signedJwtAccessToken);
    return this.jwtService.decode(token);
  }

  async findUser(email: string) {
    return await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async getAllUserLogs() {
    const data = await this.dataSource.manager
      .createQueryBuilder(UserLogs, 'ul')
      .select('ul.*')
      .getRawMany();

    return data
  }

    async getAllEntryLogs() {
      const  datas = await this.dataSource.manager.query(
        'SELECT * FROM ' +
          process.env.DATABASE_NAME +
          ".logs"
      );   
       console.log(datas)
    return datas
  }

  // UPDATE THE USERS PASSWORD ONLY
  async updateUserCred(user: any, updateUserCred: UpdateUserCredential) {
    const upd = await this.usersRepository.update(
      user.user.user.id,
      updateUserCred,
    );

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
  }

  async changePassword(user: any, changePassDto: ChangePasswordDto) {
    // compare if input old password match the saved password
    const res_user = await this.findUser(user.user.user.email);
    if (res_user) {
      // comparing hashed password in the database with the user's password
      const isMatch = comparePassword(
        changePassDto.old_password,
        res_user.password,
      );
      if (isMatch) {
        const updateCred = await this.usersRepository.update(
          user.user.user.id,
          {
            password: hashPassword(changePassDto.new_password),
          },
        );

        if (updateCred.affected == 1) {
          return {
            msg: 'Password updated.',
            status: HttpStatus.OK,
          };
        } else {
          return {
            msg: 'Password update failed.',
            status: HttpStatus.BAD_REQUEST,
          };
        }
      } else {
        return {
          msg: 'Password not match.',
          status: HttpStatus.BAD_REQUEST,
        };
      }
    }
  }

  async resetPassword(resetPassDto: ResetPasswordDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let data = await queryRunner.manager
        .createQueryBuilder(Users, 'u')
        .where('u.email = :email', { email: resetPassDto.email })
        .getOne();

      if (data) {
        let hashPass = hashPassword(resetPassDto.password);
        await queryRunner.manager.update(Users, data.id, {
          password: hashPass,
        });
        await queryRunner.commitTransaction();
        return {
          msg: 'Reset successful.',
          status: HttpStatus.OK,
        };
      } else {
        await queryRunner.rollbackTransaction();
        return {
          msg: 'Data not found.',
          status: HttpStatus.NOT_FOUND,
        };
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return {
        msg: 'Reset failed.',
        status: HttpStatus.BAD_REQUEST,
      };
    } finally {
      await queryRunner.release();
    }
  }


  async changePass(user: any, changPassDto: ChangePasswordDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    let activeUser = await queryRunner.query(
      'SELECT * FROM users WHERE id = ' + user.userdetail.userID,
    );
    await queryRunner.release();

    const ismatch = comparePassword(
      changPassDto.old_password,
      activeUser[0].password,
    );
    try {
      if (ismatch) {
        let pass = hashPassword(changPassDto.new_password);
        await this.usersRepository.update(activeUser[0].id, { password: pass });
        return {
          msg: 'New password saved.',
          status: HttpStatus.OK,
        };
      } else {
        return {
          msg: 'Invalid password.',
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

  async remove(id: number) {
    try {
      const res = await this.usersRepository.delete(id);
      return {
        msg: 'User deleted.',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        msg: 'User cannot be deleted.',
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

   async sendNewPassword(email: string) {
    const tempPassword = await this.generateRandomPassword(12); 
          const user = await this.findUser(email);
       

    if (user) {
   
      const token = Math.floor(100000 + Math.random() * 9000);
      const emailUser = { email: email, OTP: token , userID:user.id,tempPassword:tempPassword};
      const hashToken = hashPassword(token.toString());
      await this.usersRepository.update(user.id, { otp: hashToken });
      await this.mailService.sendMail(emailUser);
      let pass = hashPassword(tempPassword);
      await this.usersRepository.update(user.id, { password: pass });
      return {
        user: user.email,
        msg: 'Email send successful. Password successfully updated!',
        status: HttpStatus.OK,
      };
    } else {
      return {
        msg: 'Email not registered',
        status: HttpStatus.NOT_FOUND,
      };
    }
  }

  async generateRandomPassword(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  return password;
}
}
