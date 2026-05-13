// Global initialization
export async function getInitialState() {
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
    logo: 'https://static.vecteezy.com/system/resources/thumbnails/017/068/883/small/dark-ninja-mascot-logo-for-team-esport-gaming-vector.jpg',

    title: 'Esport Tournament',

    menu: {
      locale: false,
    },

    avatarProps: {
      title: initialState?.name || 'Guest',
    },

    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      window.location.href = '/login';
    },
  };
};