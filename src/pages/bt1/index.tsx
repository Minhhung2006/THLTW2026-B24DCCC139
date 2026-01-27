import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Popconfirm, message } from 'antd';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const Bt1: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Laptop Dell XPS 13', price: 25000000, quantity: 10 },
    { id: 2, name: 'iPhone 15 Pro Max', price: 30000000, quantity: 15 },
    { id: 3, name: 'Samsung Galaxy S24', price: 22000000, quantity: 20 },
    { id: 4, name: 'iPad Air M2', price: 18000000, quantity: 12 },
    { id: 5, name: 'MacBook Air M3', price: 28000000, quantity: 8 },
  ]);

  const [visible, setVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  const handleAdd = () => {
    form.validateFields().then(values => {
      const newProduct: Product = {
        id: Date.now(),
        name: values.name,
        price: values.price,
        quantity: values.quantity,
      };
      setProducts([...products, newProduct]);
      message.success('Thêm sản phẩm thành công');
      form.resetFields();
      setVisible(false);
    });
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter(item => item.id !== id));
    message.success('Xóa sản phẩm thành công');
  };

  const filteredProducts = products.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const columns = [
    {
      title: 'STT',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      render: (value: number) => value.toLocaleString('vi-VN'),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
    },
    {
      title: 'Thao tác',
      render: (_: any, record: Product) => (
        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDelete(record.id)}
        >
          <Button danger>Xóa</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm sản phẩm"
          style={{ width: 300, marginRight: 8 }}
          onChange={e => setSearchText(e.target.value)}
        />
        <Button type="primary" onClick={() => setVisible(true)}>
          Thêm sản phẩm
        </Button>
      </div>

      <Table rowKey="id" columns={columns} dataSource={filteredProducts} />

      <Modal
        title="Thêm sản phẩm"
        visible={visible}
        onOk={handleAdd}
        onCancel={() => setVisible(false)}
        okText="Thêm"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giá"
            name="price"
            rules={[{ required: true, type: 'number', min: 1 }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Số lượng"
            name="quantity"
            rules={[{ required: true, type: 'number', min: 1 }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Bt1;
