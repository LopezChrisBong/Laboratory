import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { UpdateServicePackagesDto } from './dto/update-service-packages.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment, Patient, Service, ServiceAppointment, ServiceCategory, ServiceLabResult, ServicePackages, UserDetail, Users } from 'src/entities';
import { DataSource, Repository } from 'typeorm';
import { CreateServicePackagesDto } from './dto/create-service-packages.dto';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { CreateAppointmentDto } from 'src/appointment/dto/create-appointment.dto';
import { CreateServiceAppointmentDto } from './dto/create-service-appointment.dto';
import { UpdateServiceAppointmentDto } from './dto/update-service-appointment.dto';

@Injectable()
export class ServicesService {
    constructor(
      @InjectRepository(Service) private readonly servicesRepository: Repository<Service>,
      @InjectRepository(ServicePackages) private readonly servicesPackagesRepository: Repository<ServicePackages>,
      @InjectRepository(ServiceCategory) private readonly servicesCategoryRepository: Repository<ServiceCategory>,
      @InjectRepository(Appointment) private readonly appointmentRepository: Repository<Appointment>,
      @InjectRepository(ServiceAppointment) private readonly servicesAppointmentRepository: Repository<ServiceAppointment>,
      @InjectRepository(ServiceLabResult) private readonly servicesLabResultRepository: Repository<ServiceLabResult>,
      @InjectRepository(Patient) private readonly patientRepository: Repository<Patient>,
      @InjectRepository(UserDetail) private readonly userDetailRepository: Repository<UserDetail>,
      @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
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

    async createServiceAppointment(createServiceAppointmentDto: CreateServiceAppointmentDto) {
    const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
          let services = createServiceAppointmentDto;
          // console.log(services)
            const data = queryRunner.manager.create(ServiceAppointment, {
              patientID:services.patientID,
              doctorID:services.doctorID,
              appointmentID:services.appointmentID,
              medtechID:services.medtechID,
              service_list:services.service_list,
              package_list:services.package_list,
            });
           let saveService = await queryRunner.manager.save(data);

          let service_list = JSON.parse(services.service_list)
          let package_list = JSON.parse(services.package_list)
          let new_service = []
          let new_package = []
          let package_insert = []
          for (let i = 0; i < service_list.length; i++) {
             const isExist = await this.servicesRepository.findOneBy({ id:service_list[i]});
            new_service.push(isExist)
          }
          // console.log(new_service)

             for (let i = 0; i < package_list.length; i++) {
             const isExist = await this.servicesPackagesRepository.findOneBy({ id:package_list[i]});
            new_package.push(isExist)
          }
          // console.log(new_package)

          for (let i = 0; i < new_package.length; i++) {
              let packageData = JSON.parse(new_package[i].assign_mods)
            // console.log(packageData)

            for (let j = 0; j < packageData.length; j++) {
              
              package_insert.push(packageData[j])
            }
          }
            // console.log(package_insert)

            const combined = [...new_service, ...package_insert];

            const unique = Object.values(
              combined.reduce((acc, item) => {
             const key = `${item.id}-${item.service_description}`;
               acc[key] = item; // Keep the last occurrence
              return acc;
           }, {})
            );

           const cleanedArray = unique.map((item: any) =>
            typeof item.toJSON === 'function'
            ? item.toJSON()
              : JSON.parse(JSON.stringify(item))
            );

            // console.log(cleanedArray)

            for (let i = 0; i < cleanedArray.length; i++) {
              // console.log(cleanedArray[i].id)
              const data = queryRunner.manager.create(ServiceLabResult, {
              labID:saveService.id,
              serviceID:cleanedArray[i].id,
              patientID:services.patientID,
              service_description:cleanedArray[i].service_description,
              service_price:cleanedArray[i].service_price,
            });
            await queryRunner.manager.save(data);
            }
          
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

  async getAllLabRequest(patientID: number) {
    
      let data = await this.servicesAppointmentRepository
      .createQueryBuilder('sp')
          .select([
              " sp.*",
               "IF (!ISNULL(ud.mname), concat(ud.fname, ' ',SUBSTRING(ud.mname, 1, 1) ,'. ',ud.lname) ,concat(ud.fname, ' ', ud.lname)) as doctor_name",
               "IF (!ISNULL(us.mname), concat(us.fname, ' ',SUBSTRING(us.mname, 1, 1) ,'. ',us.lname) ,concat(us.fname, ' ', us.lname)) as medtech_name",
               "us.liscence_no as liscence_no",
               "sp.medtechID as medtechID",
               "sp.doctorID as doctorID",
            ])
            .leftJoin(Patient, 'pt', 'pt.id = sp.patientID')
            .leftJoin(UserDetail, 'ud', 'ud.id = sp.doctorID')
            .leftJoin(UserDetail, 'us', 'us.id = sp.medtechID')
      .where('sp.patientID = :patientID',{patientID})
      .getRawMany()
      // console.log('LABORATORY REQUEST',data)
    return data;
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

  async getItemPaid(data:any){
    // console.log(JSON.parse(data.service_list))

    let service_data = JSON.parse(data.service_list)
    let package_data = JSON.parse(data.package_list)

    let new_service = []
    let new_package =[]

    for (let i = 0; i < service_data.length; i++) {
     let dataID = service_data[i]
     let data = await this.servicesRepository
      .createQueryBuilder('sp')
      .select([
        " sp.*",
      ])
      .where('sp.id = :dataID',{dataID})
      .getRawOne()
      new_service.push(data)
    }
    
     for (let i = 0; i < package_data.length; i++) {
      let dataID = package_data[i]
     let data = await this.servicesRepository
      .createQueryBuilder('sp')
      .select([
        " sp.*",
      ])
      .where('sp.id = :dataID',{dataID})
      .getRawOne()
      new_package.push(data)
    }

    // console.log('Service',new_service)
    // console.log('Package',new_package)

    return {new_service,new_package}

  }

async  getAllServiceToUpdateResult(labID:number){
      let data = await this.servicesLabResultRepository
      .createQueryBuilder('slr')
      .select([
        " slr.*",
      ])
      .where('slr.labID = :labID',{labID})
      .getRawMany()
      console.log(data)
      return data
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


//    async updateServiceAppointment(id: number, updateServiceAppointmentDto: UpdateServiceAppointmentDto) {
//     console.log(id,updateServiceAppointmentDto )
//     try {
//     const isExist = await this.servicesAppointmentRepository.findOneBy({ id});
//     console.log(isExist)
//     let newServiceList = JSON.parse(updateServiceAppointmentDto.service_list)
//     let oldServiceList = JSON.parse(isExist.service_list)

//     let addedServiceList = newServiceList.filter(id => !oldServiceList.includes(id));
//     let removedServiceList = oldServiceList.filter(id => !newServiceList.includes(id));

//     let new_service = []
//     let new_added_service = []

//        for (let i = 0; i < addedServiceList.length; i++) {
//              const isExist = await this.servicesRepository.findOneBy({ id:addedServiceList[i]});
//             new_added_service.push(isExist)
//           }

//        for (let i = 0; i < removedServiceList.length; i++) {
//              const isExist = await this.servicesRepository.findOneBy({ id:removedServiceList[i]});
//             new_service.push(isExist)
//           }


//           // console.log(new_service)

//     //Package Area//////------

//     let newPackageList = JSON.parse(updateServiceAppointmentDto.package_list)
//     let oldPackageList = JSON.parse(isExist.package_list)

//     let addedPackageList = newPackageList.filter(id => !oldPackageList.includes(id));
//     let removedPackageList = oldPackageList.filter(id => !newPackageList.includes(id));


//     // console.log('Added',addedPackageListt )
//     // console.log('Removed',removedPackageList )
//        let new_add_package = []
//     let package_add_insert = []

//         for (let i = 0; i < addedPackageList.length; i++) {
//              const isExist = await this.servicesPackagesRepository.findOneBy({ id:addedPackageList[i]});
//             new_add_package.push(isExist)
//           }
//           // console.log(new_package)

//           for (let i = 0; i < new_add_package.length; i++) {
//               let packageData = JSON.parse(new_add_package[i].assign_mods)
//             // console.log(packageData)

//             for (let j = 0; j < packageData.length; j++) {
              
//               package_add_insert.push(packageData[j])
//             }
//           }



//     let new_package = []
//     let package_insert = []

//         for (let i = 0; i < removedPackageList.length; i++) {
//              const isExist = await this.servicesPackagesRepository.findOneBy({ id:removedPackageList[i]});
//             new_package.push(isExist)
//           }
//           // console.log(new_package)

//           for (let i = 0; i < new_package.length; i++) {
//               let packageData = JSON.parse(new_package[i].assign_mods)
//             // console.log(packageData)

//             for (let j = 0; j < packageData.length; j++) {
              
//               package_insert.push(packageData[j])
//             }
//           }

//           // console.log(package_insert)

//           const combined = [...new_service, ...package_insert];

         

//               const unique = Object.values(
//               combined.reduce((acc, item) => {
//              const key = `${item.id}-${item.service_description}`;
//                acc[key] = item; // Keep the last occurrence
//               return acc;
//            }, {})
//             );

//            const cleanedArray = unique.map((item: any) =>
//             typeof item.toJSON === 'function'
//             ? item.toJSON()
//               : JSON.parse(JSON.stringify(item))
//             );

//             //  console.log(cleanedArray)

//              for (let i = 0; i < cleanedArray.length; i++) {
              // console.log(cleanedArray[i].id)
//               await this.servicesLabResultRepository.delete({id:cleanedArray[i].id, labID:id});
//              }


//              //Added Services -----Area


//              const combined_added = [...new_added_service, ...package_add_insert];

             
//               const unique_add = Object.values(
//               combined_added.reduce((acc, item) => {
//              const key = `${item.id}-${item.service_description}`;
//                acc[key] = item; // Keep the last occurrence
//               return acc;
//            }, {})
//             );

//            const cleanedArray_added = unique_add.map((item: any) =>
//             typeof item.toJSON === 'function'
//             ? item.toJSON()
//               : JSON.parse(JSON.stringify(item))
//             );

//              for (let i = 0; i < cleanedArray_added.length; i++) {
              // console.log(cleanedArray_added[i].id)
//               // await this.servicesLabResultRepository.save({id:cleanedArray[i].id, labID:id});
//               let saveQuarter = this.dataSource.manager.create(ServiceLabResult, {
//               labID:id,
//               serviceID:cleanedArray_added[i].id,
//               patientID:updateServiceAppointmentDto.patientID,
//               service_description:cleanedArray_added[i].service_description,
//               service_price:cleanedArray_added[i].service_price,
//               });
//                 await this.dataSource.manager.save(saveQuarter)
//              }


    
//     this.dataSource.manager.update(ServiceAppointment, id,{
//       service_list:updateServiceAppointmentDto.service_list,
//       package_list:updateServiceAppointmentDto.package_list,
//   })
//   return{
//     msg:'Updated successfully!', status:HttpStatus.CREATED
//   }
// } catch (error) {
//   return{
//     msg:'Something went wrong!'+ error, status:HttpStatus.BAD_REQUEST
//   }
// }
//   }

async updateServiceAppointment(id: number, dto: UpdateServiceAppointmentDto) {
    console.log(id, dto)
    if(dto.appointmentID){
      // console.log('naay sulod')
      let newData: {
    patientID: number;
    appointmentID: number;
    service_list: string;
    package_list: string;
    labID: number;
    doctorID: number;
    medtechID: number;
    status:number
    } = {
    patientID: dto.patientID,
    appointmentID: dto.appointmentID,
    service_list: dto.service_list,
    package_list: dto.package_list,
    labID: dto.labID,
    doctorID: dto.doctorID,
    medtechID: dto.medtechID,
    status:dto.status
    };

     const existing = await this.servicesAppointmentRepository.findOneBy({ appointmentID:dto.appointmentID });
        if(!existing){
          // console.log("wala sa data")
           return await this.createServiceAppointment(newData)
          //     return {
          //   msg: 'Saved successfully!',
          //   status: HttpStatus.OK,
          // };
            
        }
        else{
          // console.log("naa sa data")
          // console.log(existing)

          try{
    const newServiceList = JSON.parse(dto.service_list);
    const oldServiceList = JSON.parse(existing.service_list);
    const newPackageList = JSON.parse(dto.package_list);
    const oldPackageList = JSON.parse(existing.package_list);

    // === Helper Functions ===dwadawdwad
    const getAddedRemoved = (oldList, newList) => {
      const added = newList.filter(id => !oldList.includes(id));
      const removed = oldList.filter(id => !newList.includes(id));
      return { added, removed };
    };

    const fetchEntitiesByIds = async (ids, repo) => {
      return Promise.all(ids.map(id => repo.findOneBy({ id })));
    };

    const extractPackageServices = packages =>
      packages.flatMap(pkg => JSON.parse(pkg.assign_mods));

    const removeDuplicatesByKey = (items, keyFn) => {
      const map = new Map();
      for (const item of items) {
        map.set(keyFn(item), item);
      }
      return Array.from(map.values());
    };

    // === Process Services ===1111
    const { added: addedServices, removed: removedServices } = getAddedRemoved(oldServiceList, newServiceList);
    const addedServiceEntities = await fetchEntitiesByIds(addedServices, this.servicesRepository);
    const removedServiceEntities = await fetchEntitiesByIds(removedServices, this.servicesRepository);

    // === Process Packages ===22222
    const { added: addedPackages, removed: removedPackages } = getAddedRemoved(oldPackageList, newPackageList);
    const addedPackageEntities = await fetchEntitiesByIds(addedPackages, this.servicesPackagesRepository);
    const removedPackageEntities = await fetchEntitiesByIds(removedPackages, this.servicesPackagesRepository);

    const addedPackageServices = extractPackageServices(addedPackageEntities);
    const removedPackageServices = extractPackageServices(removedPackageEntities);

    // === Combine and Deduplicate ===33333
    const toDelete = removeDuplicatesByKey(
      [...removedServiceEntities, ...removedPackageServices],
      item => `${item.id}-${item.service_description}`
    );

    const toInsert = removeDuplicatesByKey(
      [...addedServiceEntities, ...addedPackageServices],
      item => `${item.id}-${item.service_description}`
    );

    // 55555=== Delete Removed Services ===5555
    await Promise.all(
      toDelete.map(service =>
        this.servicesLabResultRepository.delete({ serviceID: service.id, labID: id })
      )
    );

    // ===33333 Insert Added Services ===555555
    const resultsToInsert = toInsert.map(service =>
      this.dataSource.manager.create(ServiceLabResult, {
        labID: id,
        serviceID: service.id,
        patientID: dto.patientID,
        service_description: service.service_description,
        service_price: service.service_price,
      })
    );
    await this.dataSource.manager.save(resultsToInsert);

    //33333 === Update Appointment ===55555
    await this.dataSource.manager.update(ServiceAppointment, id, {
      service_list: dto.service_list,
      package_list: dto.package_list,
    });

    return { msg: "Updated successfully!", status: HttpStatus.CREATED };

    
  } catch (error) {
    return { msg: "Something went wrong! " + error.message, status: HttpStatus.BAD_REQUEST };
  }

        }

         

    }else{
      // console.log('walay sulod')
  try {
    const existing = await this.servicesAppointmentRepository.findOneBy({ id });
    if (!existing) {
      throw new Error("Data not found");
    }

    const newServiceList = JSON.parse(dto.service_list);
    const oldServiceList = JSON.parse(existing.service_list);
    const newPackageList = JSON.parse(dto.package_list);
    const oldPackageList = JSON.parse(existing.package_list);

    // === Helper Functions ===dwadawdwad
    const getAddedRemoved = (oldList, newList) => {
      const added = newList.filter(id => !oldList.includes(id));
      const removed = oldList.filter(id => !newList.includes(id));
      return { added, removed };
    };

    const fetchEntitiesByIds = async (ids, repo) => {
      return Promise.all(ids.map(id => repo.findOneBy({ id })));
    };

    const extractPackageServices = packages =>
      packages.flatMap(pkg => JSON.parse(pkg.assign_mods));

    const removeDuplicatesByKey = (items, keyFn) => {
      const map = new Map();
      for (const item of items) {
        map.set(keyFn(item), item);
      }
      return Array.from(map.values());
    };

    // === Process Services ===1111
    const { added: addedServices, removed: removedServices } = getAddedRemoved(oldServiceList, newServiceList);
    const addedServiceEntities = await fetchEntitiesByIds(addedServices, this.servicesRepository);
    const removedServiceEntities = await fetchEntitiesByIds(removedServices, this.servicesRepository);

    // === Process Packages ===22222
    const { added: addedPackages, removed: removedPackages } = getAddedRemoved(oldPackageList, newPackageList);
    const addedPackageEntities = await fetchEntitiesByIds(addedPackages, this.servicesPackagesRepository);
    const removedPackageEntities = await fetchEntitiesByIds(removedPackages, this.servicesPackagesRepository);

    const addedPackageServices = extractPackageServices(addedPackageEntities);
    const removedPackageServices = extractPackageServices(removedPackageEntities);

    // === Combine and Deduplicate ===33333
    const toDelete = removeDuplicatesByKey(
      [...removedServiceEntities, ...removedPackageServices],
      item => `${item.id}-${item.service_description}`
    );

    const toInsert = removeDuplicatesByKey(
      [...addedServiceEntities, ...addedPackageServices],
      item => `${item.id}-${item.service_description}`
    );

    // 55555=== Delete Removed Services ===5555
    await Promise.all(
      toDelete.map(service =>
        this.servicesLabResultRepository.delete({ serviceID: service.id, labID: id })
      )
    );

    // ===33333 Insert Added Services ===555555
    const resultsToInsert = toInsert.map(service =>
      this.dataSource.manager.create(ServiceLabResult, {
        labID: id,
        serviceID: service.id,
        patientID: dto.patientID,
        service_description: service.service_description,
        service_price: service.service_price,
      })
    );
    await this.dataSource.manager.save(resultsToInsert);

    //33333 === Update Appointment ===55555
    await this.dataSource.manager.update(ServiceAppointment, id, {
      service_list: dto.service_list,
      package_list: dto.package_list,
    });

    return { msg: "Updated successfully!", status: HttpStatus.CREATED };

    
  } catch (error) {
    return { msg: "Something went wrong! " + error.message, status: HttpStatus.BAD_REQUEST };
  }
    }
}




  remove(id: number) {
    return `This action removes a #${id} service`;
  }
}
