import { HttpStatus, Inject, Injectable } from '@nestjs/common';
// import { CreatePdfGeneratorDto } from './dto/create-pdf-generator.dto';
// import { UpdatePdfGeneratorDto } from './dto/update-pdf-generator.dto';
// import * as PDFDocument from 'pdfkit'
// import { PDFOptions, PDFService } from '@t00nday/nestjs-pdf';

import { DataSource } from 'typeorm';

import { SendNewEmailDto } from './dto/send-new-email.dto';
import {
  UserDetail,
  Users,
} from 'src/entities';
import { join } from 'path';
import { log } from 'console';
import { scale } from 'pdfkit';
// import {
//   computeTotal,
//   formatActualAccompishment,
//   formatSuccessIndicator,
//   getTotal,
//   loadSummaryHeader,
// } from 'src/ipcr-target/shared-function';
// import newFs
const hbs = require('handlebars');
const QRCode = require('qrcode');
const path = require('path');
const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const moment = require('moment');
const fs1 = require('fs');

hbs.registerHelper('dateFormat', function (value) {
  if (value) {
    return moment(value).format('MM/DD/YYYY');
  }
  return;
});

hbs.registerHelper('formatTime', function (time, format = 'h:mm a') {
  if (time) {
    return moment(time).format(format);
  }
  return;
});

hbs.registerHelper('formatAlphanumericDate', function (value) {
  if (value) {
    return moment(value).format('MMMM DD, YYYY');
  }
  return;
});

hbs.registerHelper('toUpperCase', function (value) {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  return;
});

hbs.registerHelper('concatenate', function (value, value1) {
  return value + '/' + value1;
});

hbs.registerHelper('formatAmount', function (value) {
  const val = (value / 1).toFixed(2).replace(',', '.');
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
});

hbs.registerHelper('getAnnual', function (value) {
  var annual = 0;
  for (let i = 0; i < 12; i++) {
    annual += parseFloat(value);
  }
  return annual;
});

hbs.registerHelper('curDate', function (formattype) {
  if (formattype == 'numeric') {
    return moment().format('MM/DD/YYYY');
  } else if (formattype == 'alphanumeric') {
    return moment().format('MMMM DD, YYYY');
  }
});

hbs.registerHelper('getPresentDate', function () {
  return moment().format('MM/DD/YY');
});

hbs.registerHelper('formatDate', function (value) {
  return moment(value).format('MM/DD/YY');
});

hbs.registerHelper('sexFormat', function (value) {
  if (value) {
    if (value.toLowerCase() == 'male') {
      return 'M';
    } else if (value.toLowerCase() == 'female') {
      return 'F';
    }
  }
});

hbs.registerHelper('for', function (from, to, incr, block) {
  var accum = '';
  for (var i = from; i < to; i += incr) accum += block.fn(i);
  return accum;
});

hbs.registerHelper('JSONParse', function (value) {
  return JSON.parse(value);
});

hbs.registerHelper('calcAge', function (value) {
  var dob = new Date(value);
  var diff_ms = Date.now() - dob.getTime();
  var age_dt = new Date(diff_ms);
  return Math.abs(age_dt.getUTCFullYear() - 1970);
});

hbs.registerHelper('ifEqual', function (value, conditionVal) {
  return value == conditionVal ? true : false;
});

