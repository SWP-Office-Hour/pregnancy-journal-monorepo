import { metricRes, pregnancyResponse } from '@pregnancy-journal-monorepo/contract';

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
          id: '1',
          title: 'Cân nặng',
          measure: 'kg',
          upperBoundMsg: 'Cân nặng quá cao',
          lowerBoundMsg: 'Cân nặng quá thấp',
          bound: {
            id: '1',
            week: 10,
            lower: 2,
            upper: 4,
          },
        },
      },
      {
        id: 'string',
        value: 70,
        metric: {
          id: '1',
          title: 'Chiều cao',
          measure: 'cm',
          upperBoundMsg: 'Chiều cao quá cao',
          lowerBoundMsg: 'Chiều cao quá thấp',
          bound: {
            id: '1',
            week: 10,
            lower: 2,
            upper: 4,
          },
        },
      },
    ],
  },
];

export const metrics: metricRes = [
  {
    id: '1',
    title: 'Cân nặng',
    measure: 'kg',
    bound: [],
    upperBoundMsg: 'Cân nặng quá cao',
    lowerBoundMsg: 'Cân nặng quá thấp',
    tags: [],
    status: 1,
  },
  {
    id: '2',
    title: 'Chiều cao',
    measure: 'cm',
    bound: [],
    upperBoundMsg: 'Chiều cao quá cao',
    lowerBoundMsg: 'Chiều cao quá thấp',
    tags: [],
    status: 1,
  },
];

export const hospitals: string[] = ['Bệnh viện Bạch Mai', 'Bệnh viện Bạch Mai 2'];
