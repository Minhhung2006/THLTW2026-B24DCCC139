import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  message,
  Row,
  Col
} from 'antd'
import { useEffect, useState } from 'react'
import { UploadOutlined } from '@ant-design/icons'

export default function Admin() {
  const [list, setList] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form] = Form.useForm()

  const [stats, setStats] = useState<any>({
    totalMoney: 0,
    byCategory: { food: 0, transport: 0, hotel: 0 },
    top: []
  })

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('destinations') || '[]')
    setList(data)

    calcStats()
  }, [])

  const save = (data: any[]) => {
    setList(data)
    localStorage.setItem('destinations', JSON.stringify(data))
  }

  const onFinish = (values: any) => {
    const newItem = {
      ...values,
      id: editing ? editing.id : Date.now()
    }

    if (editing) {
      save(list.map(i => (i.id === editing.id ? newItem : i)))
      message.success('Cập nhật thành công')
    } else {
      save([...list, newItem])
      message.success('Thêm thành công')
    }

    setOpen(false)
    setEditing(null)
    form.resetFields()
  }

  const remove = (id: number) => {
    save(list.filter(i => i.id !== id))
    message.success('Đã xóa')
  }

  const edit = (record: any) => {
    setEditing(record)
    form.setFieldsValue(record)
    setOpen(true)
  }

  const toBase64 = (file: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })

  const handleUpload = async (file: any) => {
    const base64 = await toBase64(file)
    form.setFieldsValue({ img: base64 })
    return false
  }

  const calcStats = () => {
    const trip = JSON.parse(localStorage.getItem('trip') || '[]')

    let totalMoney = 0
    let food = 0
    let transport = 0
    let hotel = 0

    const map: any = {}

    trip.forEach((i: any) => {
      totalMoney += i.price || 0

      food += i.price * 0.3
      transport += i.price * 0.3
      hotel += i.price * 0.4

      map[i.name] = (map[i.name] || 0) + 1
    })

    const top = Object.keys(map).map(k => ({
      name: k,
      count: map[k]
    })).sort((a, b) => b.count - a.count)

    setStats({
      totalMoney,
      byCategory: { food, transport, hotel },
      top
    })
  }

  const columns = [
    { title: 'Tên', dataIndex: 'name' },
    { title: 'Loại', dataIndex: 'type' },
    { title: 'Giá', dataIndex: 'price' },
    { title: 'Rating', dataIndex: 'rating' },
    {
      title: 'Ảnh',
      render: (_: any, r: any) => (
        <img src={r.img} style={{ width: 60, height: 40 }} />
      )
    },
    {
      title: 'Action',
      render: (_: any, r: any) => (
        <>
          <Button onClick={() => edit(r)}>Sửa</Button>{' '}
          <Button danger onClick={() => remove(r.id)}>Xóa</Button>
        </>
      )
    }
  ]

  return (
    <div style={{ padding: 20 }}>

      <h2>⚙️ Admin - Quản lý điểm đến</h2>

      <Button type="primary" onClick={() => setOpen(true)}>
        Thêm điểm đến
      </Button>

      <Table
        style={{ marginTop: 20 }}
        dataSource={list}
        columns={columns}
        rowKey="id"
      />

      {/* MODAL */}
      <Modal
        title="Điểm đến"
        visible={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>

          <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="type" label="Loại">
            <Select>
              <Select.Option value="biển">Biển</Select.Option>
              <Select.Option value="núi">Núi</Select.Option>
              <Select.Option value="thành phố">Thành phố</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="price" label="Giá">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="rating" label="Rating">
            <InputNumber min={1} max={5} step={0.5} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="desc" label="Mô tả">
            <Input.TextArea />
          </Form.Item>

          <Form.Item name="time" label="Thời gian tham quan (giờ)">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="img" label="Ảnh">
            <Upload beforeUpload={handleUpload} showUploadList={false}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>

        </Form>
      </Modal>

      {/* STATS */}
      <Card style={{ marginTop: 30 }}>
        <h3>📊 Thống kê</h3>

        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <h4>Tổng tiền</h4>
              <h2>{stats.totalMoney}$</h2>
            </Card>
          </Col>

          <Col span={8}>
            <Card>
              <h4>Ăn uống</h4>
              <h2>{Math.round(stats.byCategory.food)}$</h2>
            </Card>
          </Col>

          <Col span={8}>
            <Card>
              <h4>Lưu trú</h4>
              <h2>{Math.round(stats.byCategory.hotel)}$</h2>
            </Card>
          </Col>
        </Row>

        <h4 style={{ marginTop: 20 }}>🔥 Top địa điểm</h4>
        {stats.top.map((i: any, idx: number) => (
          <p key={idx}>
            {i.name} - {i.count} lần
          </p>
        ))}
      </Card>

    </div>
  )
}