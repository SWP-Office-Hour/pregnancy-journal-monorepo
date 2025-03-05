/* eslint-disable */
import { DateTime } from 'luxon';

/* Get the current instant */
const now = DateTime.now();

export const project = {
  githubIssues: {
    overview: {
      'this-week': {
        'new-issues': 214, // này là hiển thị bên thống kê kế dashboard
        'closed-issues': 75,
        fixed: 3,
        'wont-fix': 4,
        're-opened': 8,
        'needs-triage': 6,
      },
    },
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    series: {
      'this-week': [
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
      'this-week': {
        new: 594,
        completed: 287,
      },
    },
    labels: ['API', 'Backend', 'Frontend', 'Issues'],
    series: {
      'this-week': [15, 20, 38, 27],
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
    tomorrow: [
      {
        title: 'Marketing Meeting',
        time: '09:00 AM',
        location: 'Conference room 1A',
      },
      {
        title: 'Public Announcement',
        time: '11:00 AM',
      },
      {
        title: 'Lunch',
        time: '12:10 PM',
      },
      {
        title: 'Meeting with Beta Testers',
        time: '03:00 PM',
        location: 'Conference room 2C',
      },
      {
        title: 'Live Stream',
        time: '05:30 PM',
      },
      {
        title: 'Release Party',
        time: '07:30 PM',
        location: "CEO's house",
      },
      {
        title: "CEO's Private Party",
        time: '09:30 PM',
        location: "CEO's Penthouse",
      },
    ],
  },
};
