import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  StreamableFile,
  Response,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PdfGeneratorService } from './pdf-generator.service';
import { CreatePdfGeneratorDto } from './dto/create-pdf-generator.dto';
import { UpdatePdfGeneratorDto } from './dto/update-pdf-generator.dto';
import { SendNewEmailDto } from './dto/send-new-email.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { createReadStream } from 'fs';
import { join } from 'path';
import { JWTAuthGuard } from 'src/auth/utils/jwt-auth-guard';

@ApiTags('PDF generator')
@Controller('pdf-generator')
export class PdfGeneratorController {
  constructor(private readonly pdfGeneratorService: PdfGeneratorService) {}

 @Get('prescription/:id')
  async prescription(@Res() res, @Param('id') id: string): Promise<void> {
    const buffer = await this.pdfGeneratorService.prescription(+id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=example.pdf',
      'Content-Length': buffer.length,

      // prevent cache
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: 0,
    });

    res.end(buffer);

    // // console.log(n)
  }

   @Get('invoice/:id/:name')
  async invoice(@Res() res, @Param('id') id: string, @Param('name') name: string): Promise<void> {
    const buffer = await this.pdfGeneratorService.invoice(+id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=example.pdf',
      'Content-Length': buffer.length,

      // prevent cache
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: 0,
    });

    res.end(buffer);

    // // console.log(n)
  }


   @Get('patientMedicalRecord/:id')
      async patientMedicalRecord(@Res() res, @Param('id') id: string): Promise<void> {
        const buffer = await this.pdfGeneratorService.patientMedicalRecord(+id);

        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename=example.pdf',
          'Content-Length': buffer.length,

          // prevent cache
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: 0,
        });

        res.end(buffer);

        // // console.log(n)
    }

    @Get('patientNormalMedication/:id')
        async patientNormalMedication(@Res() res, @Param('id') id: string): Promise<void> {
        const buffer = await this.pdfGeneratorService.patientNormalMedication(+id);

        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename=example.pdf',
          'Content-Length': buffer.length,

          // prevent cache
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: 0,
        });

        res.end(buffer);

        // // console.log(n)
    }

    @Get('patientPregnantMedication/:id')
        async patientPregnantMedication(@Res() res, @Param('id') id: string): Promise<void> {
        const buffer = await this.pdfGeneratorService.patientPregnantMedication(+id);

        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename=example.pdf',
          'Content-Length': buffer.length,

          // prevent cache
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: 0,
        });

        res.end(buffer);

        // // console.log(n)
    }

    @Get('getInvoiceFiltered/:filter')
        async getInvoiceFiltered(@Res() res, @Param('filter') filter: string): Promise<void> {
        const buffer = await this.pdfGeneratorService.getInvoiceFiltered(filter,);

        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename=example.pdf',
          'Content-Length': buffer.length,

          // prevent cache
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: 0,
        });

        res.end(buffer);

        // // console.log(n)
    }

    @Get('medicalCertificate/:id')
        async medicalCertificate(@Res() res, @Param('id') id: string): Promise<void> {
        const buffer = await this.pdfGeneratorService.medicalCertificate(+id);

        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename=example.pdf',
          'Content-Length': buffer.length,

          // prevent cache
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: 0,
        });

        res.end(buffer);

        // // console.log(n)
    }



    
  @Get('getQRCode/:id')
  async getQRCode(@Res() res, @Param('id') id: string): Promise<void> {
    const buffer = await this.pdfGeneratorService.getQRCode(id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=example.pdf',
      'Content-Length': buffer.length,

      // prevent cache
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: 0,
    });

    res.end(buffer);

    // // console.log(n)
  }

}
