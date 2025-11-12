import { HttpStatus, Inject, Injectable } from '@nestjs/common';
// import { CreatePdfGeneratorDto } from './dto/create-pdf-generator.dto';
// import { UpdatePdfGeneratorDto } from './dto/update-pdf-generator.dto';
// import * as PDFDocument from 'pdfkit'
// import { PDFOptions, PDFService } from '@t00nday/nestjs-pdf';

import { DataSource } from 'typeorm';

import { SendNewEmailDto } from './dto/send-new-email.dto';
import {
  Invoice,
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
  if (!value) return "";
  return moment(value).isValid() 
    ? moment(value).format('MM-DD-YYYY') 
    : "";
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



  async prescription(id: number,) {
      let prescription = await this.dataSource.manager
      .createQueryBuilder(Prescription, 'p')
      .where('p.id = :id', { id })
      .getOne();

      console.log(prescription)
    const data = [
      {
        prescription:prescription
      },
    ];
    try {
      const browser = await puppeteer.launch({ 
        headless: 'new',
        args: ['--no-sandbox']
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
  let items= await this.findInvoicePayments(id)
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
    
    console.log(invoiceData)

  const headerImgPath = join(process.cwd(), '/../static/img/Paragon Logo.png');
  const headerImg = this.base64_encode(headerImgPath, 'headerfooter');

  const data = {
    invoice: invoiceData,
    headerImg: headerImg,
    items
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
    where: { id: invoiceId }
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
    .createQueryBuilder(Payment, "pay")
    .select([
      "pay.*",
      `IF (
        !ISNULL(p.m_name) AND LOWER(p.m_name) != 'n/a',
        CONCAT(p.f_name, ' ', SUBSTRING(p.m_name, 1, 1), '. ', p.l_name),
        CONCAT(p.f_name, ' ', p.l_name)
      ) AS name`
    ])
    .leftJoin(Patient, "p", "pay.patientId = p.id")
    .where("pay.id IN (:...ids)", { ids: payedIds })
    .getRawMany();

    let allLabData: any[] = [];
let totalAmount = 0;

payments.forEach((pay: any) => {
  let services: any[] = [];

  try {
    let parsed = pay.data ? JSON.parse(pay.data) : null;

    if (parsed && parsed.labData && parsed.labData.length > 0) {
      services = parsed.labData.map(item => ({
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
    0
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
  console.log(id)
  const patientData = await this.dataSource.manager
    .createQueryBuilder(MedicalInfo, 'mid')
    .select([
      `IF (
          !ISNULL(p.m_name) AND LOWER(p.m_name) != 'n/a',
          CONCAT(p.f_name, ' ', SUBSTRING(p.m_name, 1, 1), '. ', p.l_name),
          CONCAT(p.f_name, ' ', p.l_name)
      ) AS name`,
      'mid.*',
    ])
    .leftJoin(Patient, 'p', 'mid.patientId = p.id')
    .where('mid.id = :id', { id })  
    .getRawOne();     
    
    console.log(patientData)

  const headerImgPath = join(process.cwd(), '/../static/img/Paragon Logo.png');
  // const headerImgPath = join(process.cwd(), '/static/img/Paragon Logo.png');
  const headerImg = this.base64_encode(headerImgPath, 'headerfooter');

  const data = {
    patientData: patientData,
    headerImg: headerImg,
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
