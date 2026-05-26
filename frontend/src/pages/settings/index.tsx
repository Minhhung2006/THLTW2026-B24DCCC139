import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Typography, Row, Col, Avatar, Button, Form, Input, Switch, Divider, message, Popconfirm, Upload } from 'antd';
import { UserOutlined, UploadOutlined, DeleteOutlined, LockOutlined, BulbOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useModel } from '@umijs/max';
import './settings.css';

const { Title, Text } = Typography;

const SettingsPage: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [form] = Form.useForm();
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Mock functions for APIs that aren't implemented yet
  const handleChangePassword = (values: any) => {
    console.log('Password values:', values);
    message.info('Tính năng đổi mật khẩu đang được phát triển.');
    form.resetFields();
  };

  const handleDeleteAccount = () => {
    message.info('Tính năng xóa tài khoản đang được phát triển.');
  };

  const handleUploadAvatar = (info: any) => {
    if (info.file.status === 'done' || info.file.status === 'uploading') {
      message.info('Tính năng tải ảnh đại diện đang được phát triển.');
    }
  };

  return (
    <PageContainer title="Cài Đặt Tài Khoản">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Row gutter={[24, 24]}>
          {/* Left Column: Profile & Account */}
          <Col xs={24} md={10} lg={8}>
            <Card title="Hồ sơ của bạn" className="settings-card" bordered={false}>
              <div className="avatar-container">
                <div className="avatar-wrapper">
                  <Avatar 
                    size={120} 
                    icon={<UserOutlined />} 
                    src={initialState?.avatar}
                  />
                </div>
                <Title level={4} style={{ margin: 0 }}>
                  {initialState?.name || 'Người dùng'}
                </Title>
                <Text type="secondary" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 24 }}>
                  Vai trò: {initialState?.role === 'ADMIN' ? 'Quản trị viên' : 'Thành viên'}
                </Text>

                <Upload showUploadList={false} customRequest={handleUploadAvatar}>
                  <Button type="primary" icon={<UploadOutlined />} style={{ marginBottom: 32 }}>
                    Thay đổi ảnh đại diện
                  </Button>
                </Upload>
              </div>

              <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

              <div style={{ marginTop: 16 }}>
                <Title level={5} style={{ color: '#ff4d4f' }}>Khu vực nguy hiểm</Title>
                <Text style={{ color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 16 }}>
                  Hành động này sẽ xóa vĩnh viễn tài khoản của bạn và không thể khôi phục.
                </Text>
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa tài khoản?"
                  description="Mọi dữ liệu của bạn sẽ bị xóa vĩnh viễn."
                  onConfirm={handleDeleteAccount}
                  okText="Xóa vĩnh viễn"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true }}
                >
                  <Button danger className="btn-danger" icon={<DeleteOutlined />} block>
                    Tự xóa tài khoản
                  </Button>
                </Popconfirm>
              </div>
            </Card>
          </Col>

          {/* Right Column: Preferences & Security */}
          <Col xs={24} md={14} lg={16}>
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Card title="Bảo mật" className="settings-card" bordered={false}>
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleChangePassword}
                    style={{ maxWidth: 400 }}
                  >
                    <Form.Item
                      label="Mật khẩu hiện tại"
                      name="currentPassword"
                      rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
                    >
                      <Input.Password prefix={<LockOutlined style={{ color: 'rgba(255,255,255,0.4)' }}/>} placeholder="Nhập mật khẩu hiện tại" />
                    </Form.Item>

                    <Form.Item
                      label="Mật khẩu mới"
                      name="newPassword"
                      rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }, { min: 6, message: 'Mật khẩu phải từ 6 ký tự' }]}
                    >
                      <Input.Password prefix={<LockOutlined style={{ color: 'rgba(255,255,255,0.4)' }}/>} placeholder="Nhập mật khẩu mới" />
                    </Form.Item>

                    <Form.Item
                      label="Xác nhận mật khẩu mới"
                      name="confirmPassword"
                      dependencies={['newPassword']}
                      rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('newPassword') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                          },
                        }),
                      ]}
                    >
                      <Input.Password prefix={<LockOutlined style={{ color: 'rgba(255,255,255,0.4)' }}/>} placeholder="Xác nhận mật khẩu mới" />
                    </Form.Item>

                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        Lưu mật khẩu mới
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>

              <Col span={24}>
                <Card title="Giao diện (Theme)" className="settings-card" bordered={false}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <Title level={5} style={{ margin: 0 }}>Chế độ tối (Dark Mode)</Title>
                      <Text style={{ color: 'rgba(255,255,255,0.6)' }}>
                        Sử dụng giao diện tối màu giúp bảo vệ mắt vào ban đêm.
                      </Text>
                    </div>
                    <Switch
                      checkedChildren={<BulbOutlined />}
                      unCheckedChildren={<BulbOutlined />}
                      checked={isDarkMode}
                      onChange={(checked) => {
                        setIsDarkMode(checked);
                        message.info('Tính năng chuyển đổi giao diện đang được phát triển.');
                      }}
                    />
                  </div>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </motion.div>
    </PageContainer>
  );
};

export default SettingsPage;
