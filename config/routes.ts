export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user/login',
        layout: false,
        name: 'login',
        component: './user/Login',
      },
      {
        path: '/user',
        redirect: '/user/login',
      },
    ],
  },


  {
    path: '/dashboard',
    name: 'Dashboard',
    component: './TrangChu',
    icon: 'HomeOutlined',
  },
  {
    path: '/gioi-thieu',
    name: 'About',
    component: './TienIch/GioiThieu',
    hideInMenu: true,
  },
  {
    path: '/random-user',
    name: 'RandomUser',
    component: './RandomUser',
    icon: 'ArrowsAltOutlined',
  },
  {
    path: '/todo-list',
    name: 'TodoList',
    icon: 'OrderedListOutlined',
    component: './TodoList',
  },


  {
    path: '/th01',
    name: 'TH01',
    routes: [
      {
        path: '/th01/bai1',
        name: 'Bài 1 - Đoán số',
        component: './th01/Bai1',
      },
      {
        path: '/th01/bai2',
        name: 'Bài 2 - Quản lý học tập',
        component: './th01/Bai2',
      },
    ],
  },


  {
    path: '/notification',
    layout: false,
    hideInMenu: true,
    routes: [
      {
        path: '/notification/subscribe',
        exact: true,
        component: './ThongBao/Subscribe',
      },
      {
        path: '/notification/check',
        exact: true,
        component: './ThongBao/Check',
      },
      {
        path: '/notification',
        exact: true,
        component: './ThongBao/NotifOneSignal',
      },
    ],
  },


  {
    path: '/',
    redirect: '/dashboard',
  },

  {
    path: '/403',
    component: './exception/403/403Page',
    layout: false,
  },
  {
    path: '/hold-on',
    component: './exception/DangCapNhat',
    layout: false,
  },

  {
    component: './exception/404',
  },
];