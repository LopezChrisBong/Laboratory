import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { DataSource, Repository } from 'typeorm';
import { Invoice, Patient, Payment, ServiceAppointment } from 'src/entities';
@Injectable()
export class PaymentService {
  constructor(private dataSource: DataSource,){}
  async create(createPaymentDto: CreatePaymentDto) {
    let patientID = createPaymentDto.patientId
   
    if(createPaymentDto.data){
    const parsedData = JSON.parse(createPaymentDto.data);
    const labData = parsedData.labData || [];
    const totalPrice = labData.reduce((sum, item) => sum + (item.service_price || 0), 0).toFixed(2);
        const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
                const data = queryRunner.manager.create(Payment, {
                  patientId:patientID,
                  data:createPaymentDto.data,
                  amount:totalPrice
                });
        
                await queryRunner.manager.save(data);
              
              await queryRunner.commitTransaction();
              return {
                msg: 'Saved successfully!',
                status: HttpStatus.OK,
              };
            } catch (error) {
              await queryRunner.rollbackTransaction();
              return {
                msg: 'Saving failed!' + error,
                status: HttpStatus.BAD_REQUEST,
              };
            } finally {
              await queryRunner.release();
            }
    }else{
      console.log(createPaymentDto)
      const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
                const data = queryRunner.manager.create(Payment, {
                  patientId:patientID,
                  amount:createPaymentDto.amount,
                });
        
                await queryRunner.manager.save(data);
              
              await queryRunner.commitTransaction();
              return {
                msg: 'Saved successfully!',
                status: HttpStatus.OK,
              };
            } catch (error) {
              await queryRunner.rollbackTransaction();
              return {
                msg: 'Saving failed!' + error,
                status: HttpStatus.BAD_REQUEST,
              };
            } finally {
              await queryRunner.release();
            }
    }

  }

  async invoice(createPaymentDto: CreatePaymentDto) {
     const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
                const data = queryRunner.manager.create(Invoice, {
                  amount:createPaymentDto.amount,
                  patientId:createPaymentDto.patientId,
                  total_amount:createPaymentDto.total_amount,
                  invoice_no:createPaymentDto.invoice_no,
                  discount_amount:createPaymentDto.discount_amount,
                  discount_type:createPaymentDto.discount_type,
                  payedId:createPaymentDto.payedId
                });
        
                let saveData = await queryRunner.manager.save(data);
              
              await queryRunner.commitTransaction();
              return {
                msg: 'Saved successfully!',
                status: HttpStatus.OK,
                saveData
              };
            } catch (error) {
              await queryRunner.rollbackTransaction();
              return {
                msg: 'Saving failed!' + error,
                status: HttpStatus.BAD_REQUEST,
              };
            } finally {
              await queryRunner.release();
            }
  }

  async findAllPendingPayment() {
  const data = await this.dataSource.manager
    .createQueryBuilder(Payment, 'pay')
    .select([
      "IF (!ISNULL(p.m_name) AND LOWER(p.m_name) != 'n/a', CONCAT(p.f_name, ' ', SUBSTRING(p.m_name, 1, 1), '. ', p.l_name), CONCAT(p.f_name, ' ', p.l_name)) AS name",
      'p.id AS patientId',
      'SUM(pay.amount) AS total_amount',
      'COUNT(pay.id) AS total_payments',
    ])
    .leftJoin(Patient, 'p', 'pay.patientId = p.id')
    .where('pay.status = 0')
    .groupBy('pay.patientId')
    .getRawMany();

  return data;
  }

  async fullyPaid() {
      const data = await this.dataSource.manager
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
        .getRawMany();

      // console.log(data);
      return data;
  }


  async findOnePatientPayment(id: number) {
  const payments = await this.dataSource.manager
    .createQueryBuilder(Payment, 'pay')
    .select([
      'pay.*',
      "IF (!ISNULL(p.m_name) AND LOWER(p.m_name) != 'n/a', CONCAT(p.f_name, ' ', SUBSTRING(p.m_name, 1, 1), '. ', p.l_name), CONCAT(p.f_name, ' ', p.l_name)) AS name",
    ])
    .leftJoin(Patient, 'p', 'pay.patientId = p.id')
    .where('pay.status = 0')
    .andWhere('pay.patientId = :id', { id })
    .getRawMany();

  if (!payments.length) return [];

  const paymentIds = payments.map((pay) => pay.id);

  let invoiceNo = payments[0].invoice_no;
  if (!invoiceNo) {
    invoiceNo = this.generateInvoiceNumber(payments[0].id);
  }

  let allLabData: any[] = [];
  let totalAmount = 0;

  payments.forEach((pay: any) => {
    try {
      if (pay.data) {
        const parsed = JSON.parse(pay.data);
        const labData = parsed?.labData || [];
        allLabData = [...allLabData, ...labData];
        totalAmount += labData.reduce(
          (sum, item) => sum + (item.service_price || 0),
          0
        );
      } else {
        allLabData.push({
          service_description: 'General Consultation',
          service_price: pay.amount || 0,
        });
        totalAmount += pay.amount || 0;
      }
    } catch (err) {
      console.error(`Invalid JSON in payment ${pay.id}:`, err);
      allLabData.push({
        service_description: 'General Consultation',
        service_price: pay.amount || 0,
      });
      totalAmount += pay.amount || 0;
    }
  });

  const result = [
    {
      invoice_no: invoiceNo,
      patientId: payments[0].patientId,
      name: payments[0].name,
      paymentIds, 
      labData: allLabData,
      total_amount: totalAmount,
    },
  ];

  // console.log(result[0]);
  return result;
  }


