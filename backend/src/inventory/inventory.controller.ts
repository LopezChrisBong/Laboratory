import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { currentUser } from 'src/shared/jwtDecode';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  create(@Body() createInventoryDto: CreateInventoryDto, @Headers() headers) {
    var head_str = headers.authorization;
    const curr_user = currentUser(head_str);
    return this.inventoryService.create(createInventoryDto, curr_user);
  }

  @Get()
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInventoryDto: UpdateInventoryDto, @Headers() headers) {
    var head_str = headers.authorization;
    const curr_user = currentUser(head_str);
    return this.inventoryService.update(+id, updateInventoryDto, curr_user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(+id);
  }
}
