import { RunTimeLayoutConfig } from '@umijs/max';

// Global initialization
export async function getInitialState(): Promise<{ name: string; role: string }> {
  const token = localStorage.getItem('token');
  if (token) {
    // You could fetch user info from API here
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return { name: user.full_name || 'User', role: user.role || 'USER' };
  }
  return { name: '', role: '' };
}

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    logo: 'https://static.vecteezy.com/system/resources/thumbnails/017/068/883/small/dark-ninja-mascot-logo-for-team-esport-gaming-vector.jpg',
    menu: {
      locale: false,
    },
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    },
  };
};
