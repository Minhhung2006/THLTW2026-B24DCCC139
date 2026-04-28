import {
  Card,
  Button,
  Drawer,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Progress,
  Popconfirm,
  Row,
  Col,
  Space,
  Segmented,
  Tag
} from 'antd'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

export default function Goals() {
  const [data, setData] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('goals') || '[]')
    setData(saved)
  }, [])

  useEffect(() => {
    if (statusFilter === 'all') {
      setFiltered(data)
    } else {
      setFiltered(data.filter((g) => g.status === statusFilter))
    }
  }, [data, statusFilter])

  const saveData = (newData: any[]) => {
    setData(newData)
    localStorage.setItem('goals', JSON.stringify(newData))
  }

  const getPercent = (g: any) => {
    if (!g.target) return 0
    return Math.min((g.current / g.target) * 100, 100)
  }

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const newItem = {
        ...values,
        date: values.deadline.toISOString(),
        id: Date.now()
      }

      saveData([...data, newItem])
      setOpen(false)
      form.resetFields()
    })
  }

  const handleDelete = (id: number) => {
    saveData(data.filter((g) => g.id !== id))
  }

  // update current inline
  const updateCurrent = (id: number, value: number) => {
    const newData = data.map((g) =>
      g.id === id ? { ...g, current: value } : g
    )
    saveData(newData)
  }

  const getStatusTag = (s: string) => {
    if (s === 'doing') return <Tag color="blue">Đang thực hiện</Tag>
    if (s === 'done') return <Tag color="green">Đã đạt</Tag>
    return <Tag color="red">Đã hủy</Tag>
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>🎯 Quản lý mục tiêu</h2>

      {/* FILTER */}
      <Space style={{ marginBottom: 16 }}>
        <Segmented
          options={[
            { label: 'Tất cả', value: 'all' },
            { label: 'Đang làm', value: 'doing' },
            { label: 'Đã đạt', value: 'done' },
            { label: 'Hủy', value: 'cancel' }
          ]}
          onChange={(v) => setStatusFilter(v as string)}
        />

        <Button type="primary" onClick={() => setOpen(true)}>
          + Thêm mục tiêu
        </Button>
      </Space>

      {/* CARDS */}
      <Row gutter={[16, 16]}>
        {filtered.map((g) => (
          <Col span={8} key={g.id}>
            <Card
              title={g.name}
              extra={
                <Popconfirm
                  title="Xóa mục tiêu?"
                  onConfirm={() => handleDelete(g.id)}
                >
                  <Button danger size="small">
                    Xóa
                  </Button>
                </Popconfirm>
              }
            >
              <p>Loại: {g.type}</p>

              <p>
                Mục tiêu: {g.target} | Hiện tại:{' '}
                <InputNumber
                  value={g.current}
                  onChange={(v) =>
                    updateCurrent(g.id, v || 0)
                  }
                  size="small"
                />
              </p>

              <Progress percent={getPercent(g)} />

              <p>
                Deadline:{' '}
                {dayjs(g.deadline).format('DD/MM/YYYY')}
              </p>

              <p>Trạng thái: {getStatusTag(g.status)}</p>
            </Card>
          </Col>
        ))}
      </Row>

      {/* DRAWER */}
      <Drawer
        title="Thêm mục tiêu"
        visible={open}
        onClose={() => setOpen(false)}
        width={400}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên mục tiêu"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="Giảm cân">
                Giảm cân
              </Select.Option>
              <Select.Option value="Tăng cơ">
                Tăng cơ
              </Select.Option>
              <Select.Option value="Sức bền">
                Cải thiện sức bền
              </Select.Option>
              <Select.Option value="Khác">
                Khác
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="target"
            label="Giá trị mục tiêu"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="current"
            label="Giá trị hiện tại"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="deadline"
            label="Deadline"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="doing">
                Đang thực hiện
              </Select.Option>
              <Select.Option value="done">
                Đã đạt
              </Select.Option>
              <Select.Option value="cancel">
                Đã hủy
              </Select.Option>
            </Select>
          </Form.Item>

          <Button type="primary" block onClick={handleSubmit}>
            Lưu
          </Button>
        </Form>
      </Drawer>
    </div>
  )
}