/* eslint-disable */
import { DateTime } from 'luxon';

/* Get the current instant */
const now = DateTime.now();

export const project = {
  githubIssues: {
    overview: {
      data: {
        newIssues: 214, // này là hiển thị bên thống kê kế dashboard
        closedIssues: 75,
      },
    },
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    series: {
      data: [
        {
          name: 'New issues',
          type: 'line',
          data: [42, 28, 43, 34, 20, 25, 22],
        },
        {
          name: 'Closed issues',
          type: 'column',
          data: [11, 10, 8, 11, 8, 10, 17],
        },
      ],
    },
  },
  taskDistribution: {
    overview: {
      data: {
        new: 594,
        completed: 287,
      },
    },
    labels: ['API', 'Backend', 'Frontend', 'Issues'],
    series: {
      data: [15, 20, 38, 27],
    },
  },
  schedule: {
    today: [
      {
        title: 'Group Meeting',
        time: 'in 32 minutes',
        location: 'Conference room 1B',
      },
      {
        title: 'Coffee Break',
        time: '10:30 AM',
      },
      {
        title: 'Public Beta Release',
        time: '11:00 AM',
      },
      {
        title: 'Lunch',
        time: '12:10 PM',
      },
      {
        title: 'Dinner with David',
        time: '05:30 PM',
        location: 'Magnolia',
      },
      {
        title: "Jane's Birthday Party",
        time: '07:30 PM',
        location: 'Home',
      },
      {
        title: "Overseer's Retirement Party",
        time: '09:30 PM',
        location: "Overseer's room",
      },
    ],
  },
};
