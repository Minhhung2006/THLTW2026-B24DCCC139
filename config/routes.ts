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
	// TH07 - BLOG
	{
  		path: '/th07',
  		name: 'Blog',
  		icon: 'ReadOutlined',
  		routes: [
    		{
      			path: '/th07/home',
      			name: 'Trang chủ',
      			component: './th07/Home',
    		},
    		{
      			path: '/th07/post/:slug',
      			component: './th07/PostDetail',
      			hideInMenu: true,
    		},
    		{
      			path: '/th07/about',
      			name: 'Giới thiệu',
      			component: './th07/About',
    		},
    		{
      			path: '/th07/manage',
      			name: 'Quản lý bài viết',
      			component: './th07/ManagePost',
    		},
    		{
      			path: '/th07/tags',
      			name: 'Quản lý thẻ',
      			component: './th07/ManageTag',
    		},
    		{
      			path: '/th07',
      			redirect: '/th07/home',
    		},
  		],
	}
];