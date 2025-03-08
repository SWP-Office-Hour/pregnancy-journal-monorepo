/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

//*********** defaultNavigation là định tuyến cho tất cả mọi người, KHÁCH, QUẢN TRỊ VIÊN, THÀNH VIÊN *************/
export const defaultNavigation: FuseNavigationItem[] = [
  {
    id: 'home',
    title: 'Trang chủ',
    type: 'basic',
    icon: 'heroicons_outline:home',
    link: '/home',
  },
  // Nhóm tính năng theo dõi sức khỏe
  {
    id: 'health-tracking',
    title: 'Theo dõi sức khỏe',
    type: 'collapsable',
    icon: 'heroicons_outline:chart-bar',
    children: [
      {
        id: 'tracking',
        title: 'Theo dõi',
        type: 'basic',
        icon: 'heroicons_outline:chart-bar',
        link: '/tracking',
      },
      {
        id: 'calendar',
        title: 'Lịch',
        type: 'basic',
        icon: 'heroicons_outline:calendar',
        link: '/calendar',
      },
    ],
  },
  // Nhóm nội dung cộng đồng
  {
    id: 'content-community',
    title: 'Cộng đồng & Nội dung',
    type: 'collapsable',
    icon: 'heroicons_outline:user-group',
    children: [
      {
        id: 'blog',
        title: 'Blog',
        type: 'basic',
        icon: 'heroicons_outline:pencil-square',
        link: '/blog',
      },
      {
        id: 'community',
        title: 'Cộng đồng',
        type: 'basic',
        icon: 'heroicons_outline:user-group',
        link: '/community',
      },
    ],
  },
  // Nhóm thông tin
  {
    id: 'info-group',
    title: 'Thông tin',
    type: 'collapsable',
    icon: 'heroicons_outline:information-circle',
    children: [
      {
        id: 'pricing',
        title: 'Bảng giá',
        type: 'basic',
        icon: 'heroicons_outline:currency-dollar',
        link: '/membership',
      },
      {
        id: 'about',
        title: 'Giới thiệu',
        type: 'basic',
        icon: 'heroicons_outline:information-circle',
        link: '/about',
      },
    ],
  },
];

//*********** adminNavigation là định tuyến cho QUẢN TRỊ VIÊN *************/
export const adminNavigation: FuseNavigationItem[] = [
  {
    id: 'home',
    title: 'Trang chủ',
    type: 'basic',
    icon: 'heroicons_outline:home',
    link: '/admin',
  },
  // Nhóm quản lý sức khỏe
  {
    id: 'health-management',
    title: 'Quản lý sức khỏe',
    type: 'collapsable',
    icon: 'heroicons_outline:chart-bar',
    children: [
      {
        id: 'health-metric',
        title: 'Chỉ số sức khỏe',
        type: 'basic',
        icon: 'heroicons_outline:chart-bar',
        link: 'admin/health-metric',
      },
      {
        id: 'hospital',
        title: 'Bệnh viện',
        type: 'basic',
        icon: 'heroicons_outline:building-office',
        link: 'admin/hospital',
      },
    ],
  },
  // Nhóm quản lý nội dung
  {
    id: 'content-management',
    title: 'Quản lý nội dung',
    type: 'collapsable',
    icon: 'heroicons_outline:pencil-square',
    children: [
      {
        id: 'admin_blog',
        title: 'Blog',
        type: 'aside',
        icon: 'heroicons_outline:pencil-square',
        link: 'admin/blog',
        children: [
          {
            id: 'blog-all',
            title: 'Tất cả',
            type: 'basic',
            link: 'admin/blog',
            icon: 'heroicons_outline:pencil-square',
          },
          {
            id: 'blog-create',
            title: 'Tạo mới',
            type: 'basic',
            link: 'admin/blog/create',
            icon: 'heroicons_outline:pencil-square',
          },
        ],
      },
      {
        id: 'category',
        title: 'Danh mục',
        type: 'basic',
        icon: 'heroicons_outline:list-bullet',
        link: 'admin/category',
      },
      {
        id: 'tag',
        title: 'Thẻ',
        type: 'basic',
        icon: 'heroicons_outline:tag',
        link: 'admin/tag',
      },
    ],
  },
  // Nhóm quản lý người dùng
  {
    id: 'user-management',
    title: 'Quản lý người dùng',
    type: 'collapsable',
    icon: 'heroicons_outline:user-group',
    children: [
      {
        id: 'membership',
        title: 'Tư cách thành viên',
        type: 'basic',
        icon: 'heroicons_outline:identification',
        link: 'admin/membership',
      },
      {
        id: 'users',
        title: 'Người dùng',
        type: 'basic',
        icon: 'heroicons_outline:user-group',
        link: 'admin/users',
      },
    ],
  },
  {
    id: 'payment',
    title: 'Payment History',
    type: 'basic',
    icon: 'heroicons_outline:credit-card',
    link: 'admin/payment',
  },
];

export const landingNavigation: FuseNavigationItem[] = [
  {
    id: 'sign-in',
    title: 'Đăng nhập',
    type: 'basic',
    icon: 'heroicons_outline:identification',
    link: '/sign-in',
  },
  // Nhóm nội dung
  {
    id: 'landing-content',
    title: 'Nội dung',
    type: 'collapsable',
    icon: 'heroicons_outline:pencil-square',
    children: [
      {
        id: 'blog',
        title: 'Blog',
        type: 'basic',
        icon: 'heroicons_outline:pencil-square',
        link: '/blog',
      },
      {
        id: 'features',
        title: 'Tính năng',
        type: 'basic',
        icon: 'heroicons_outline:sparkles',
        link: '/features',
      },
    ],
  },
  // Nhóm thông tin
  {
    id: 'landing-info',
    title: 'Thông tin',
    type: 'collapsable',
    icon: 'heroicons_outline:information-circle',
    children: [
      {
        id: 'about',
        title: 'Về chúng tôi',
        type: 'basic',
        icon: 'heroicons_outline:information-circle',
        link: '/about',
      },
      {
        id: 'pricing',
        title: 'Bảng giá',
        type: 'basic',
        icon: 'heroicons_outline:currency-dollar',
        link: '/membership',
      },
      {
        id: 'contact',
        title: 'Liên hệ',
        type: 'basic',
        icon: 'heroicons_outline:envelope',
        link: '/contact',
      },
    ],
  },
];
