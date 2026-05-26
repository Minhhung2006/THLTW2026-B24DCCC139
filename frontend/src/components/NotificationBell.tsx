import React, { useState, useEffect } from 'react';
import { Badge, Popover, List, Button } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useNavigate } from '@umijs/max';
import { getMyNotifications, getUnreadCount, markAsRead } from '@/services/notification';

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showAll, setShowAll] = useState(false);

  // Router history
  const navigate = useNavigate();

  const fetchNotifications = async (isAll = showAll) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const [unreadRes, listRes] = await Promise.all([
        getUnreadCount(),
        getMyNotifications({ page: 1, limit: isAll ? 50 : 5 }) // fetch more if showAll is true
      ]);

      if (unreadRes.success) setUnreadCount(unreadRes.data.count);
      if (listRes.success) setNotifications(listRes.data.data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Optional: Auto refresh every 30 seconds
    const interval = setInterval(() => fetchNotifications(showAll), 30000);
    return () => clearInterval(interval);
  }, [showAll]);

  const handleNotificationClick = async (item: any) => {
    if (!item.isRead) {
      try {
        await markAsRead(item.id);
        fetchNotifications();
      } catch (error) {
        console.error("Failed to mark notification as read", error);
      }
    }
    navigate('/manage-registrations');
    setOpen(false);
  };

  // Nội dung popup thông báo
  const content = (
    <div style={{ width: 320, maxHeight: 400, overflowY: 'auto' }}>
      <List
        dataSource={notifications}
        locale={{ emptyText: "Không có thông báo nào" }}
        renderItem={(item) => (
          <List.Item
            style={{ 
              cursor: 'pointer',
              backgroundColor: item.isRead ? 'transparent' : '#e6f7ff',
              padding: '12px 16px',
              borderBottom: '1px solid #f0f0f0'
            }}
            onClick={() => handleNotificationClick(item)}
          >
            <List.Item.Meta
              title={<span style={{ fontWeight: item.isRead ? 'normal' : 'bold' }}>{item.title}</span>}
              description={
                <div>
                  <div style={{ color: '#595959', fontSize: 13, marginBottom: 4 }}>{item.message}</div>
                  <div style={{ color: '#bfbfbf', fontSize: 12 }}>{new Date(item.createdAt).toLocaleString('vi-VN')}</div>
                </div>
              }
            />
          </List.Item>
        )}
      />

      <Button
        type="link"
        block
        onClick={() => {
          setShowAll(!showAll);
        }}
      >
        {showAll ? 'Thu gọn' : 'Xem tất cả'}
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
        open={open}
        onOpenChange={(visible: boolean) => {
          setOpen(visible);
          if (visible) {
            fetchNotifications(); // Refresh when opening
          }
        }}
      >
        <Badge count={unreadCount}>
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