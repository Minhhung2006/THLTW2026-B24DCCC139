import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const LeaderboardPage: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <Title level={2}>Đây là trang bảng xếp hạng</Title>
      </Card>
    </PageContainer>
  );
};

export default LeaderboardPage;
