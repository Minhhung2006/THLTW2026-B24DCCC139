import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Popconfirm,
  Space,
  Tag
} from 'antd'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)
import { useEffect, useState } from 'react'

const { RangePicker } = DatePicker

export default function WorkoutLog() {
  const [data, setData] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form] = Form.useForm()

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [dateRange, setDateRange] = useState<any>(null)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('workouts') || '[]')
    setData(saved)
    setFiltered(saved)
  }, [])

  useEffect(() => {
    let result = [...data]

    if (search) {
      result = result.filter((w) =>
        w.type.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (typeFilter) {
      result = result.filter((w) => w.type === typeFilter)
    }

    if (dateRange) {
      result = result.filter((w) =>
        dayjs(w.date).isBetween(dateRange[0], dateRange[1], null, '[]')
      )
    }

    setFiltered(result)
  }, [search, typeFilter, dateRange, data])

  const saveData = (newData: any[]) => {
    setData(newData)
    localStorage.setItem('workouts', JSON.stringify(newData))
  }

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const newItem = {
        ...values,
        date: values.date.toISOString(),
        id: editing ? editing.id : Date.now()
      }

      let newData = [...data]

      if (editing) {
        newData = newData.map((item) =>
          item.id === editing.id ? newItem : item
        )
      } else {
        newData.push(newItem)
      }

      saveData(newData)
      setOpen(false)
      setEditing(null)
      form.resetFields()
    })
  }

  const handleEdit = (record: any) => {
    setEditing(record)
    form.setFieldsValue({
      ...record,
      date: dayjs(record.date)
    })
    setOpen(true)
  }

  const handleDelete = (id: number) => {
    const newData = data.filter((item) => item.id !== id)
    saveData(newData)
  }

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      render: (d: string) => dayjs(d).format('DD/MM/YYYY')
    },
    {
      title: 'Loại',
      dataIndex: 'type'
    },
    {
      title: 'Thời lượng (phút)',
      dataIndex: 'duration'
    },
    {
      title: 'Calo',
      dataIndex: 'calories'
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (s: string) =>
        s === 'done' ? (
          <Tag color="green">Hoàn thành</Tag>
        ) : (
          <Tag color="red">Bỏ lỡ</Tag>
        )
    },
    {
      title: 'Hành động',
      render: (_: any, record: any) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Xóa buổi tập?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: 20 }}>
      <h2>🏋️ Nhật ký tập luyện</h2>

      {/* FILTER */}
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm loại bài tập..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />

        <Select
          placeholder="Loại"
          style={{ width: 150 }}
          allowClear
          onChange={(v) => setTypeFilter(v)}
        >
          <Select.Option value="Cardio">Cardio</Select.Option>
          <Select.Option value="Strength">Strength</Select.Option>
          <Select.Option value="Yoga">Yoga</Select.Option>
          <Select.Option value="HIIT">HIIT</Select.Option>
          <Select.Option value="Other">Other</Select.Option>
        </Select>

        <RangePicker onChange={(v) => setDateRange(v)} />

        <Button type="primary" onClick={() => setOpen(true)}>
          + Thêm buổi tập
        </Button>
      </Space>

      {/* TABLE */}
      <Table columns={columns} dataSource={filtered} rowKey="id" />

      {/* MODAL */}
      <Modal
        title={editing ? 'Sửa buổi tập' : 'Thêm buổi tập'}
        visible={open}
        onCancel={() => {
          setOpen(false)
          setEditing(null)
        }}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="date" label="Ngày" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="type" label="Loại" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Cardio">Cardio</Select.Option>
              <Select.Option value="Strength">Strength</Select.Option>
              <Select.Option value="Yoga">Yoga</Select.Option>
              <Select.Option value="HIIT">HIIT</Select.Option>
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="duration"
            label="Thời lượng (phút)"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="calories"
            label="Calo"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="note" label="Ghi chú">
            <Input />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="done">Hoàn thành</Select.Option>
              <Select.Option value="miss">Bỏ lỡ</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}