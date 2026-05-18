import React from 'react';
// Thay thế @ant-design/pro-components bằng @ant-design/pro-layout
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  return (
    <PageContainer title="Bảng điều khiển Admin">
      <Card>
        <Title level={4}>Chào mừng đến với hệ thống quản trị</Title>
        <p>Đây là nơi hiển thị các số liệu thống kê của giải đấu.</p>
      </Card>
    </PageContainer>
  );
};

export default Dashboard;
