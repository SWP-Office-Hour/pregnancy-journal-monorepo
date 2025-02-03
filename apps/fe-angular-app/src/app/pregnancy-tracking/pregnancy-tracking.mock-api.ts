import { MetricRes, pregnancyResponse, Status } from '@pregnancy-journal-monorepo/contract';

export const pregnancyData: pregnancyResponse = [
  {
    id: '1',
    week: 10,
    expectedBirthDate: new Date('2022-01-01'),
    nextVisitDate: new Date('2021-01-01'),
    visitDoctorDate: new Date('2021-01-01'),
    hospital: 'Bệnh viện Bạch Mai',
    data: [
      {
        id: 'string',
        value: 70,
        metric: {
          status: 1,
          id: '1',
          title: 'weight',
          measure: 'kg',
          upperBoundMsg: 'Cân nặng quá cao',
          lowerBoundMsg: 'Cân nặng quá thấp',
          standard: [
            {
              id: '1',
              week: 10,
              lowerbound: 2,
              upperbound: 4,
              whoStandardValue: 5,
            },
          ],
          tags: [],
        },
      },
      {
        id: 'string',
        value: 70,
        metric: {
          id: '1',
          title: 'height',
          measure: 'cm',
          upperBoundMsg: 'Chiều cao quá cao',
          lowerBoundMsg: 'Chiều cao quá thấp',
          standard: [
            {
              id: '1',
              week: 10,
              lowerbound: 2,
              upperbound: 4,
              whoStandardValue: 5,
            },
          ],
          status: 1,
          tags: [],
        },
      },
    ],
  },
];

export const metrics: MetricRes[] = [
  {
    id: '1',
    status: 1,
    tags: [],
    measure: 'kg',
    lowerBoundMsg: 'Cân nặng quá thấp',
    upperBoundMsg: 'Cân nặng quá cao',
    standard: [
      {
        id: '1',
        week: 10,
        lowerbound: 2,
        upperbound: 6,
        whoStandardValue: 5,
      },
    ],
    title: 'Cân nặng',
  },
  {
    id: '2',
    status: 1,
    tags: [],
    measure: 'cm',
    lowerBoundMsg: 'Chiều cao quá thấp',
    upperBoundMsg: 'Chiều cao quá cao',
    standard: [
      {
        id: '1',
        week: 10,
        lowerbound: 2,
        upperbound: 6,
        whoStandardValue: 5,
      },
    ],
    title: 'Chiều cao',
  },
];

export const hospitals: string[] = ['Bệnh viện Bạch Mai', 'Bệnh viện Bạch Mai 2'];
