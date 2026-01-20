import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Popconfirm, message, Space } from 'antd';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const Bt1: React.FC = () => {
  const [data, setData] = useState<Product[]>([
    { id: 1, name: 'Laptop Dell XPS 13', price: 25000000, quantity: 10 },
    { id: 2, name: 'iPhone 15 Pro Max', price: 30000000, quantity: 15 },
    { id: 3, name: 'Samsung Galaxy S24', price: 22000000, quantity: 20 },
    { id: 4, name: 'iPad Air M2', price: 18000000, quantity: 12 },
    { id: 5, name: 'MacBook Air M3', price: 28000000, quantity: 8 },
  ]);

  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [form] = Form.useForm();

  const handleAdd = () => {
    form.validateFields().then(values => {
      const newProduct: Product = {
        id: Date.now(),
        name: values.name,
        price: values.price,
        quantity: values.quantity,
      };
      setData([...data, newProduct]);
      message.success('Thêm sản phẩm thành công');
      form.resetFields();
      setOpen(false);
    });
  };

  const handleDelete = (id: number) => {
    setData(data.filter(item => item.id !== id));
    message.success('Xóa sản phẩm thành công');
  };

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(keyword.toLowerCase()),
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
      render: (v: number) => v.toLocaleString('vi-VN'),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
    },
    {
      title: 'Thao tác',
      render: (_: any, record: Product) => (
        <Popconfirm title="Xóa sản phẩm?" onConfirm={() => handleDelete(record.id)}>
          <Button danger>Xóa</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm sản phẩm"
          onChange={e => setKeyword(e.target.value)}
          allowClear
        />
        <Button type="primary" onClick={() => setOpen(true)}>
          Thêm sản phẩm
        </Button>
      </Space>

      <Table rowKey="id" columns={columns} dataSource={filteredData} />

      <Modal
        title="Thêm sản phẩm"
        visible={open}
        onCancel={() => setOpen(false)}
        onOk={handleAdd}
        okText="Thêm"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá"
            rules={[{ required: true, type: 'number', min: 1 }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Số lượng"
            rules={[{ required: true, type: 'number', min: 1 }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Bt1;
