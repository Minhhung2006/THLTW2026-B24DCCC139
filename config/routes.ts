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
	// NOTIFICATION
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
	// TH09
	{
		path: '/th09',
		name: 'Kanban',
		icon: 'ProjectOutlined',
		routes: [
			{
				path: '/th09/dashboard',
				name: 'Dashboard',
				component: './th09/Dashboard',
			},
			{
				path: '/th09/board',
				name: 'Kanban Board',
				component: './th09/KanbanBoard',
			},
			{
				path: '/th09/tasks',
				name: 'Danh sách task',
				component: './th09/TaskList', // ✅ FIX Ở ĐÂY
			},
			{
				path: '/th09',
				redirect: '/th09/dashboard',
			},
		],
	},

	///////////////////////////////////
	// ROOT
	{
		path: '/',
		redirect: '/dashboard',
	},
];