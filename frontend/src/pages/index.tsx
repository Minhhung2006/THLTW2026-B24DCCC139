import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';

export default function HomePage() {
  return (
    <PageContainer title="Trang chủ">
      <div style={{ padding: '20px', background: '#fff', borderRadius: '8px' }}>
        Chào mừng bạn đến với nền tảng quản lý giải đấu thể thao điện tử
      </div>
    </PageContainer>
  );
}