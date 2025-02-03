import { PartialType } from '@nestjs/mapped-types';
import { CreateStandardDto } from './create-standard.dto';

export class UpdateStandardDto extends PartialType(CreateStandardDto) {
  id: string;
}
