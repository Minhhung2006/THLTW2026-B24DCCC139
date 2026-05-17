// 1. Import cái chuông bạn đã tạo
import NotificationBell from '@/component/index';

// Global initialization
export async function getInitialState(): Promise<{
  name: string;
  role: string;
}> {
  const token = localStorage.getItem('token');

  if (token) {
    const user = JSON.parse(
      localStorage.getItem('user') || '{}',
    );

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

// Layout config
export const layout = ({
  initialState,
}: {
  initialState: any;
}) => {
  return {
    // Logo hệ thống
    logo:
      'https://static.vecteezy.com/system/resources/thumbnails/017/068/883/small/dark-ninja-mascot-logo-for-team-esport-gaming-vector.jpg',

    // Tắt đa ngôn ngữ menu
    menu: {
      locale: false,
    },

    // --- THÊM DÒNG NÀY ĐỂ HIỆN CHUÔNG ---
    rightContentRender: () => (
      <div style={{ display: 'flex', alignItems: 'center', paddingRight: 24 }}>
        <NotificationBell />
      </div>
    ),
    // ------------------------------------

    // Logout
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Chuyển về login
      window.location.href = '/login';
    },
  };
};