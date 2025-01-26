import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BoundService } from './bound.service';

@Controller('bound')
export class BoundController {
  constructor(private readonly boundService: BoundService) {}

  // @Post()
  // create(@Body() createBoundDto: CreateBoundDto) {
  //   return this.boundService.create(createBoundDto);
  // }
  //
  // @Get()
  // findAll() {
  //   return this.boundService.findAll();
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.boundService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBoundDto: UpdateBoundDto) {
  //   return this.boundService.update(+id, updateBoundDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.boundService.remove(+id);
  // }
}
