import { Table, Tag } from 'antd';
import { useEffect, useState } from 'react';

const initProducts = [
  { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop', price: 25000000, quantity: 15 },
  { id: 2, name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: 30000000, quantity: 8 },
  { id: 3, name: 'Samsung Galaxy S24', category: 'Điện thoại', price: 22000000, quantity: 20 },
  { id: 4, name: 'iPad Air M2', category: 'Máy tính bảng', price: 18000000, quantity: 5 },
  { id: 5, name: 'MacBook Air M3', category: 'Laptop', price: 28000000, quantity: 12 },
];

export default function ProductManager() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('products');
    if (!data) {
      localStorage.setItem('products', JSON.stringify(initProducts));
      setProducts(initProducts);
    } else {
      setProducts(JSON.parse(data));
    }
  }, []);

  const getStatus = (qty: number) => {
    if (qty === 0) return <Tag color="red">Hết hàng</Tag>;
    if (qty <= 10) return <Tag color="orange">Sắp hết</Tag>;
    return <Tag color="green">Còn hàng</Tag>;
  };

  return (
    <Table
      rowKey="id"
      pagination={{ pageSize: 5 }}
      dataSource={products}
      columns={[
        { title: 'STT', render: (_, __, i) => i + 1 },
        { title: 'Tên sản phẩm', dataIndex: 'name' },
        { title: 'Danh mục', dataIndex: 'category' },
        { title: 'Giá', dataIndex: 'price' },
        { title: 'Tồn kho', dataIndex: 'quantity' },
        {
          title: 'Trạng thái',
          render: (_, r) => getStatus(r.quantity),
        },
      ]}
    />
  );
}
