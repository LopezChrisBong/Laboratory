import { HttpStatus, Inject, Injectable } from '@nestjs/common';
// import { CreatePdfGeneratorDto } from './dto/create-pdf-generator.dto';
// import { UpdatePdfGeneratorDto } from './dto/update-pdf-generator.dto';
// import * as PDFDocument from 'pdfkit'
// import { PDFOptions, PDFService } from '@t00nday/nestjs-pdf';

import { DataSource } from 'typeorm';

import { SendNewEmailDto } from './dto/send-new-email.dto';
import {
  Invoice,
  MedicalCertificate,
  MedicalInfo,
  Patient,
  Payment,
  Prescription,
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
  if (!value) return '';

  const date = new Date(value);
  if (isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en-PH', {
    dateStyle: 'medium',
  }).format(date);
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

hbs.registerHelper('stripTags', function (text) {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, ''); // removes anything between < and >
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

  async prescription(id: number) {
    let prescription = await this.dataSource.manager
      .createQueryBuilder(Prescription, 'p')
      .select(['p.*',
              `IF (
                    !ISNULL(ud.mname) AND LOWER(ud.mname) != 'n/a',
                    CONCAT(ud.fname, ' ', SUBSTRING(ud.mname, 1, 1), '. ', ud.lname),
                    CONCAT(ud.fname, ' ', ud.lname)
                ) AS doctor_name`,
          ])
      .leftJoin(UserDetail, 'ud', 'ud.id = p.doctorID')
      .where('p.id = :id', { id })
      .getRawOne();
      console.log(prescription)

    const now = new Date();
    const formatted = new Intl.DateTimeFormat('en-PH', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(now);
    const data = [
      {
        prescription: prescription,
        formatted,
      },
    ];
    try {
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox'],
      });
      const page = await browser.newPage();
      // compile(template_name, data)
      const content = await this.compile('prescription', data);
      await page.setContent(content);

      const buffer = await page.pdf({
        format: 'letter',
        margin: {
          top: '0.20in',
          left: '0.50in',
          bottom: '0.20in',
          right: '0.50in',
        },
        landscape: false,
        printBackground: true,
      });
      await browser.close();
      return buffer;
    } catch (e) {
      console.log(e);
    }
  }

  async invoice(id: number) {
    let items = await this.findInvoicePayments(id);
    const invoiceData = await this.dataSource.manager
      .createQueryBuilder(Invoice, 'inv')
      .select([
        `IF (
          !ISNULL(p.m_name) AND LOWER(p.m_name) != 'n/a',
          CONCAT(p.f_name, ' ', SUBSTRING(p.m_name, 1, 1), '. ', p.l_name),
          CONCAT(p.f_name, ' ', p.l_name)
      ) AS name`,
        'inv.*',
      ])
      .leftJoin(Patient, 'p', 'inv.patientId = p.id')
      .where('inv.id = :id', { id })
      .getRawOne();

    const now = new Date();
    const formatted = new Intl.DateTimeFormat('en-PH', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(now);

    const headerImgPath = join(process.cwd(), '/../static/img/Paragon Logo.png');
    // const headerImgPath = join(process.cwd(), '/static/img/Paragon Logo.png');
    const headerImg = this.base64_encode(headerImgPath, 'headerfooter');

    const data = {
      invoice: invoiceData,
      headerImg: headerImg,
      items,
      formatted,
    };

    try {
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox'],
      });

      const page = await browser.newPage();

      const content = await this.compile('invoice', data);
      await page.setContent(content);

      const buffer = await page.pdf({
        format: 'letter',
        margin: {
          top: '0.20in',
          left: '0.50in',
          bottom: '0.20in',
          right: '0.50in',
        },
        landscape: false,
        printBackground: true,
      });

      await browser.close();
      return buffer;
    } catch (e) {
      console.log(e);
    }
  }

  async findInvoicePayments(invoiceId: number) {
    const invoice = await this.dataSource.manager.findOne(Invoice, {
      where: { id: invoiceId },
    });

    if (!invoice) return [];
    let payedIds = [];
    try {
      payedIds = JSON.parse(invoice.payedId || '[]');
    } catch (e) {
      return [];
    }

    if (!Array.isArray(payedIds) || !payedIds.length) {
      return [];
    }
    const payments = await this.dataSource.manager
      .createQueryBuilder(Payment, 'pay')
      .select([
        'pay.*',
        `IF (
        !ISNULL(p.m_name) AND LOWER(p.m_name) != 'n/a',
        CONCAT(p.f_name, ' ', SUBSTRING(p.m_name, 1, 1), '. ', p.l_name),
        CONCAT(p.f_name, ' ', p.l_name)
      ) AS name`,
      ])
      .leftJoin(Patient, 'p', 'pay.patientId = p.id')
      .where('pay.id IN (:...ids)', { ids: payedIds })
      .getRawMany();

    let allLabData: any[] = [];
    let totalAmount = 0;

    payments.forEach((pay: any) => {
      let services: any[] = [];

      try {
        let parsed = pay.data ? JSON.parse(pay.data) : null;

        if (parsed && parsed.labData && parsed.labData.length > 0) {
          services = parsed.labData.map((item) => ({
            service_description: item.service_description,
            service_price: item.service_price || 0,
          }));
        } else {
          services = [
            {
              service_description: 'General Consultation',
              service_price: pay.amount || 0,
            },
          ];
        }
      } catch (err) {
        console.error(`Invalid JSON in payment ${pay.id}:`, err);

        services = [
          {
            service_description: 'General Consultation',
            service_price: pay.amount || 0,
          },
        ];
      }

      allLabData.push(...services);

      totalAmount += services.reduce(
        (sum, s) => sum + (s.service_price || 0),
        0,
      );
    });

    const result = [
      {
        patientId: payments[0].patientId,
        name: payments[0].name,
        labData: allLabData,
        total_amount: totalAmount,
      },
    ];

    return result[0];
  }

  async patientMedicalRecord(id: number) {
    console.log(id);
    const patientData = await this.dataSource.manager
      .createQueryBuilder(MedicalInfo, 'mid')
      .select([
        `IF (
          !ISNULL(p.m_name) AND LOWER(p.m_name) != 'n/a',
          CONCAT(p.f_name, ' ', SUBSTRING(p.m_name, 1, 1), '. ', p.l_name),
          CONCAT(p.f_name, ' ', p.l_name)
      ) AS name`,
             `IF (
          !ISNULL(ud.mname) AND LOWER(ud.mname) != 'n/a',
          CONCAT(ud.fname, ' ', SUBSTRING(ud.mname, 1, 1), '. ', ud.lname),
          CONCAT(ud.fname, ' ', ud.lname)
      ) AS doctor_name`,
        'mid.*',
        'p.b_date as b_date',
        'p.gender as sex',
        'p.address as address',
        'p.civil_status as civil_status',
        'p.contact_no as contact_no',
        'p.occupation as occupation',
      ])
      .leftJoin(Patient, 'p', 'mid.patientId = p.id')
      .leftJoin(UserDetail, 'ud', 'mid.doctorID = ud.id')
      .where('mid.id = :id', { id })
      .getRawOne();
      console.log(patientData)

    const now = new Date();
    const formatted = new Intl.DateTimeFormat('en-PH', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(now);

    const headerImgPath = join(
      process.cwd(),
      '/../static/img/Paragon Logo.png',
    );
    // const headerImgPath = join(process.cwd(), '/static/img/Paragon Logo.png');
    const headerImg = this.base64_encode(headerImgPath, 'headerfooter');

    const data = {
      patientData: patientData,
      headerImg: headerImg,
      formatted,
    };

    try {
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox'],
      });

      const page = await browser.newPage();

      const content = await this.compile('medical-info', data);
      await page.setContent(content);

      const buffer = await page.pdf({
        format: 'letter',
        margin: {
          top: '0.20in',
          left: '0.50in',
          bottom: '0.20in',
          right: '0.50in',
        },
        landscape: false,
        printBackground: true,
      });

      await browser.close();
      return buffer;
    } catch (e) {
      console.log(e);
    }
  }

  async patientNormalMedication(id: number) {
      const patientData = await this.dataSource.manager
      .createQueryBuilder(Patient, 'p')
      .select(['p.*',
              `IF (
                    !ISNULL(p.m_name) AND LOWER(p.m_name) != 'n/a',
                    CONCAT(p.f_name, ' ', SUBSTRING(p.m_name, 1, 1), '. ', p.l_name),
                    CONCAT(p.f_name, ' ', p.l_name)
                ) AS name`,
          ])
      .where('p.id = :id', { id })
      .getRawOne()
    
    const medicalData = await this.dataSource.manager
      .createQueryBuilder(MedicalInfo, 'mid')
      .select([
        `IF (
          !ISNULL(p.m_name) AND LOWER(p.m_name) != 'n/a',
          CONCAT(p.f_name, ' ', SUBSTRING(p.m_name, 1, 1), '. ', p.l_name),
          CONCAT(p.f_name, ' ', p.l_name)
      ) AS name`,
             `IF (
          !ISNULL(ud.mname) AND LOWER(ud.mname) != 'n/a',
          CONCAT(ud.fname, ' ', SUBSTRING(ud.mname, 1, 1), '. ', ud.lname),
          CONCAT(ud.fname, ' ', ud.lname)
      ) AS doctor_name`,
        'mid.*',
        'p.b_date as b_date',
        'p.gender as sex',
        'p.address as address',
        'p.civil_status as civil_status',
        'p.contact_no as contact_no',
        'p.occupation as occupation',
      ])
      .leftJoin(Patient, 'p', 'mid.patientId = p.id')
      .leftJoin(UserDetail, 'ud', 'mid.doctorID = ud.id')
      .where('mid.patientID = :id', { id })
      .andWhere('mid.pregnant = 0')
      .getRawMany();
      console.log(medicalData)
   

    const now = new Date();
    const formatted = new Intl.DateTimeFormat('en-PH', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(now);

    const headerImgPath = join(
      process.cwd(),
      '/../static/img/Paragon Logo.png',
    );
    // const headerImgPath = join(process.cwd(), '/static/img/paragon logo website.png');
    const headerImg = this.base64_encode(headerImgPath, 'headerfooter');
    // let headerImg = join(process.cwd(), '/static/img/Paragon Logo.png');

    const data = [{
      patientData: patientData,
      headerImg: headerImg,
      medicalData:medicalData,
      formatted
    }];

    try {
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox'],
      });

      const page = await browser.newPage();

      const content = await this.compile('normal-patient-medication', data);
      await page.setContent(content);

      const buffer = await page.pdf({
        format: 'letter',
        margin: {
          top: '0.20in',
          left: '0.50in',
          bottom: '0.20in',
          right: '0.50in',
        },
        landscape: false,
        printBackground: true,
      });

      await browser.close();
      return buffer;
    } catch (e) {
      console.log(e);
    }
  }

  async patientPregnantMedication(id: number) {
      const patientData = await this.dataSource.manager
      .createQueryBuilder(Patient, 'p')
      .select(['p.*',
              `IF (
                    !ISNULL(p.m_name) AND LOWER(p.m_name) != 'n/a',
                    CONCAT(p.f_name, ' ', SUBSTRING(p.m_name, 1, 1), '. ', p.l_name),
                    CONCAT(p.f_name, ' ', p.l_name)
                ) AS name`,
          ])
      .where('p.id = :id', { id })
      .getRawOne()
    
    const medicalData = await this.dataSource.manager
      .createQueryBuilder(MedicalInfo, 'mid')
      .select([
        `IF (
          !ISNULL(p.m_name) AND LOWER(p.m_name) != 'n/a',
          CONCAT(p.f_name, ' ', SUBSTRING(p.m_name, 1, 1), '. ', p.l_name),
          CONCAT(p.f_name, ' ', p.l_name)
      ) AS name`,
             `IF (
          !ISNULL(ud.mname) AND LOWER(ud.mname) != 'n/a',
          CONCAT(ud.fname, ' ', SUBSTRING(ud.mname, 1, 1), '. ', ud.lname),
          CONCAT(ud.fname, ' ', ud.lname)
      ) AS doctor_name`,
        'mid.*',
        'p.b_date as b_date',
        'p.gender as sex',
        'p.address as address',
        'p.civil_status as civil_status',
        'p.contact_no as contact_no',
        'p.occupation as occupation',
      ])
      .leftJoin(Patient, 'p', 'mid.patientId = p.id')
      .leftJoin(UserDetail, 'ud', 'mid.doctorID = ud.id')
      .where('mid.patientID = :id', { id })
      .andWhere('mid.pregnant = 1')
      .orderBy('mid.created_at', 'DESC')
      .getRawMany();

      // console.log(medicalData[0].created_at)
      // console.log(patientData.b_date)

      let newAge = this.calculateAge(patientData.b_date, medicalData[0].created_at)
      
      console.log(newAge)

    const now = new Date();
    const formatted = new Intl.DateTimeFormat('en-PH', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(now);

    const headerImgPath = join(
      process.cwd(),
      '/../static/img/Paragon Logo.png',
    );
    // const headerImgPath = join(process.cwd(), '/static/img/paragon logo website.png');
    const headerImg = this.base64_encode(headerImgPath, 'headerfooter');
    // let headerImg = join(process.cwd(), '/static/img/Paragon Logo.png');

    const data = [{
      patientData: patientData,
      headerImg: headerImg,
      medicalData:medicalData,
      medicalDataInfo:medicalData[0],
      formatted,
      newAge
    }];

    try {
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox'],
      });

      const page = await browser.newPage();

      const content = await this.compile('pregnant-patient-medication', data);
      await page.setContent(content);

      const buffer = await page.pdf({
        format: 'letter',
        margin: {
          top: '0.20in',
          left: '0.50in',
          bottom: '0.20in',
          right: '0.50in',
        },
        landscape: false,
        printBackground: true,
      });

      await browser.close();
      return buffer;
    } catch (e) {
      console.log(e);
    }
  }

  calculateAge(birthDate, referenceDate) {
  const b = new Date(birthDate);
  const r = new Date(referenceDate);

  let age = r.getFullYear() - b.getFullYear();
  const m = r.getMonth() - b.getMonth();

  if (m < 0 || (m === 0 && r.getDate() < b.getDate())) {
    age--;
  }

  return age;
  }

   getDateCondition(filter: string) {
      const now = new Date();

      let start: Date | null = null;
      let end: Date = now;

      switch (filter) {
        case 'Weekly':
          start = new Date();
          start.setDate(now.getDate() - 7);
          break;

        case 'Monthly':
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          break;

        case 'Yearly':
          start = new Date(now.getFullYear(), 0, 1);
          break;

        default:
          return null;
      }

      return { start, end };
    }


  async getInvoiceFiltered(filter:string) {
    console.log(filter)
  const dateFilter = this.getDateCondition(filter);

    const query = this.dataSource.manager
      .createQueryBuilder(Invoice, 'inv')
      .select([
        `IF (
          !ISNULL(p.m_name) AND LOWER(p.m_name) != 'n/a',
          CONCAT(p.f_name, ' ', SUBSTRING(p.m_name, 1, 1), '. ', p.l_name),
          CONCAT(p.f_name, ' ', p.l_name)
        ) AS name`,
        'inv.*',
      ])
      .leftJoin(Patient, 'p', 'inv.patientId = p.id')
      .orderBy('inv.created_at', 'DESC');

    if (dateFilter) {
      query.andWhere(
        'inv.created_at BETWEEN :start AND :end',
        {
          start: dateFilter.start,
          end: dateFilter.end
        }
      );
    }

    const paidData = await query.getRawMany();

    // console.log(data);
    for (let i = 0; i < paidData.length; i++) {
      let paymentIDs = JSON.parse(paidData[i].payedId);

      let services_arr = [];
      let services = await this.dataSource.manager
        .createQueryBuilder(Payment, 'p')
        .where('p.id IN (:ids)', { ids: paymentIDs })
        .getMany();

      // console.log(services);
      for (let j = 0; j < services.length; j++) {
        if (!services[j].data) {
          if (!services_arr.includes('General Consultation')) {
            services_arr.push('General Consultation');
          }
        } else {
          let conv = JSON.parse(services[j].data);
          let labData = conv.labData;
          let str = 'Laboratory: ';

          for (let k = 0; k < labData.length; k++) {
            str += labData[k].service_description;
            if (k <= labData.length - 2) {
              str += ', ';
            }
          }
          services_arr.push(str);
          str = '';
        }
      }
      Object.assign(paidData[i], { services_availed: services_arr });
    }
    
    const now = new Date();
    const formatted = new Intl.DateTimeFormat('en-PH', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(now);

    // console.log(paidData)

    const headerImgPath = join(
      process.cwd(),
      '/../static/img/Paragon Logo.png',
    );
    // const headerImgPath = join(process.cwd(), '/static/img/paragon logo website.png');
    const headerImg = this.base64_encode(headerImgPath, 'headerfooter');
    // let headerImg = join(process.cwd(), '/static/img/Paragon Logo.png');

    const data = [{
      headerImg: headerImg,
      paidData,
      formatted,
      filter
 
    }];

    try {
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox'],
      });

      const page = await browser.newPage();

      const content = await this.compile('filtered-invoice', data);
      await page.setContent(content);

      const buffer = await page.pdf({
        format: 'letter',
        margin: {
          top: '0.20in',
          left: '0.50in',
          bottom: '0.20in',
          right: '0.50in',
        },
        landscape: false,
        printBackground: true,
      });

      await browser.close();
      return buffer;
    } catch (e) {
      console.log(e);
    }
  }

  async medicalCertificate(id: number) {
    let medicalCert = await this.dataSource.manager
      .createQueryBuilder(MedicalCertificate, 'mc')
      .select(['mc.*',
              `IF (
                    !ISNULL(pt.m_name) AND LOWER(pt.m_name) != 'n/a',
                    CONCAT(pt.f_name, ' ', SUBSTRING(pt.m_name, 1, 1), '. ', pt.l_name),
                    CONCAT(pt.f_name, ' ', pt.l_name)
                ) AS name`,
              `IF (
                    !ISNULL(ud.mname) AND LOWER(ud.mname) != 'n/a',
                    CONCAT(ud.fname, ' ', SUBSTRING(ud.mname, 1, 1), '. ', ud.lname),
                    CONCAT(ud.fname, ' ', ud.lname)
                ) AS doctor_name`,
                'pt.address as address'
          ])
      .leftJoin(UserDetail, 'ud', 'ud.id = mc.doctorID')
      .leftJoin(Patient, 'pt', 'pt.id = mc.patientID')
      .where('mc.id = :id', { id })
      .getRawOne();
      console.log(medicalCert)

    const now = new Date();
    const formatted = new Intl.DateTimeFormat('en-PH', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(now);
      const headerImgPath = join(
      process.cwd(),
      '/../static/img/Paragon Logo.png',
    );
    // const headerImgPath = join(process.cwd(), '/static/img/paragon logo website.png');
    const headerImg = this.base64_encode(headerImgPath, 'headerfooter');
    // let headerImg = join(process.cwd(), '/static/img/Paragon Logo.png');

    const data = [{
        medicalCert: medicalCert,
        headerImg,
        formatted
      }];
    try {
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox'],
      });
      const page = await browser.newPage();
      // compile(template_name, data)
      const content = await this.compile('medical-certificate', data);
      await page.setContent(content);

      const buffer = await page.pdf({
        format: 'A4',
        margin: {
          top: '0.20in',
          left: '0.50in',
          bottom: '0.20in',
          right: '0.50in',
        },
        landscape: false,
        printBackground: true,
      });
      await browser.close();
      return buffer;
    } catch (e) {
      console.log(e);
    }
  }

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
