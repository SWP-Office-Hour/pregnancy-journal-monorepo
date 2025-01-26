import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';

@Controller('reminder')
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @Post()
  create(@Body() createReminderDto: CreateReminderDto) {
    return this.reminderService.create(createReminderDto);
  }

  @Get()
  findAll() {
    return this.reminderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reminderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReminderDto: UpdateReminderDto) {
    return this.reminderService.update(+id, updateReminderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reminderService.remove(+id);
  }
}
