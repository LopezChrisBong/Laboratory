import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { UpdateServicePackagesDto } from './dto/update-service-packages.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service, ServiceCategory, ServicePackages } from 'src/entities';
import { DataSource, Repository } from 'typeorm';
import { CreateServicePackagesDto } from './dto/create-service-packages.dto';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';

@Injectable()
export class ServicesService {
    constructor(
      @InjectRepository(Service) private readonly servicesRepository: Repository<Service>,
      @InjectRepository(ServicePackages) private readonly servicesPackagesRepository: Repository<ServicePackages>,
      @InjectRepository(ServiceCategory) private readonly servicesCategoryRepository: Repository<ServiceCategory>,
    private dataSource: DataSource,
  ){}

  async create(createServiceDto: CreateServiceDto) {
    const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
          let services = createServiceDto;
    
            const data = queryRunner.manager.create(Service, {
              service_category:services.service_category,
              service_description: services.service_description,
              service_type:services.service_type,
              service_price:services.service_price
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

 async addServiceCategory(createServiceCategoryDto: CreateServiceCategoryDto) {
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const category = createServiceCategoryDto.category_description
      ? JSON.parse(createServiceCategoryDto.category_description)
      : [];

    const removeCategory = createServiceCategoryDto.removed_category
      ? JSON.parse(createServiceCategoryDto.removed_category)
      : [];

    // Handle deletions
    if (removeCategory.length > 0) {
      for (let i = 0; i < removeCategory.length; i++) {
        await queryRunner.manager.delete(ServiceCategory, removeCategory[i].id);
      }
    }

    // Handle new inserts
    for (let i = 0; i < category.length; i++) {
      if (!category[i].id) {
        const newCategory = queryRunner.manager.create(ServiceCategory, {
          category_description: category[i].category_description,
          service_type: createServiceCategoryDto.service_type,
        });
        await queryRunner.manager.save(newCategory);
      }
    }

    // ✅ Commit once after all
    await queryRunner.commitTransaction();

    return {
      msg: 'Saved successfully!',
      status: HttpStatus.OK,
    };
  } catch (error) {
    await queryRunner.rollbackTransaction();
    return {
      msg: 'Saving failed! ' + error,
      status: HttpStatus.BAD_REQUEST,
    };
  } finally {
    await queryRunner.release();
  }
}



  async AddPackages(createServicePackagesDto: CreateServicePackagesDto) {
      // console.log(createServicePackagesDto)
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
    var selectedmods = [];
    try {
      let mods = JSON.parse(createServicePackagesDto.assign_mods);

      for (let i = 0; i < mods.length; i++) {
        let modsEl = mods[i];
        selectedmods.push(modsEl.id);
        if (modsEl.subLink) {
          let sl = modsEl.subLink;
          for (let j = 0; j < sl.length; j++) {
            let msl = sl[j];
            selectedmods.push(msl.id);
          }
        }
      }

      // let newAssignMod = this.servicesPackagesRepository.create({
        let newAssignMod  = queryRunner.manager.create(ServicePackages, {
        description: createServicePackagesDto.description,
        price:createServicePackagesDto.price,
        assign_mods: createServicePackagesDto.assign_mods,
        selected_modules: JSON.stringify(selectedmods),
      });

          await queryRunner.manager.save(newAssignMod);
          //await this.servicesPackagesRepository.save(newAssignMod);
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

  getCategoryServiceType(id:number){
    return this.dataSource.manager.createQueryBuilder(ServiceCategory, 'sc')
    .select([
     "sc.*"
    ])
    .where('sc.service_type = :id', {id})
    .getRawMany()

  }

  
  async getRemainingModules(id: number) {
    let am = await this.servicesPackagesRepository
      .createQueryBuilder('am')
      .where('am.id = :id', { id })
      .getOne();

    let select = JSON.parse(am.selected_modules);
    // console.log(select);
    if (am.selected_modules != '[]') {
      let sm = await this.dataSource
        .createQueryBuilder(Service, 'sysmod')
        .where('sysmod.id NOT IN (:selected)', { selected: select })
        .getMany();
      // for (let i = 0; i < sm.length; i++) {
      //   let element = sm[i];

      //   if (element.isParent == true) {
      //     Object.assign(sm[i], { subLink: [] });
      //   }
      // }
      return sm;
    } else {
      let sm = await this.dataSource
        .createQueryBuilder(Service, 'sysmod')
        .getMany();
      // for (let i = 0; i < sm.length; i++) {
      //   let element = sm[i];

      //   if (element.isParent == true) {
      //     Object.assign(sm[i], { subLink: [] });
      //   }
      // }
      return sm;
    }
  }

  findAll() {
    return this.servicesPackagesRepository.find();
  }

 async getSpecificPackages(id:number){
  console.log(id)
    const isExist = await this.servicesPackagesRepository.findOneBy({ id});
    return isExist
  }

  async  getAllServices() {
      let data = await this.servicesRepository
      .createQueryBuilder('sp')
      .select([
        " sp.*",
      ])
      .getRawMany()
      // console.log(data)
      return data
  }
  


  findOne(id: number) {
    console.log(id)
    // return `This action returns a #${id} service`;
  }

    async getAllServicesByType(type: number) {
    
      let data = await this.servicesRepository
      .createQueryBuilder('sp')
      .select([
        " sp.*",
      ])
      .where('sp.service_type = :type',{type})
      .getRawMany()
      // console.log(data)
    return data;
  }

  async getAllServicesForBooking(type: number) {
    
      // let data = await this.servicesRepository
      // .createQueryBuilder('sp')
      // .select([
      //   " sp.*",
      // ])
      // .where('sp.service_type = :type',{type})
      // .getRawMany()
      // console.log(data)
    
const servicesWithCategories = await this.dataSource
  .getRepository(Service)
  .createQueryBuilder("service")
  // .leftJoinAndSelect("service.service_category", "category")
   .leftJoin(ServiceCategory, 'category', 'service.service_category = category.id')
  .select([
    "service.id AS service_id",
    "service.service_description AS service_name",
    "service.service_price AS service_price",
    "category.id AS category_id",
    "category.category_description AS category_description",
  ])
  .where('service.service_type = :type',{type})
  .getRawMany();
const result = [];
const categoryMap = new Map();

for (const row of servicesWithCategories) {
  const catId = row.category_id;

  if (catId) {
    if (!categoryMap.has(catId)) {
      categoryMap.set(catId, {
        id: catId,
        description: row.category_description,
        data: []
      });
    }
    categoryMap.get(catId).data.push({id:row.service_id, description: row.service_name, price:  row.service_price, category_id:catId});
  } else {
    result.push({
      id: row.service_id,
      description: row.service_name,
      price: row.service_price,
      data: []
    });
  }
}

result.push(...categoryMap.values());

console.log(result);
    return result;
  }


  update(id: number, updateServiceDto: UpdateServiceDto) {
    // console.log(id,updateServiceDto )
    try {
    this.dataSource.manager.update(Service, id,{
      service_category:updateServiceDto.service_category,
    service_description:updateServiceDto.service_description,
    service_price:updateServiceDto.service_price
  })
  return{
    msg:'Updated successfully!', status:HttpStatus.CREATED
  }
} catch (error) {
  return{
    msg:'Something went wrong!'+ error, status:HttpStatus.BAD_REQUEST
  }
}
  }


    async updateServicePackages(id: number, updateServicePackagesDto: UpdateServicePackagesDto) {
    var selectedmods = [];
    try {
      let mods = JSON.parse(updateServicePackagesDto.assign_mods);

      for (let i = 0; i < mods.length; i++) {
        // console.log('mods', mods[i]);
        let modsEl = mods[i];
        selectedmods.push(modsEl.id);
        if (modsEl.subLink) {
          let sl = modsEl.subLink;
          for (let j = 0; j < sl.length; j++) {
            let msl = sl[j];
            selectedmods.push(msl.id);
          }
        }
      }

      await this.servicesPackagesRepository.update(id, {
        description: updateServicePackagesDto.description,
        price:updateServicePackagesDto.price,
        assign_mods: updateServicePackagesDto.assign_mods,
        selected_modules: JSON.stringify(selectedmods),
      });
      return {
        msg: 'Saved successfully.',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        msg: 'Saving failed',
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }



  remove(id: number) {
    return `This action removes a #${id} service`;
  }
}
