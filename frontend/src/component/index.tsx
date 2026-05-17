import React, { useState } from 'react';
import { Badge, Popover, List, Button } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

const NotificationBell = () => {
  const [open, setOpen] = useState(false);

  // Router history
  const history = useHistory();

  // Danh sách thông báo
  const notifications = [
    {
      id: 1,
      title: 'Bạn có đơn hàng mới',
      time: '5 phút trước',
    },
    {
      id: 2,
      title: 'Khách hàng đã thanh toán',
      time: '10 phút trước',
    },
  ];

  // Nội dung popup thông báo
  const content = (
    <div style={{ width: 300 }}>
      <List
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item
            style={{ cursor: 'pointer' }}
            onClick={() => {
              window.location.href = '/notifications';
            }}
          >
            <List.Item.Meta
              title={item.title}
              description={item.time}
            />
          </List.Item>
        )}
      />

      <Button
        type="link"
        block
        onClick={() => {
          window.location.href = '/notifications';
        }}
      >
        Xem tất cả
      </Button>
    </div>
  );

  return (
    <div>
      <Popover
        content={content}
        title="Thông báo"
        trigger="click"
        placement="bottomRight"
        visible={open}
        onVisibleChange={(visible: boolean) => {
          setOpen(visible);
        }}
      >
        <Badge count={notifications.length}>
          <BellOutlined
            style={{
              fontSize: 24,
              cursor: 'pointer',
              color: '#fff',
            }}
          />
        </Badge>
      </Popover>
    </div>
  );
};

export default NotificationBell;