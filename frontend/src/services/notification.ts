import request from 'umi-request';
// 1. Lấy danh sách thông báo (phân trang)
export async function getMyNotifications(params: { page: number; limit: number; status?: string }) {
  return request('/api/notifications/my', {
    method: 'GET',
    params,
  });
}

// 2. Lấy số lượng chưa đọc
export async function getUnreadCount() {
  return request('/api/notifications/unread-count', {
    method: 'GET',
  });
}

// 3. Đánh dấu 1 thông báo đã đọc
export async function markAsRead(id: number) {
  return request(`/api/notifications/${id}/read`, {
    method: 'PATCH',
  });
}

// 4. Đánh dấu tất cả đã đọc
export async function markAllAsRead() {
  return request('/api/notifications/read-all', {
    method: 'PATCH',
  });
}