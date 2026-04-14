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

	///////////////////////////////////
	// KTGK - COURSE (FIX CASE)
	{
  		path: '/ktgk',
  		name: 'Course',
  		icon: 'BookOutlined',
  		routes: [
    		{
      			path: '/ktgk/management',
      			name: 'Quản lý',
      			component: './ktgk/Management',
    		},
    		{
      			path: '/ktgk/editor',
      			name: 'Thêm / Sửa',
      			component: './ktgk/Editor',
    		},
    		{
      			path: '/ktgk/remove',
      			name: 'Xóa',
      			component: './ktgk/Remove',
    		},
    		{
      			path: '/ktgk',
      			redirect: '/ktgk/management',
    		},
  		],
	}
];