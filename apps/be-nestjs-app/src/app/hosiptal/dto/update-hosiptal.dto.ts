import { PartialType } from '@nestjs/mapped-types';
import { CreateHosiptalDto } from './create-hosiptal.dto';

export class UpdateHosiptalDto extends PartialType(CreateHosiptalDto) {}
