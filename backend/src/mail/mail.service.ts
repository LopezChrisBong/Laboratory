import { MailerService } from '@nestjs-modules/mailer';
import { HttpStatus, Injectable } from '@nestjs/common';
import { join } from 'path';
import { CreateMailDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';
import { hashPassword } from 'src/auth/utils/bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities';
import { Repository } from 'typeorm';

const hbs = require('handlebars');

hbs.registerHelper('isDefined', function (value) {
  return value != null || value != undefined ? true : false;
});

hbs.registerHelper('i1', function (otp) {
  return otp[0];
});

hbs.registerHelper('i2', function (otp) {
  return otp[1];
});

hbs.registerHelper('i3', function (otp) {
  return otp[2];
});

hbs.registerHelper('i4', function (otp) {
  return otp[3];
});

hbs.registerHelper('i5', function (otp) {
  return otp[4];
});

hbs.registerHelper('i6', function (otp) {
  return otp[5];
});

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    ) {}

   async sendMail(user:any) {

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>DNSC-HIS Email Confirmation</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
            }
            .header img {
              width: 400px;
            }
            h1 {
              color: #333333;
              font-size: 24px;
            }
            p {
              color: #555555;
              font-size: 16px;
              line-height: 1.5;
            }
            .btn {
              display: inline-block;
              background-color: #007bff;
              color: #ffffff;
              text-decoration: none;
              padding: 10px 20px;
              border-radius: 5px;
              margin-top: 20px;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #999999;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="https://imgur.com/CTpQ9ee" alt="Paragon Logo">
            </div>
            <h1>Welcome to PARAGON!</h1>
            <p>Hi ${user.email || 'User'},</p>
            <p>Your temporary password is: <strong>${user.tempPassword}</strong></p>
            <p>Please click the button below to login and change your password immediately:</p>
            <a href="http://localhost:8080/login" class="btn" >Login Now</a>
            <div class="footer">
              &copy; ${new Date().getFullYear()} PARAGON. All rights reserved.
            </div>
          </div>
        </body>
        </html>
        `;
        
    try {
      await this.mailerService.sendMail({
        to:user.email,
        subject: 'Welcome to PARAGON! Confirm your Email',
        text:'reset-password',
        html,
      });
         return {
              msg: 'Email send successful. Password successfully updated!',
              status: HttpStatus.OK,
            };
    } catch (error) {
      console.error('Error sending email:', error);
        return {
              msg: 'Email not sent!'+ error,
              status: HttpStatus.BAD_REQUEST,
            };
    }
   }

   async confirmVerifyuser(data){
     const html = `
      <!doctype html>
        <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <title>Email Verified</title>
          <style>
            :root{
              --blue:#1e73d1;
              --muted:#6b7280;
              --card-bg:#ffffff;
              --page-bg: linear-gradient(180deg, #f7fbff 0%, #ffffff 100%);
              --shadow: 0 8px 30px rgba(22, 42, 74, 0.08);
              --radius: 12px;
              --accent: #07a3ff;
              --success:#28a745;
            }

            html,body{
              height:100%;
              margin:0;
              font-family: Inter, "Segoe UI", Roboto, "Helvetica Neue", Arial;
              background: var(--page-bg);
              -webkit-font-smoothing:antialiased;
              -moz-osx-font-smoothing:grayscale;
              color:#0f1724;
            }

            .wrap{
              min-height:100vh;
              display:flex;
              align-items:center;
              justify-content:center;
              padding:32px;
              box-sizing:border-box;
            }

            .card{
              width:100%;
              max-width:700px;
              background:var(--card-bg);
              border-radius:var(--radius);
              box-shadow:var(--shadow);
              padding:44px 36px;
              text-align:center;
            }

            /* icon box */
            .icon {
              width:120px;
              height:120px;
              margin:0 auto 22px;
              display:flex;
              align-items:center;
              justify-content:center;
              border-radius:50%;
              background: linear-gradient(135deg, rgba(6,182,212,0.12), rgba(34,197,94,0.06));
              border: 1px solid rgba(6,182,212,0.06);
            }

            .title{
              font-size:32px;
              margin:0 0 8px;
              font-weight:700;
              color:#0b1220;
            }

            .subtitle{
              font-size:15px;
              color:var(--muted);
              margin:0 0 24px;
            }

            .cta{
              display:inline-block;
              background:var(--blue);
              color:white;
              padding:12px 20px;
              border-radius:8px;
              text-decoration:none;
              font-weight:600;
              box-shadow: 0 6px 18px rgba(30,115,209,0.18);
              transition:transform .12s ease, box-shadow .12s ease;
            }
            .cta:hover{ transform: translateY(-2px); box-shadow: 0 10px 24px rgba(30,115,209,0.22); }

            .secondary{
              display:inline-block;
              margin-left:14px;
              color:var(--muted);
              text-decoration:none;
              font-size:14px;
              padding:10px 12px;
              border-radius:8px;
            }

            /* Responsive tweaks */
            @media (max-width:520px){
              .card{ padding:28px 18px; }
              .icon{ width:92px; height:92px; margin-bottom:18px; }
              .title{ font-size:24px; }
            }
          </style>
        </head>
        <body>
          <div class="wrap">
            <div class="card" role="main" aria-labelledby="title">
              <div class="icon" aria-hidden="true">
                <!-- simple check/envelope svg -->
                <img style='width: 400px;' src="https://imgur.com/CTpQ9ee.png" alt="Paragon Logo">
              </div>

              <h1 id="title" class="title">Hooray!</h1>
              <p class="subtitle">Your email has been verified.</p>

              <div>
                <!-- <a href="#" class="cta" id="goBtn" data-href="/workspace">Take me to my workspace</a>-->
                <a href="http://localhost:8080/login" class="btn">Login Now</a>
              </div>
            </div>
          </div>
        </body>
        </html>

        `;
     console.log(data.email)
        try {
      await this.mailerService.sendMail({
        to:data.email,
        subject: 'Welcome to PARAGON! Verified Successfully.',
        text:'reset-password',
        html,
      });
         return {
              msg: 'Email send successful. Password successfully updated!',
              status: HttpStatus.OK,
            };
    } catch (error) {
      console.error('Error sending email:', error);
        return {
              msg: 'Email not sent!'+ error,
              status: HttpStatus.BAD_REQUEST,
            };
    }
   }


  async sendUserConfirmation(user: any) {
    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: user.subject,
      template: 'confirmation1', // `.hbs` extension is appended automatically
      // attachments: [{
      //   filename: "invoice.pdf",
      //   path: "saved_invoices/" + user.pdfToAttach,
      //   contentType: 'application/pdf'
      // }],
      context: {
        invoice_no: user.invoice_no,
        PO: user.PO,
        note: user.note,
      },
    });
  }

  async sendOTP(user: any) {
    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to DNSC-HIS! Confirm your Email',
      template: 'otp1', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        OTP: user.OTP,
      },
      attachments: [
        {
          filename: 'headerImg',
          path: join(process.cwd(), '/../static/img/HIS_LOGO3.png'),
          cid: 'headerImg',
        },
      ],
    });
  }

  async sendTempPassword(user: any) {
    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to DNSC-HIS! Temporary Password',
      template: 'reset-password', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        new_password: user.new_password,
      },
      attachments: [
        {
          filename: 'headerImg',
          path: join(process.cwd(), '/../static/img/HIS_LOGO3.png'),
          cid: 'headerImg',
        },
      ],
    });
  }

  async sendConfirmation(user: any) {
    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to DNSC-HIS!',
      template: 'confirmation', // `.hbs` extension is appended automatically
      attachments: [
        {
          filename: 'headerImg',
          path: join(process.cwd(), '/../static/img/HIS_LOGO3.png'),
          cid: 'headerImg',
        },
      ],
    });
  }
}
