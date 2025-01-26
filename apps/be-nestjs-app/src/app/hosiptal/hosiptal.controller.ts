import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HosiptalService } from './hosiptal.service';
import { CreateHosiptalDto } from './dto/create-hosiptal.dto';
import { UpdateHosiptalDto } from './dto/update-hosiptal.dto';

@Controller('hosiptal')
export class HosiptalController {
  constructor(private readonly hosiptalService: HosiptalService) {}

  @Post()
  create(@Body() createHosiptalDto: CreateHosiptalDto) {
    return this.hosiptalService.create(createHosiptalDto);
  }

  @Get()
  findAll() {
    return this.hosiptalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hosiptalService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHosiptalDto: UpdateHosiptalDto) {
    return this.hosiptalService.update(+id, updateHosiptalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hosiptalService.remove(+id);
  }
}
