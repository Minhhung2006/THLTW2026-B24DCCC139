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

	///////////////////////////////////
	// DEFAULT MENU
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
// DANH MUC HE THONG 
// { 
//     name: 'DanhMuc', 
//     path: '/danh-muc', 
//     icon: 'copy', 
//     routes: [ 
//         { 
//             name: 'ChucVu', 
//             path: 'chuc-vu', 
//             component: './DanhMuc/ChucVu', 
//         }, 
//     ], 
// },
	{
	    path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
  		path: '/th05',
		name: 'TH05 - CLB',
		routes: [
   			{
        		path: '/th05/club',
       			name: 'Quản lý CLB',
        		component: './th05/Club',
    		},
   			{
      			path: '/th05/registration',
      			name: 'Đơn đăng ký',
      			component: './th05/Registration',
    		},
    		{
      			path: '/th05/member',
      			name: 'Thành viên',
      			component: './th05/Member',
    		},
    		{
      			path: '/th05/report',
      			name: 'Thống kê',
      			component: './th05/Report',
    		},
  		],
	}
];