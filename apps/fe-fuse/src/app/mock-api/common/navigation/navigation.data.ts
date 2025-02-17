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
];

//*********** adminNavigation là route cho ADMIN *************/
export const adminNavigation: FuseNavigationItem[] = [
  {
    id: 'home',
    title: 'Home',
    type: 'basic',
    icon: 'heroicons_outline:home',
    link: '/home',
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
    id: 'blog',
    title: 'Blog',
    type: 'basic',
    icon: 'heroicons_outline:pencil-square',
    link: 'admin/blog',
    children: [
      {
        id: 'blog-create',
        title: 'Create',
        type: 'basic',
        link: 'admin/blog/create',
      },
    ],
  },
  {
    id: 'hospital',
    title: 'Hospital',
    type: 'basic',
    icon: 'heroicons_outline:building-office',
    link: 'admin/hospital',
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
    icon: 'heroicons_outline:user-group',
    link: 'admin/category',
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
