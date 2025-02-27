/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

//*********** defaultNavigation là route cho tất cả mọi người, GUEST, ADMIN, MEMBER *************/
export const defaultNavigation: FuseNavigationItem[] = [
  {
    id: 'home',
    title: 'Home',
    type: 'basic',
    icon: 'heroicons_outline:home',
    link: '/home',
  },
  {
    id: 'tracking',
    title: 'Tracking',
    type: 'basic',
    icon: 'heroicons_outline:chart-bar',
    link: '/tracking',
  },
  {
    id: 'calendar',
    title: 'Calendar',
    type: 'basic',
    icon: 'heroicons_outline:calendar',
    link: '/calendar',
  },
  {
    id: 'blog',
    title: 'Blog',
    type: 'basic',
    icon: 'heroicons_outline:pencil-square',
    link: '/blog',
  },
  {
    id: 'community',
    title: 'Community',
    type: 'basic',
    icon: 'heroicons_outline:user-group',
    link: '/community',
  },
  {
    id: 'pricing',
    title: 'Pricing',
    type: 'basic',
    icon: 'heroicons_outline:currency-dollar',
    link: '/membership',
  },
  {
    id: 'about',
    title: 'About',
    type: 'basic',
    icon: 'heroicons_outline:information-circle',
    link: '/about',
  },
];

//*********** adminNavigation là route cho ADMIN *************/
export const adminNavigation: FuseNavigationItem[] = [
  {
    id: 'home',
    title: 'Home',
    type: 'basic',
    icon: 'heroicons_outline:home',
    link: '/admin',
  },
  {
    id: 'health-metric',
    title: 'Health Metric',
    type: 'basic',
    icon: 'heroicons_outline:chart-bar',
    link: 'admin/health-metric',
  },
  {
    id: 'tag',
    title: 'Tag',
    type: 'basic',
    icon: 'heroicons_outline:tag',
    link: 'admin/tag',
  },
  {
    id: 'hospital',
    title: 'Hospital',
    type: 'basic',
    icon: 'heroicons_outline:building-office',
    link: 'admin/hospital',
  },
  {
    id: 'admin_blog',
    title: 'Blog',
    type: 'aside',
    icon: 'heroicons_outline:pencil-square',
    link: 'admin/blog',
    children: [
      {
        id: 'blog-all',
        title: 'All',
        type: 'basic',
        link: 'admin/blog',
        icon: 'heroicons_outline:pencil-square',
      },
      {
        id: 'blog-create',
        title: 'Create',
        type: 'basic',
        link: 'admin/blog/create',
        icon: 'heroicons_outline:pencil-square',
      },
    ],
  },
  {
    id: 'category',
    title: 'Category',
    type: 'basic',
    icon: 'heroicons_outline:list-bullet',
    link: 'admin/category',
  },
  {
    id: 'membership',
    title: 'Membership',
    type: 'basic',
    // icon: 'heroicons_outline:user-group',
    icon: 'heroicons_outline:identification',
    link: 'admin/membership',
  },
  {
    id: 'users',
    title: 'Users',
    type: 'basic',
    icon: 'heroicons_outline:user-group',
    link: 'admin/users',
  },
];

//
// export const compactNavigation: FuseNavigationItem[] = [
//   {
//     id: 'example',
//     title: 'Example',
//     type: 'basic',
//     icon: 'heroicons_outline:chart-pie',
//     link: '/example',
//   },
// ];
// export const futuristicNavigation: FuseNavigationItem[] = [
//   {
//     id: 'example',
//     title: 'Example',
//     type: 'basic',
//     icon: 'heroicons_outline:chart-pie',
//     link: '/example',
//   },
// ];
// export const horizontalNavigation: FuseNavigationItem[] = [
//   {
//     id: 'example',
//     title: 'Example',
//     type: 'basic',
//     icon: 'heroicons_outline:chart-pie',
//     link: '/example',
//   },
// ];
