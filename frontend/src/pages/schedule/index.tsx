import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const SchedulePage: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <Title level={2}>Đây là trang lịch thi đấu</Title>
      </Card>
    </PageContainer>
  );
};

export default SchedulePage;
