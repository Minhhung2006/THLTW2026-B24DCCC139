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
		path: '/th03',
		name: 'TH03 - Đặt lịch dịch vụ',
		icon: 'CalendarOutlined',
		routes: [
			{
			path: '/th03/staff-service',
			name: 'Nhân viên & Dịch vụ',
			component: './th03/StaffService',
			},
			{
			path: '/th03/appointment',
			name: 'Quản lý lịch hẹn',
			component: './th03/Appointment',
			},
			{
			path: '/th03/review',
			name: 'Đánh giá',
			component: './th03/Review',
			},
			{
			path: '/th03/report',
			name: 'Thống kê',
			component: './th03/Report',
			},
		],
    },
];