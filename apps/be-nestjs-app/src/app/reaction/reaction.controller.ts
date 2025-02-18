import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';
import { ReactionService } from './reaction.service';

@Controller('reaction')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Post()
  create(@Body() createReactionDto: CreateReactionDto) {
    return this.reactionService.create(createReactionDto);
  }

  @Get()
  findAll() {
    return this.reactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reactionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReactionDto: UpdateReactionDto) {
    return this.reactionService.update(+id, updateReactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reactionService.remove(+id);
  }
}
