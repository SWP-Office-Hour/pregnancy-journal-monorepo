import { MetricRes } from '@pregnancy-journal-monorepo/contract';
import { of, throwError } from 'rxjs';

export type pregnancyGetRes = {
  id: string;
  week: number;
  expectedBirthDate: Date;
  nextVisitDate: Date;
  visitDoctorDate: Date;
  hospital: HospitalType;
  data: {
    value: number;
    metric_id: string;
    metric_title: string;
    metric_measure: string;
    metric_upperBoundMsg: string;
    metric_lowerBoundMsg: string;
    standard_week: number;
    standard_lowerbound: number;
    standard_upperbound: number;
    whoStandardValue: number;
    status?: number;
    tags: { id: string; name: string }[];
  }[];
  media?: mediaType[];
};

export type pregnancyUpdateSuccessRes = {
  status: number;
  message: string;
  data: pregnancyGetRes;
};

export type pregnancyUpdateFailRes = {
  status: number;
  message: string;
  errors: {
    [key: string]: string;
  }[];
};

export const pregnancyData: pregnancyGetRes[] = [
  {
    id: '1',
    week: 10,
    expectedBirthDate: new Date('2022-01-01'),
    nextVisitDate: new Date('2021-01-01'),
    visitDoctorDate: new Date('2021-01-01'),
    hospital: {
      id: '1',
      name: 'Bệnh viện Bạch Mai',
      city: 'Hà Nội',
    },
    data: [
      {
        value: 70,
        status: 1,
        metric_id: '1',
        metric_title: 'Cân nặng',
        metric_measure: 'kg',
        metric_upperBoundMsg: 'Cân nặng quá cao',
        metric_lowerBoundMsg: 'Cân nặng quá thấp',
        standard_week: 10,
        standard_lowerbound: 2,
        standard_upperbound: 4,
        whoStandardValue: 5,
        tags: [],
      },
      {
        value: 70,
        metric_id: '2',
        metric_title: 'Chiều cao',
        metric_measure: 'cm',
        metric_upperBoundMsg: 'Chiều cao quá cao',
        metric_lowerBoundMsg: 'Chiều cao quá thấp',
        standard_week: 10,
        standard_lowerbound: 2,
        standard_upperbound: 4,
        whoStandardValue: 5,

        status: 1,
        tags: [],
      },
    ],
    media: [
      {
        id: '1',
        mediaUrl: 'https://picsum.photos/200/300',
      },
      {
        id: '2',
        mediaUrl: 'https://picsum.photos/200/300',
      },
    ],
  },
  {
    id: '2',
    week: 20,
    expectedBirthDate: new Date('2023-01-01'),
    nextVisitDate: new Date('2022-01-01'),
    visitDoctorDate: new Date('2022-01-01'),
    hospital: {
      id: '2',
      name: 'Bệnh viện Quân Y',
      city: 'Hà Nội',
    },
    data: [
      {
        value: 70,
        metric_id: '1',
        metric_title: 'Cân nặng',
        metric_measure: 'kg',
        metric_upperBoundMsg: 'Cân nặng quá cao',
        metric_lowerBoundMsg: 'Cân nặng quá thấp',
        standard_week: 10,
        standard_lowerbound: 2,
        standard_upperbound: 4,
        whoStandardValue: 5,
        status: 1,
        tags: [],
      },
      {
        value: 70,
        metric_id: '2',
        metric_title: 'Chiều cao',
        metric_measure: 'cm',
        metric_upperBoundMsg: 'Chiều cao quá cao',
        metric_lowerBoundMsg: 'Chiều cao quá thấp',
        standard_week: 10,
        standard_lowerbound: 2,
        standard_upperbound: 4,
        whoStandardValue: 5,
        status: 1,
        tags: [],
      },
    ],
  },
  {
    id: '3',
    week: 30,
    expectedBirthDate: new Date('2022-01-01'),
    nextVisitDate: new Date('2021-01-01'),
    visitDoctorDate: new Date('2021-01-01'),
    hospital: {
      id: '3',
      name: 'Bệnh viện Trung ương',
      city: 'Hà Nội',
    },
    data: [
      {
        value: 70,
        metric_id: '1',
        metric_title: 'Cân nặng',
        metric_measure: 'kg',
        metric_upperBoundMsg: 'Cân nặng quá cao',
        metric_lowerBoundMsg: 'Cân nặng quá thấp',
        standard_week: 10,
        standard_lowerbound: 2,
        standard_upperbound: 4,
        whoStandardValue: 5,
        status: 1,
        tags: [],
      },
      {
        value: 70,
        metric_id: '2',
        metric_title: 'Chiều cao',
        metric_measure: 'cm',
        metric_upperBoundMsg: 'Chiều cao quá cao',
        metric_lowerBoundMsg: 'Chiều cao quá thấp',
        standard_week: 10,
        standard_lowerbound: 2,
        standard_upperbound: 4,
        whoStandardValue: 5,
        status: 1,
        tags: [],
      },
    ],
    media: [
      {
        id: '1',
        mediaUrl: 'https://picsum.photos/200/300',
      },
      {
        id: '2',
        mediaUrl: 'https://picsum.photos/200/300',
      },
    ],
  },
  {
    id: '4',
    week: 40,
    expectedBirthDate: new Date('2022-01-01'),
    nextVisitDate: new Date('2021-01-01'),
    visitDoctorDate: new Date('2021-01-01'),
    hospital: {
      id: '4',
      name: 'Bệnh viện Đa Khoa',
      city: 'Hồ Chí Minh',
    },
    data: [
      {
        value: 70,
        metric_id: '1',
        metric_title: 'Cân nặng',
        metric_measure: 'kg',
        metric_upperBoundMsg: 'Cân nặng quá cao',
        metric_lowerBoundMsg: 'Cân nặng quá thấp',
        standard_week: 10,
        standard_lowerbound: 2,
        standard_upperbound: 4,
        whoStandardValue: 5,
        status: 1,
        tags: [],
      },
      {
        value: 70,
        metric_id: '2',
        metric_title: 'Chiều cao',
        metric_measure: 'cm',
        metric_upperBoundMsg: 'Chiều cao quá cao',
        metric_lowerBoundMsg: 'Chiều cao quá thấp',
        standard_week: 10,
        standard_lowerbound: 2,
        standard_upperbound: 4,
        whoStandardValue: 5,
        status: 1,
        tags: [],
      },
    ],
  },
  {
    id: '5',
    week: 50,
    expectedBirthDate: new Date('2022-01-01'),
    nextVisitDate: new Date('2021-01-01'),
    visitDoctorDate: new Date('2021-01-01'),
    hospital: {
      id: '5',
      name: 'Bệnh viện Chợ Rẫy',
      city: 'Hồ Chí Minh',
    },
    data: [
      {
        value: 70,
        metric_id: '1',
        metric_title: 'Cân nặng',
        metric_measure: 'kg',
        metric_upperBoundMsg: 'Cân nặng quá cao',
        metric_lowerBoundMsg: 'Cân nặng quá thấp',
        standard_week: 10,
        standard_lowerbound: 2,
        standard_upperbound: 4,
        whoStandardValue: 5,
        status: 1,
        tags: [],
      },
      {
        value: 70,
        metric_id: '2',
        metric_title: 'Chiều cao',
        metric_measure: 'cm',
        metric_upperBoundMsg: 'Chiều cao quá cao',
        metric_lowerBoundMsg: 'Chiều cao quá thấp',
        standard_week: 10,
        standard_lowerbound: 2,
        standard_upperbound: 4,
        whoStandardValue: 5,
        status: 1,
        tags: [],
      },
    ],
  },
  {
    id: '6',
    week: 60,
    expectedBirthDate: new Date('2022-01-01'),
    nextVisitDate: new Date('2021-01-01'),
    visitDoctorDate: new Date('2021-01-01'),
    hospital: {
      id: '6',
      name: 'Bệnh viện Trung ương',
      city: 'Hồ Chí Minh',
    },
    data: [
      {
        value: 70,
        metric_id: '1',
        metric_title: 'Cân nặng',
        metric_measure: 'kg',
        metric_upperBoundMsg: 'Cân nặng quá cao',
        metric_lowerBoundMsg: 'Cân nặng quá thấp',
        standard_week: 10,
        standard_lowerbound: 2,
        standard_upperbound: 4,
        whoStandardValue: 5,
        status: 1,
        tags: [],
      },
      {
        value: 70,
        metric_id: '2',
        metric_title: 'Chiều cao',
        metric_measure: 'cm',
        metric_upperBoundMsg: 'Chiều cao quá cao',
        metric_lowerBoundMsg: 'Chiều cao quá thấp',
        standard_week: 10,
        standard_lowerbound: 2,
        standard_upperbound: 4,
        whoStandardValue: 5,
        status: 1,
        tags: [],
      },
    ],
  },
  {
    id: '7',
    week: 70,
    expectedBirthDate: new Date('2022-01-01'),
    nextVisitDate: new Date('2021-01-01'),
    visitDoctorDate: new Date('2021-01-01'),
    hospital: {
      id: '1',
      name: 'Bệnh viện Bạch Mai',
      city: 'Hà Nội',
    },
    data: [
      {
        value: 70,
        metric_id: '1',
        metric_title: 'Cân nặng',
        metric_measure: 'kg',
        metric_upperBoundMsg: 'Cân nặng quá cao',
        metric_lowerBoundMsg: 'Cân nặng quá thấp',
        standard_week: 10,
        standard_lowerbound: 2,
        standard_upperbound: 4,
        whoStandardValue: 5,
        status: 1,
        tags: [],
      },
      {
        value: 70,
        metric_id: '2',
        metric_title: 'Chiều cao',
        metric_measure: 'cm',
        metric_upperBoundMsg: 'Chiều cao quá cao',
        metric_lowerBoundMsg: 'Chiều cao quá thấp',
        standard_week: 10,
        standard_lowerbound: 2,
        standard_upperbound: 4,
        whoStandardValue: 5,
        status: 1,
        tags: [],
      },
    ],
  },
  {
    id: '8',
    week: 80,
    expectedBirthDate: new Date('2022-01-01'),
    nextVisitDate: new Date('2021-01-01'),
    visitDoctorDate: new Date('2021-01-01'),
    hospital: {
      id: '2',
      name: 'Bệnh viện Quân Y',
      city: 'Hà Nội',
    },
    data: [
      {
        value: 70,
        metric_id: '1',
        metric_title: 'Cân nặng',
        metric_measure: 'kg',
        metric_upperBoundMsg: 'Cân nặng quá cao',
        metric_lowerBoundMsg: 'Cân nặng quá thấp',
        standard_week: 10,
        standard_lowerbound: 2,
        standard_upperbound: 4,
        whoStandardValue: 5,
        status: 1,
        tags: [],
      },
      {
        value: 70,
        metric_id: '2',
        metric_title: 'Chiều cao',
        metric_measure: 'cm',
        metric_upperBoundMsg: 'Chiều cao quá cao',
        metric_lowerBoundMsg: 'Chiều cao quá thấp',
        standard_week: 10,
        standard_lowerbound: 2,
        standard_upperbound: 4,
        whoStandardValue: 5,
        status: 1,
        tags: [],
      },
    ],
  },
  {
    id: '9',
    week: 90,
    expectedBirthDate: new Date('2022-01-01'),
    nextVisitDate: new Date('2021-01-01'),
    visitDoctorDate: new Date('2021-01-01'),
    hospital: {
      id: '3',
      name: 'Bệnh viện Trung ương',
      city: 'Hà Nội',
    },
    data: [
      {
        value: 70,
        metric_id: '1',
        metric_title: 'Cân nặng',
        metric_measure: 'kg',
        metric_upperBoundMsg: 'Cân nặng quá cao',
        metric_lowerBoundMsg: 'Cân nặng quá thấp',
        standard_week: 10,
        standard_lowerbound: 2,
        standard_upperbound: 4,
        whoStandardValue: 5,
        status: 1,
        tags: [],
      },
      {
        value: 70,
        metric_id: '2',
        metric_title: 'Chiều cao',
        metric_measure: 'cm',
        metric_upperBoundMsg: 'Chiều cao quá cao',
        metric_lowerBoundMsg: 'Chiều cao quá thấp',
        standard_week: 10,
        standard_lowerbound: 2,
        standard_upperbound: 4,
        whoStandardValue: 5,
        status: 1,
        tags: [],
      },
    ],
  },
  {
    id: '10',
    week: 100,
    expectedBirthDate: new Date('2022-01-01'),
    nextVisitDate: new Date('2021-01-01'),
    visitDoctorDate: new Date('2021-01-01'),
    hospital: {
      id: '4',
      name: 'Bệnh viện Đa Khoa',
      city: 'Hồ Chí Minh',
    },
    data: [
      {
        value: 70,
        metric_id: '1',
        metric_title: 'Cân nặng',
        metric_measure: 'kg',
        metric_upperBoundMsg: 'Cân nặng quá cao',
        metric_lowerBoundMsg: 'Cân nặng quá thấp',
        standard_week: 10,
        standard_lowerbound: 2,
        standard_upperbound: 4,
        whoStandardValue: 5,
        status: 1,
        tags: [],
      },
      {
        value: 70,
        metric_id: '2',
        metric_title: 'Chiều cao',
        metric_measure: 'cm',
        metric_upperBoundMsg: 'Chiều cao quá cao',
        metric_lowerBoundMsg: 'Chiều cao quá thấp',
        standard_week: 10,
        standard_lowerbound: 2,
        standard_upperbound: 4,
        whoStandardValue: 5,
        status: 1,
        tags: [],
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

export type HospitalType = {
  id: string;
  name: string;
  city: string;
};

export const hospitals = [
  {
    id: '1',
    name: 'Bệnh viện Bạch Mai',
    city: 'Hà Nội',
  },
  {
    id: '2',
    name: 'Bệnh viện Quân Y',
    city: 'Hà Nội',
  },
  {
    id: '3',
    name: 'Bệnh viện Trung ương',
    city: 'Hà Nội',
  },
  {
    id: '4',
    name: 'Bệnh viện Đa Khoa',
    city: 'Hồ Chí Minh',
  },
  {
    id: '5',
    name: 'Bệnh viện Chợ Rẫy',
    city: 'Hồ Chí Minh',
  },
  {
    id: '6',
    name: 'Bệnh viện Trung ương',
    city: 'Hồ Chí Minh',
  },
];

export type mediaType = {
  id: string;
  mediaUrl: string;
};

export const pregnancyDataObservableById = (id: string) => {
  return of(pregnancyData.find((data) => data.id === id));
};

export const pregnancyDataObservable = () => {
  return of(pregnancyData);
};

export const pregnancyDataObservableByPage = (page: number, pageSize: number) => {
  return of({ data: pregnancyData.slice(page * pageSize, page * pageSize + pageSize), length: pregnancyData.length });
};

export const hospitalsObservable = () => {
  return of(hospitals);
};

export const metricsObservable = () => {
  return of(metrics);
};

export const pregnancyDataObservableUpdateSuccess = (record: any) => {
  const index = pregnancyData.findIndex((data) => data.id === record.id);
  return of({
    status: 200,
    message: 'Update success',
    data: pregnancyData[index],
  });
};

export const pregnancyDataObservableUpdateFail = (data: pregnancyGetRes) => {
  return throwError(() => {
    return {
      status: 403,
      message: 'Update fail',
      errors: [
        {
          expectedBirthDate: 'Ngày sinh dự kiến không hợp lệ',
        },
        {
          nextVisitDate: 'Ngày hẹn tái khám không hợp lệ',
        },
        {
          visitDoctorDate: 'Ngày hẹn khám không hợp lệ',
        },
        {
          1: 'Cân nặng không hợp lệ',
        },
        {
          2: 'Chiều cao không hợp lệ',
        },
      ],
    };
  });
};
