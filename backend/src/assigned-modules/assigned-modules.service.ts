import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAssignedModuleDto } from './dto/create-assigned-module.dto';
import { UpdateAssignedModuleDto } from './dto/update-assigned-module.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AssignedModule } from './entities/assigned-module.entity';
import { DataSource, Repository } from 'typeorm';
import { SysModule, UserDetail, Users } from 'src/entities';

@Injectable()
export class AssignedModulesService {
  constructor(
    @InjectRepository(AssignedModule)
    private readonly assmodRep: Repository<AssignedModule>,
    private dataSource: DataSource,
  ) {}
  async create(createAssignedModuleDto: CreateAssignedModuleDto) {
    var selectedmods = [];
    try {
      let mods = JSON.parse(createAssignedModuleDto.assign_mods);

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

      let newAssignMod = this.assmodRep.create({
        description: createAssignedModuleDto.description,
        assign_mods: createAssignedModuleDto.assign_mods,
        selected_modules: JSON.stringify(selectedmods),
      });

      await this.assmodRep.save(newAssignMod);
      return {
        msg: 'Saved successfully.',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      return {
        msg: 'Saving failed',
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  findAll() {
    return this.assmodRep.find();
  }

  async getMyAssignedModules(user: any) {
    let us = await this.dataSource
      .createQueryBuilder(Users, 'us')
      .where('us.id = :id', { id: user.userdetail.user.id })
      .getOne();

    return this.assmodRep
      .createQueryBuilder('am')
      .where('am.id = :amID', { amID: us.assignedModuleID })
      .getOne();
  }

  async asOIC(user: any) {
    let userModID = user.userdetail.user.assignedModuleID;
    //admin
    if (userModID == 1) {
      return this.assmodRep
        .createQueryBuilder('am')
        .where('am.id = :amID', { amID: 1 })
        .getOne();
    }
    else if (userModID == 2 || userModID == 17) {
      let mods = await this.dataSource.manager
        .createQueryBuilder(AssignedModule, 'am')
        .where('am.id = :id', { id: userModID })
        .getOne();
      let oicmods = await this.dataSource.manager
        .createQueryBuilder(AssignedModule, 'am')
        .where('am.id = 18')
        .getOne();
      let main = JSON.parse(mods.assign_mods);
      let toadd = JSON.parse(oicmods.assign_mods);

      main.splice(main.length - 1, 0, toadd[0]);
      return { assign_mods: JSON.stringify(main) };
    }
    //admin staff
    else if (userModID == 15) {
      let mods = await this.dataSource.manager
        .createQueryBuilder(AssignedModule, 'am')
        .where('am.id = :id', { id: userModID })
        .getOne();
      let oicmods = await this.dataSource.manager
        .createQueryBuilder(AssignedModule, 'am')
        .where('am.id = 19')
        .getOne();
      let main = JSON.parse(mods.assign_mods);
      let toadd = JSON.parse(oicmods.assign_mods);

      main.splice(main.length - 2, 0, toadd[0]);
      return { assign_mods: JSON.stringify(main) };
    } else {
      //heads to president
      let mods = await this.dataSource.manager
        .createQueryBuilder(AssignedModule, 'am')
        .where('am.id = :id', { id: userModID })
        .getOne();
      return mods;
    }
  }

  findOne(id: number) {
    return this.assmodRep.findOneBy({ id });
  }

  async getRemainingModules(id: number) {
    let am = await this.assmodRep
      .createQueryBuilder('am')
      .where('am.id = :id', { id })
      .getOne();

    let select = JSON.parse(am.selected_modules);
    if (am.selected_modules != '[]') {
      let sm = await this.dataSource
        .createQueryBuilder(SysModule, 'sysmod')
        .where('sysmod.id NOT IN (:selected)', { selected: select })
        .getMany();
      for (let i = 0; i < sm.length; i++) {
        let element = sm[i];

        if (element.isParent == true) {
          Object.assign(sm[i], { subLink: [] });
        }
      }
      return sm;
    } else {
      let sm = await this.dataSource
        .createQueryBuilder(SysModule, 'sysmod')
        .getMany();
      for (let i = 0; i < sm.length; i++) {
        let element = sm[i];

        if (element.isParent == true) {
          Object.assign(sm[i], { subLink: [] });
        }
      }
      return sm;
    }
  }

  async update(id: number, updateAssignedModuleDto: UpdateAssignedModuleDto) {
    var selectedmods = [];
    try {
      let mods = JSON.parse(updateAssignedModuleDto.assign_mods);

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

      await this.assmodRep.update(id, {
        description: updateAssignedModuleDto.description,
        assign_mods: updateAssignedModuleDto.assign_mods,
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

  async remove(id: number) {
    try {
      await this.assmodRep.delete(id);
      return {
        msg: 'Deleted successfully.',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        msg: 'Deletion failed',
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }
}
