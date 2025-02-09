import { Injectable } from '@nestjs/common';

@Injectable()
export class TimeUtilsService {
  calculatePregnancyWeeks({ expectedBirthDate, visitDate }: { expectedBirthDate: Date; visitDate: Date }) {
    const timeDiff = expectedBirthDate.getTime() - visitDate.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    // Tính tuần thai
    const pregnancyWeek = 40 - daysRemaining / 7;

    return Number(pregnancyWeek.toFixed(0));
  }
}
