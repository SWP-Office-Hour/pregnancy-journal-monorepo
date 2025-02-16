import { MetricCreateRequestType, Status } from '@pregnancy-journal-monorepo/contract';

export const healthMetricListMockData: MetricCreateRequestType[] = [
  {
    title: 'Weight',
    measurement_unit: 'kg',
    status: Status.ACTIVE,
    standard: [
      {
        week: 1,
        lowerbound: 2.5,
        upperbound: 4.5,
        who_standard_value: 3.5,
      },
      {
        week: 2,
        lowerbound: 2.5,
        upperbound: 4.5,
        who_standard_value: 3.5,
      },
      {
        week: 3,
        lowerbound: 2.5,
        upperbound: 4.5,
        who_standard_value: 3.5,
      },
      {
        week: 4,
        lowerbound: 2.5,
        upperbound: 4.5,
        who_standard_value: 3.5,
      },
      {
        week: 5,
        lowerbound: 2.5,
        upperbound: 4.5,
        who_standard_value: 3.5,
      },
    ],
    lowerBoundMsg: 'Lower bound message',
    upperBoundMsg: 'Upper bound message',
    required: true,
  },
  {
    title: 'Weight',
    measurement_unit: 'kg',
    status: Status.ACTIVE,
    standard: [
      {
        week: 1,
        lowerbound: 2.5,
        upperbound: 4.5,
        who_standard_value: 3.5,
      },
      {
        week: 2,
        lowerbound: 2.5,
        upperbound: 4.5,
        who_standard_value: 3.5,
      },
      {
        week: 3,
        lowerbound: 2.5,
        upperbound: 4.5,
        who_standard_value: 3.5,
      },
      {
        week: 4,
        lowerbound: 2.5,
        upperbound: 4.5,
        who_standard_value: 3.5,
      },
      {
        week: 5,
        lowerbound: 2.5,
        upperbound: 4.5,
        who_standard_value: 3.5,
      },
    ],
    lowerBoundMsg: 'Lower bound message',
    upperBoundMsg: 'Upper bound message',
    required: true,
  },
  {
    title: 'Weight',
    measurement_unit: 'kg',
    status: Status.ACTIVE,
    standard: [
      {
        week: 1,
        lowerbound: 2.5,
        upperbound: 4.5,
        who_standard_value: 3.5,
      },
      {
        week: 2,
        lowerbound: 2.5,
        upperbound: 4.5,
        who_standard_value: 3.5,
      },
      {
        week: 3,
        lowerbound: 2.5,
        upperbound: 4.5,
        who_standard_value: 3.5,
      },
      {
        week: 4,
        lowerbound: 2.5,
        upperbound: 4.5,
        who_standard_value: 3.5,
      },
      {
        week: 5,
        lowerbound: 2.5,
        upperbound: 4.5,
        who_standard_value: 3.5,
      },
    ],
    lowerBoundMsg: 'Lower bound message',
    upperBoundMsg: 'Upper bound message',
    required: true,
  },
];
