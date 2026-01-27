import { Table, Select } from 'antd';
import { useEffect, useState } from 'react';

const initOrders = [
  {
    id: 'DH001',
    customerName: 'Nguyễn Văn A',
    totalAmount: 25000000,
    status: 'Chờ xử lý',
    createdAt: '2024-01-15',
  },
];

export default function OrderManager() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('orders');
    if (!data) {
      localStorage.setItem('orders', JSON.stringify(initOrders));
      setOrders(initOrders);
    } else {
      setOrders(JSON.parse(data));
    }
  }, []);

  const updateStatus = (id: string, status: string) => {
    const newOrders = orders.map(o =>
      o.id === id ? { ...o, status } : o,
    );
    setOrders(newOrders);
    localStorage.setItem('orders', JSON.stringify(newOrders));
  };

  return (
    <Table
      rowKey="id"
      dataSource={orders}
      columns={[
        { title: 'Mã đơn', dataIndex: 'id' },
        { title: 'Khách hàng', dataIndex: 'customerName' },
        { title: 'Tổng tiền', dataIndex: 'totalAmount' },
        {
          title: 'Trạng thái',
          render: (_, r) => (
            <Select
              value={r.status}
              onChange={v => updateStatus(r.id, v)}
              options={[
                { value: 'Chờ xử lý' },
                { value: 'Đang giao' },
                { value: 'Hoàn thành' },
                { value: 'Đã hủy' },
              ]}
            />
          ),
        },
        { title: 'Ngày tạo', dataIndex: 'createdAt' },
      ]}
    />
  );
}
