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
		path: '/th04',
		name: 'TH04 - Văn bằng',
		icon: 'BookOutlined',
		routes: [
			{
				path: '/th04/so-van-bang',
				name: 'Sổ văn bằng',
				component: './th04/SoVanBang',
			},
			{
				path: '/th04/quyet-dinh',
				name: 'Quyết định tốt nghiệp',
				component: './th04/QuyetDinh',
			},
			{
				path: '/th04/bieu-mau',
				name: 'Cấu hình biểu mẫu',
				component: './th04/BieuMau',
			},
			{
				path: '/th04/van-bang',
				name: 'Thông tin văn bằng',
				component: './th04/VanBang',
			},
			{
				path: '/th04/tra-cuu',
				name: 'Tra cứu',
				component: './th04/TraCuu',
			},
		],
	}
];