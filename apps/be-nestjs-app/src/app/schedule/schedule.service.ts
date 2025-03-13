import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';

@Injectable()
export class ScheduleService {
  @Cron('45 * * * * *')
  handleCron() {
    Logger.log('Called when the current second is 45');
    console.log('Called when the current second is 45');
  }

  @Interval(10000)
  handleInterval() {
    Logger.log('Called every 10 seconds');
    console.log('Called every 10 seconds');
  }
}
