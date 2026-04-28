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

	///////////////////////////////////
	// NOTIFICATION (ĐÃ FIX PATH)
	{
		path: '/notification',
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
		layout: false,
		hideInMenu: true,
	},

	///////////////////////////////////
	// TH08 - FITNESS APP
	{
		path: '/th08',
		name: 'Fitness',
		icon: 'DashboardOutlined',
		routes: [
			{
				path: '/th08/dashboard',
				name: 'Dashboard',
				component: './th08/Dashboard',
			},
			{
				path: '/th08/workout',
				name: 'Nhật ký tập',
				component: './th08/WorkoutLog',
			},
			{
				path: '/th08/health',
				name: 'Chỉ số sức khỏe',
				component: './th08/HealthLog',
			},
			{
				path: '/th08/goals',
				name: 'Mục tiêu',
				component: './th08/Goals',
			},
			{
				path: '/th08/exercises',
				name: 'Thư viện bài tập',
				component: './th08/ExerciseLibrary',
			},
			{
				path: '/th08',
				redirect: '/th08/dashboard',
			},
		],
	},
];