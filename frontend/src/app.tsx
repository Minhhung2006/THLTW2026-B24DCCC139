import { Dropdown } from 'antd';
import { LogoutOutlined, LoginOutlined } from '@ant-design/icons';
import { history, RequestConfig } from '@umijs/max';

export const request: RequestConfig = {
  baseURL: `http://localhost:5000`, 
  timeout: 10000,
  requestInterceptors: [
    (url, options) => {
      const token = localStorage.getItem('token');
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      return { url, options };
    },
  ],
};

import NotificationBell from '@/components/NotificationBell';

export async function getInitialState(): Promise<{
  name: string;
  role: string;
}> {
  const token = localStorage.getItem('token');

  if (token) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return {
      name: user.full_name || 'User',
      role: user.role || 'USER',
    };
  }

  return {
    name: '',
    role: '',
  };
}


export const layout = ({
  initialState,
}: {
  initialState: any;
}) => {
  return {
    onPageChange: () => {
      const token = localStorage.getItem('token');
      const location = window.location;
      
      const publicRoutes = ['/login', '/register', '/'];

      if (!token && !publicRoutes.includes(location.pathname)) {
        window.location.href = '/login';
      }
    },
    logo: 'https://cdn-icons-png.flaticon.com/512/8202/8202476.png', // A nicer esports icon

    title: 'Esport Hub',

    menu: {
      locale: false,
    },

    layout: 'side',
    navTheme: 'realDark',
    contentWidth: 'Fluid',
    fixedHeader: true,
    fixSiderbar: true,

    token: {
      bgLayout: '#151322', // Main content background
      sider: {
        colorMenuBackground: '#13111C', // Sidebar background
        colorTextMenuTitle: '#fff',
        colorTextMenu: 'rgba(255, 255, 255, 0.65)',
        colorTextMenuSelected: '#fff',
        colorBgMenuItemSelected: '#2F2356', // Purple selection
      },
      header: {
        colorBgHeader: '#151322', // Header background
        colorTextMenu: 'rgba(255, 255, 255, 0.85)',
      },
    },

    avatarProps: {
      title: initialState?.role === 'ADMIN' ? 'Admin' : (initialState?.name || 'User'),
      render: (_: any, avatarChildren: any) => {
        const isLoggedIn = !!initialState?.name;
        
        const menuItems = isLoggedIn
          ? [
              {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: 'Đăng xuất',
              },
            ]
          : [
              {
                key: 'login',
                icon: <LoginOutlined />,
                label: 'Đăng nhập',
              },
            ];

        return (
          <Dropdown
            menu={{
              items: menuItems,
              onClick: ({ key }) => {
                if (key === 'logout') {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  window.location.href = '/';
                } else if (key === 'login') {
                  window.location.href = '/login';
                }
              },
            }}
          >
            {avatarChildren}
          </Dropdown>
        );
      },
    },

    rightContentRender: () => (
      <div style={{ display: 'flex', alignItems: 'center', paddingRight: 24 }}>
        <NotificationBell />
      </div>
    ),
  };
};