private generateInvoiceNumber(id: number): string {
  const now = new Date();
  const datePart = `${now.getFullYear()}${(now.getMonth() + 1)
    .toString()
    .padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
  return `INV-${datePart}-${id.toString().padStart(6, '0')}`;
}

async getIncomeInvoice() {
  const result = await this.dataSource.manager
    .createQueryBuilder()
    .from('payment', 'pay') 
    .select(`
      (
      -- SELECT COALESCE(AVG(p.amount), 0)
        SELECT COALESCE(SUM(p.amount), 0)
        FROM payment p
        WHERE p.status = 1
          AND DATE(p.created_at) = CURDATE()
      ) AS daily_average_income
    `)
    .addSelect(`
      (
        SELECT COALESCE(SUM(p.amount), 0)
        FROM payment p
        WHERE p.status = 1
          AND MONTH(p.created_at) = MONTH(CURDATE())
          AND YEAR(p.created_at) = YEAR(CURDATE())
      ) AS total_month_income
    `)
    .addSelect(`
      (
        SELECT COALESCE(SUM(p.amount), 0)
        FROM payment p
        WHERE p.status = 1
          AND YEAR(p.created_at) = YEAR(CURDATE())
      ) AS total_year_income
    `)
    .getRawOne();
  return result;
}
async getAnalyticsIncome(){
const dailyData = await this.dataSource.manager
  .createQueryBuilder(Payment, 'pay')
  .select('DAY(pay.created_at)', 'day')
  .addSelect('SUM(pay.amount)', 'amount')
  .where('pay.status = 1')
  .groupBy('day')
  .orderBy('day', 'ASC')
  .getRawMany();

const monthlyData = await this.dataSource.manager
  .createQueryBuilder(Payment, 'pay')
  .select('MONTH(pay.created_at) - 1', 'month') 
  .addSelect('SUM(pay.amount)', 'amount')
  .where('pay.status = 1')
  .groupBy('month')
  .orderBy('month', 'ASC')
  .getRawMany();

const yearlyRaw = await this.dataSource.manager
  .createQueryBuilder(Payment, 'pay')
  .select('YEAR(pay.created_at)', 'year')
  .addSelect('SUM(pay.amount)', 'amount')
  .where('pay.status = 1')
  .groupBy('year')
  .orderBy('year', 'ASC')
  .getRawMany();

// ✅ Normalize raw DB output to expected format
const yearlyData = yearlyRaw.map(r => ({
  year: Number(r.year ?? r.YEAR),
  amount: Number(r.amount ?? r.AMOUNT),
}));

  console.log(yearlyData)

  return { dailyData, monthlyData, yearlyData };

}


  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

async update(id: number, updatePaymentDto: UpdatePaymentDto) {
  try {
    console.log(id, updatePaymentDto);

    const payment = await this.dataSource.manager.findOne(Payment, {
      where: { id }
    });

    if (!payment) {
      return { msg: "Payment not found", status: HttpStatus.NOT_FOUND };
    }
    await this.dataSource.manager.update(Payment, id, {
      status: updatePaymentDto.status,
    });
    if (payment.data) {
      try {
        const parsed = JSON.parse(payment.data);
        const serviceAppointmentId = parsed.id; 

        if (serviceAppointmentId) {
          await this.dataSource.manager.update(
            ServiceAppointment,
            serviceAppointmentId,
            { status:1} 
          );
        }
      } catch (err) {
        console.error("Failed to parse payment.data:", err);
      }
    }

    return {
      msg: "Updated successfully!",
      status: HttpStatus.OK,
    };

  } catch (error) {
    return {
      msg: "Something went wrong! " + error,
      status: HttpStatus.BAD_REQUEST,
    };
  }
}


  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
