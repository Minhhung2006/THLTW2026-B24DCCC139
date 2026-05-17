export default [
  { path: '/', component: 'index', name: 'Trang chủ' },
  { path: '/tournaments', component: 'TourmentList', name: 'Giải đấu' },
  { path: '/login', component: 'Auth/Login', layout: false },
  { path: '/register', component: 'Auth/Register', layout: false },
  {
    path: '/admin',
    name: 'Admin',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/dashboard' },
      { path: '/admin/dashboard', component: 'Admin/Dashboard', name: 'Dashboard' },
    ],
  },
];
