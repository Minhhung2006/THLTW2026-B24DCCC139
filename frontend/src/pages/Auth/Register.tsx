import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import { history } from '@umijs/max';
import axios from 'axios';

export default () => {
  const handleSubmit = async (values: any) => {
    try {
      const apiUrl = `http://${window.location.hostname}:5000/api/auth/register`;
      await axios.post(apiUrl, values);
      message.success('Đăng ký thành công, vui lòng đăng nhập!');
      history.push('/login');
    } catch (error) {
      message.error('Đăng ký thất bại, email có thể đã tồn tại!');
    }
  };

  return (
    <div style={{ backgroundColor: 'white', height: '100vh', display: 'flex', alignItems: 'center' }}>
      <LoginForm
        title="Đăng Ký Tài Khoản"
        subTitle="Tham gia hệ thống quản lý giải đấu"
        onFinish={handleSubmit}
        submitter={{ searchConfig: { submitText: 'Đăng ký' } }}
      >
        <ProFormText
          name="full_name"
          fieldProps={{
            size: 'large',
            prefix: '👤',
          }}
          placeholder="Họ và tên"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
        />
        <ProFormText
          name="email"
          fieldProps={{
            size: 'large',
            prefix: '✉️',
          }}
          placeholder="Email"
          rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: 'large',
            prefix: '🔒',
          }}
          placeholder="Mật khẩu"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        />
        <div style={{ marginBlockEnd: 24, textAlign: 'center' }}>
          <a onClick={() => history.push('/login')}>Đã có tài khoản? Đăng nhập ngay</a>
        </div>
      </LoginForm>
    </div>
  );
};
