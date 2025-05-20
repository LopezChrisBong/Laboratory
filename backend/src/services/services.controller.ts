import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { CreateServicePackagesDto } from './dto/create-service-packages.dto';
import { UpdateServicePackagesDto } from './dto/update-service-packages.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Post('AddPackages')
  AddPackages(@Body() createServicePackagesDto: CreateServicePackagesDto) {
    return this.servicesService.AddPackages(createServicePackagesDto);
  }

  @Post('addServiceCategory')
  addServiceCategory(@Body() createServiceCategoryDto: CreateServiceCategoryDto) {
    return this.servicesService.addServiceCategory(createServiceCategoryDto);
  }

  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

   @Get('getAllServices')
    getAllServices() {
    return this.servicesService.getAllServices();
  }
    @Get('getRemainingModules/:id')
  getRemainingModules(@Param('id') id: string) {
    return this.servicesService.getRemainingModules(+id);
  }

      @Get('getCategoryServiceType/:id')
  getCategoryServiceType(@Param('id') id: string) {
    return this.servicesService.getCategoryServiceType(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(+id);
  }

    @Get('getAllServicesByType/:type')
  getAllServicesByType(@Param('type') type: string) {
    return this.servicesService.getAllServicesByType(+type);
  }

      @Get('getAllServicesForBooking/:type')
  getAllServicesForBooking(@Param('type') type: string) {
    return this.servicesService.getAllServicesForBooking(+type);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(+id, updateServiceDto);
  }

    @Patch('updateServicePackagesDto/:id')
  updateServicePackages(@Param('id') id: string, @Body() updateServicePackagesDto: UpdateServicePackagesDto) {
    return this.servicesService.updateServicePackages(+id, updateServicePackagesDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(+id);
  }
}
