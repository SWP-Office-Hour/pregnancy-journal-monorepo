import { Controller } from '@nestjs/common';
import { ChildService } from './child.service';

@Controller()
export class ChildController {
  constructor(private readonly childService: ChildService) {}
}
