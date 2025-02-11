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
    id: 'blog',
    title: 'Blog',
    type: 'basic',
    icon: 'heroicons_outline:shield-check',
    link: '/blog',
    children: [
      {
        id: 'blog-create',
        title: 'Create',
        type: 'basic',
        link: '/blog/create',
      },
    ],
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