hbs.registerHelper('formatValueIfNotIsNaN', function (value) {
  if (isNaN(value)) {
    return value;
  } else {
    const val = (value / 1).toFixed(2).replace(',', '.');
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
});

hbs.registerHelper('tableDateFormat', function (value) {
  const date = new Date(value);
  const mnthsArr = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const d = date.getDate();
  const month = mnthsArr[date.getMonth()];
  const yr = date.getFullYear();
  return d + '-' + month + '-' + yr.toString().substring(2);
});

hbs.registerHelper('getCurrentMonth', function () {
  const date = new Date();
  const mnthsArr = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const month = mnthsArr[date.getMonth()];

  return month;
});

hbs.registerHelper('getCurrentYear', function () {
  const date = new Date();
  const yr = date.getFullYear();

  return yr;
});

hbs.registerHelper('getPrevYear', function () {
  const date = new Date();
  const yr = date.getFullYear() - 1;

  return yr;
});

hbs.registerHelper('ifCond', function (v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('getObject', function (arr, index) {
  return arr[index];
});

hbs.registerHelper('getValue', function (arr, data) {
  return arr.data;
});

hbs.registerHelper('ifAns', function (v1, v2, options) {
  if (v1 == v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('ifCount', function (v1, v2, options) {
  if (v1 > v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('isNotNull', function (v1, options) {
  if (v1 != null) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('isNotNullAndNotNAandNotEmpty', function (v1, options) {
  if (
    v1 != null &&
    v1.toString().replace(/\s/g, '').replace(/\t/g, '').toLowerCase() !=
      'n/a' &&
    v1 != ' ' &&
    v1 != ''
  ) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('formatName', function (fname, mname, lname) {
  if (mname) {
    return fname + ' ' + mname[0] + '. ' + lname;
  } else {
    return fname + ' ' + lname;
  }
});

hbs.registerHelper('toTitleCase', function (val) {
  return val.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
});

hbs.registerHelper('getCount', function (val) {
  return val.length;
});

hbs.registerHelper('hasData', function (v1, v2, options) {
  if (v1.length > v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('getPercentage', function (val, totalVal) {
  let percentage = (val / totalVal) * 100;
  return percentage.toFixed(2);
});

hbs.registerHelper('formatGovIDDateIssued', function (val) {
  if (val) {
    let dump = val.split('/');
    let str;
    let str1;
    let str2;
    str1 = dump[0] == null || dump[0] == 'null' ? null : dump[0];
    str2 = dump[1] == null || dump[1] == 'null' ? null : dump[1];
    if (str1 && str2) {
      str = str1 + '/' + str2;
    } else if (str1 && !str2) {
      str = str1;
    } else if (!str1 && str2) {
      str = str2;
    } else if (!str1 && !str2) {
      str = 'N/A';
    }
    return str;
  } else {
    return 'N/A';
  }
});

// hbs.registerHelper('compute', function (val1, val2, operator) {
//   //operator must be string;
//   let toReturn;

//   switch (operator) {
//     case 'add':
//       toReturn = val1 + val2;
//       break;
//       case 'subtract':
//         toReturn = val1 - val2;
//       break;
//       case 'multiply':
//         toReturn = val1 * val2;
//       break;

//       case 'divide':
//         toReturn = val1 / val2;
//       break;

//   }

//   return toReturn;
// });

hbs.registerHelper('math', function (lvalue, operator, rvalue, options) {
  lvalue = parseFloat(lvalue);
  rvalue = parseFloat(rvalue);

  return {
    '+': lvalue + rvalue,
  }[operator];
});

@Injectable()
export class PdfGeneratorService {
  constructor(private dataSource: DataSource) {}

  async compile(templatename, data) {
    // //development
    //   process.cwd(),
    //   'src/pdf-generator/templates',
    //   `${templatename}.hbs`,
    // );

    //hosted filepath for pdf

    const filepath = path.join(
      __dirname,
      '../pdf-generator/templates',
      `${templatename}.hbs`,
    );

    const html = await fs.readFile(filepath, 'utf-8');
    return hbs.compile(html)(data);
  }

  base64_encode(file, type) {
    // read binary data
    var bitmap;
    if (type == 'profile') {
      if (fs.existsSync(file) == true) {
        bitmap = fs.readFileSync(file);
      } else {
        bitmap = fs.readFileSync(
          join(process.cwd(), '/../upload_img/img_avatar.png'),
        );
      }
    } else if (type == 'headerfooter') {
      bitmap = fs.readFileSync(file);
    } else if (type == 'esig') {
      if (fs.existsSync(file) == true) {
        bitmap = fs.readFileSync(file);
      } else {
        return;
      }
    }

    // convert binary data to base64 encoded string
    return Buffer.from(bitmap).toString('base64');
  }
  getFirstDate(data: any) {
    let dump = JSON.parse(data);
    return dump[0];
  }

  isValidJSON(str: any) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  formatDate(value) {
    return moment(value).format('MMM DD,YYYY');
  }



  // async getMySchedule(facultyId: number, filter: number) {
  //   // console.log(facultyId, filter)
  //   let mySched = await this.dataSource.manager
  //   .createQueryBuilder(Availability, 'A')
  //   .select([
  //     "A.id as id",
  //     "CONCAT(times_slot_from, ' - ', times_slot_to) AS time",
  //     "IF (!ISNULL(ud.mname)  AND LOWER(ud.mname) != 'n/a', concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,'. ',ud.lname) ,concat(ud.fname, ' ', ud.lname)) as name",
  //     "MAX(CASE WHEN day = 'Monday' THEN CONCAT('Subject: ', sub.subject_title, ', Room: ', room.room_section) END) AS Monday",
  //     "MAX(CASE WHEN day = 'Tuesday' THEN CONCAT('Subject: ', sub.subject_title, ', Room: ',  room.room_section) END) AS Tuesday",
  //     "MAX(CASE WHEN day = 'Wednesday' THEN CONCAT('Subject: ', sub.subject_title, ', Room: ',  room.room_section) END) AS Wednesday",
  //     "MAX(CASE WHEN day = 'Thursday' THEN CONCAT('Subject: ', sub.subject_title, ', Room: ',  room.room_section) END) AS Thursday",
  //     "MAX(CASE WHEN day = 'Friday' THEN CONCAT('Subject: ', sub.subject_title, ', Room: ',  room.room_section) END) AS Friday",
  //     "MAX(CASE WHEN day = 'Saturday' THEN CONCAT('Subject: ', sub.subject_title, ', Room: ',  room.room_section) END) AS Saturday"

  //   ])
  //   .leftJoin(UserDetail, 'ud', 'ud.id = A.teacherID')
  //   .where('A.teacherID = "'+facultyId+'"')
  //   .andWhere('A.school_yearId = "'+filter+'"')
  //   .groupBy('A.times_slot_from,A.times_slot_to,A.teacherID')
  //   .orderBy('A.times_slot_from')
  //   .getRawMany();

  //   let teacherName = mySched[0].name


  //   // let headerImg = join(process.cwd(), '/static/img/header.png');
  //   let headerImg = join(process.cwd(), '/../static/img/header.png');
  //   // let footerImg = join(process.cwd(), '/static/img/footer.png');
  //   let footerImg = join(process.cwd(), '/../static/img/footer.png');


  //   const data = [
  //     {
  //       header_img: this.base64_encode(headerImg, 'headerfooter'),
  //       footer_img: this.base64_encode(footerImg, 'headerfooter'),
  //       mySched:mySched,
  //       year: filter,
  //       teacherName:teacherName
  //       // month:getmonth
  //     },
  //   ];

  //   // // console.log(data);
  //   try {
  //     const browser = await puppeteer.launch({ 
  //       headless: 'new',
  //       args: ['--no-sandbox']
  //     });
  //     const page = await browser.newPage();
  //     // compile(template_name, data)
  //     const content = await this.compile('my-sched', data);
  //     await page.setContent(content);

  //     const buffer = await page.pdf({
  //       format: 'legal',
  //       margin: {
  //         top: '0.20in',
  //         left: '0.50in',
  //         bottom: '0.20in',
  //         right: '0.50in',
  //       },
  //       landscape: false,
  //       printBackground: true,
  //       // displayHeaderFooter: true,
  //       // footerTemplate:
  //       //   '<div style="border: 1px solid black; width:100%;z-index:1">  <div style=""><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=" style="width:30px;height:30px;"/></div><span style="margin-right: 1cm"><span class="pageNumber"></span> of <span class="totalPages"></span></span></div>',
  //     });
  //     // // console.log('Applicant generated');
  //     await browser.close();
  //     return buffer;
  //   } catch (e) {
  //     // console.log(e);
  //   }
  // }
 

  async getQRCode(id: string) {
    let d = await QRCode.toDataURL(id)
      .then((url) => {
        return url;
      })
      .catch((err) => {
        console.error(err);
      });
    let qrdata = {
      url: d,
    };

    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      const content = await this.compile('qrcode', qrdata);

      await page.setContent(content);

      const buffer = await page.pdf({
        format: 'letter',
        margin: {
          top: '0.25in',
          left: '0.25in',
          bottom: '0.25in',
          right: '0.25in',
        },
        landscape: false,
        printBackground: true,
      });
      // console.log('done');
      await browser.close();
      return buffer;
    } catch (e) {
      // console.log(e);
    }
  }
 
 

}
