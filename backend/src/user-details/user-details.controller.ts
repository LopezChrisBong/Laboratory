import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  Response,
  UseInterceptors,
  UploadedFile,
  Headers,
  StreamableFile,
  Header,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { UserDetailsService } from './user-details.service';
import { CreateUserDetailDto } from './dto/create-user-detail.dto';
import { UpdateUserDetailDto } from './dto/update-user-detail.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserAuthDto } from './dto/create-user-auth.dto';
import { JWTAuthGuard } from 'src/auth/utils/jwt-auth-guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Helper } from 'src/shared/helper';
import { JwtService } from '@nestjs/jwt';
import { createReadStream } from 'fs';
import { join } from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { fileMimetypeFilter } from './validation/file-mimetype-filters';
import { ParseFile } from './validation/parse-file.pipe';
import { SearchUserDetailDto } from './dto/search-userdetail.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreatePDSDto } from './dto/create-pds.dto';
import { UpdatePDSDto } from './dto/update-pds.dto';
import { UpdateMyPDSDto } from './dto/update-my-pds.dto';
import { UpdateVerifiedUser } from './dto/update-verified-user.dto';
import { UserTypeRole } from './dto/update-user-type-role.dto';
import { currentUser } from 'src/shared/jwtDecode';

@ApiTags('User Details')
@Controller('user-details')
export class UserDetailsController {
  constructor(
    private readonly userDetailsService: UserDetailsService,
    private jwtService: JwtService,
  ) {}

  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Post('createauth')
  createUser(@Body() createUserAuthDto: CreateUserAuthDto, @Request() req) {
    // return this.userDetailsService.createauth(createUserAuthDto, req.body);
  }

  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Get('getAllUsersToVerify')
  getAllUsersToVerify(
    @Headers() headers
  ) {
    var head_str = headers.authorization;
    const curr_user = currentUser(head_str);
    return this.userDetailsService.getAllUsersToVerify(curr_user);
  }


  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Get('getAllVerifiedUser')
  getAllVerifiedUser(
    @Headers() headers
  ) {
    var head_str = headers.authorization;
    const curr_user = currentUser(head_str);
    return this.userDetailsService.getAllVerifiedUser(curr_user);
  }

  @Get('getAllVerifiedUser/TeachingRole/:grade')
  TeachingRole(@Param('grade') grade: string, @Headers() headers ) {
    var head_str = headers.authorization;
    const curr_user = currentUser(head_str);
    return this.userDetailsService.TeachingRole(grade,curr_user);
  }

  @Get('getAdviser/RoomAdvisory/:id/:grade')
  TeachingRoleAdvisory( @Param('id') id: number,@Param('grade') grade: string, @Headers() headers ) {
    var head_str = headers.authorization;
    const curr_user = currentUser(head_str);
    return this.userDetailsService.TeachingRoleAdvisory(id,grade, curr_user);
  }

  @Get('getAllVerifiedUser/TeachingRoleSched')
  TeachingRoleSched( @Headers() headers ) {
    var head_str = headers.authorization;
    const curr_user = currentUser(head_str);
    return this.userDetailsService.TeachingRoleSched(curr_user);
  }

  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Post('updateVerifiedUser')
  updateVerifiedUser(@Body() updateVU: UpdateVerifiedUser) {
    return this.userDetailsService.updateVerifiedUser(updateVU);
  }


  @Get()
  findAll() {
    return this.userDetailsService.findAll();
  }

  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Get('getUserProfileImg')
  getUserProfileImg(@Headers() headers) {
    var head_str = headers.authorization;
    // var arr = head_str.split(' ');
    // var token_string = arr[1].toString();

    // var curr_user = this.jwtService.decode(token_string);
    const curr_user = currentUser(head_str);
    return this.userDetailsService.getUserProfileImg(curr_user);
  }

  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Get('getPersonalInfo')
  getPersonalInfo(@Headers() headers) {
    var head_str = headers.authorization;
    // var arr = head_str.split(' ');
    // var token_string = arr[1].toString();

    // var curr_user = this.jwtService.decode(token_string);
    const curr_user = currentUser(head_str);
    return this.userDetailsService.getPersonalInfo(curr_user);
  }


  
  @Get('getProfileImg/:filename')
  getProfileImg(
    @Param('filename') filename: string,
    @Response({ passthrough: true }) res,
  ): StreamableFile {
    let file;
   
    file = createReadStream(join(process.cwd(), '/../upload_img/' + filename));
    res.set({
      'Content-Type': 'image/png',
    });
    file.on('error', (err) => {
      console.error(err);
    });

    return new StreamableFile(file);
  }


  
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  // Image uploading
  @Post('uploadimage')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: Helper.filePath,
        filename: Helper.customFileName,
      }),
    }),
  )
  async uploadImage(@UploadedFile(ParseFile) file, @Headers() headers) {
    var head_str = headers.authorization;

    const curr_user = currentUser(head_str);

    const user = await this.userDetailsService.getPersonalInfo(curr_user);

    if (user.profile_img != 'img_avatar') {
      //check if app is in production
      // if (process.env.NODE_ENV == 'production') {
      //   fs.unlink(
      //     join(__dirname, `../upload_img/${user.profile_img}`),
      //     async (err) => {
      //       if (err) {
      //         console.log(err);
      //       }
      //     },
      //   );
      // } else {
      fs.unlink(
        join(process.cwd(), `/../upload_img/${user.profile_img}`),
        async (err) => {
          if (err) {
            console.log(err);
          }
        },
      );
      // }
    }

    return this.userDetailsService.uploadProfileImg(
      file.file.filename,
      curr_user,
    );
  }

  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Post('updateUser')
  updateUserDetail(
    @Headers() headers,
    @Body() updateUserDetailDto: UpdateUserDetailDto,
  ) {
    var head_str = headers.authorization;
    // var arr = head_str.split(' ');
    // var token_string = arr[1].toString();

    // var curr_user = this.jwtService.decode(token_string);
    const curr_user = currentUser(head_str);
    return this.userDetailsService.updateUserDetail(
      curr_user,
      updateUserDetailDto,
    );
  }

  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Get('getTeachingNon')
  getTeachingNon(@Headers() headers) {
    return this.userDetailsService.getTeachingNon();
  }

  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Get('getMaleFemaleCount')
  getMaleFemaleCount(@Headers() headers) {
    return this.userDetailsService.getMaleFemaleCount();
  }

  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userDetailsService.remove(+id);
  }


}
