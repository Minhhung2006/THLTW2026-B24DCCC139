import { Dropdown } from 'antd';
import { LogoutOutlined, LoginOutlined, FacebookOutlined, InstagramOutlined, GithubOutlined, MailOutlined } from '@ant-design/icons';
import { history, RequestConfig } from '@umijs/max';
import './global-bg.css';

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
  avatar?: string;
}> {
  const token = localStorage.getItem('token');

  if (token) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return {
      name: user.full_name || 'User',
      role: user.role || 'USER',
      avatar: user.avatar,
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

    layout: 'top',
    navTheme: 'realDark',
    contentWidth: 'Fluid',
    fixedHeader: true,

    token: {
      bgLayout: 'transparent', // Make layout transparent to see global background
      header: {
        colorBgHeader: 'rgba(21, 19, 34, 0.7)', // Glassmorphism header
        colorTextMenu: 'rgba(255, 255, 255, 0.85)',
        colorTextMenuSelected: '#fff',
        colorBgMenuItemSelected: '#2F2356', // Purple selection
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {isLoggedIn && <NotificationBell />}
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
          </div>
        );
      },
    },



    footerRender: () => (
      <div style={{ textAlign: 'center', padding: '24px 0', color: 'rgba(255, 255, 255, 0.65)' }}>
        <div style={{ marginBottom: 8 }}>
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', margin: '0 8px', fontSize: '20px' }}><FacebookOutlined /></a>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', margin: '0 8px', fontSize: '20px' }}><InstagramOutlined /></a>
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', margin: '0 8px', fontSize: '20px' }}><GithubOutlined /></a>
        </div>
        <div>
          <MailOutlined style={{ marginRight: 8 }} />
          <span>Liên hệ: huynew@gmail.com</span>
        </div>
      </div>
    ),
  };
};