import {
  Table,
  Button,
  Modal,
  Form,
  InputNumber,
  DatePicker,
  Popconfirm,
  Tag,
  Space
} from 'antd'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

export default function HealthLog() {
  const [data, setData] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form] = Form.useForm()

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('health') || '[]')
    setData(saved)
  }, [])

  const saveData = (newData: any[]) => {
    setData(newData)
    localStorage.setItem('health', JSON.stringify(newData))
  }


  const calcBMI = (w: number, h: number) => {
    if (!w || !h) return 0
    return +(w / ((h / 100) ** 2)).toFixed(1)
  }

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5)
      return { color: 'blue', text: 'Thiếu cân' }
    if (bmi < 25)
      return { color: 'green', text: 'Bình thường' }
    if (bmi < 30)
      return { color: 'gold', text: 'Thừa cân' }
    return { color: 'red', text: 'Béo phì' }
  }

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const bmi = calcBMI(values.weight, values.height)

      const newItem = {
        ...values,
        bmi,
        date: values.date.toISOString(),
        id: editing ? editing.id : Date.now()
      }

      let newData = [...data]

      if (editing) {
        newData = newData.map((i) =>
          i.id === editing.id ? newItem : i
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
    const newData = data.filter((i) => i.id !== id)
    saveData(newData)
  }

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      render: (d: string) =>
        dayjs(d).format('DD/MM/YYYY')
    },
    {
      title: 'Cân nặng (kg)',
      dataIndex: 'weight'
    },
    {
      title: 'Chiều cao (cm)',
      dataIndex: 'height'
    },
    {
      title: 'BMI',
      dataIndex: 'bmi',
      render: (bmi: number) => {
        const status = getBMIStatus(bmi)
        return (
          <Tag color={status.color}>
            {bmi} - {status.text}
          </Tag>
        )
      }
    },
    {
      title: 'Nhịp tim (bpm)',
      dataIndex: 'heartRate'
    },
    {
      title: 'Giờ ngủ',
      dataIndex: 'sleep'
    },
    {
      title: 'Hành động',
      render: (_: any, record: any) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xóa dữ liệu?"
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
      <h2>💓 Nhật ký sức khỏe</h2>

      <Button
        type="primary"
        onClick={() => setOpen(true)}
        style={{ marginBottom: 16 }}
      >
        + Thêm chỉ số
      </Button>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
      />

      {/* MODAL */}
      <Modal
        title={editing ? 'Sửa chỉ số' : 'Thêm chỉ số'}
        visible={open}
        onCancel={() => {
          setOpen(false)
          setEditing(null)
        }}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="date"
            label="Ngày"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="weight"
            label="Cân nặng (kg)"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="height"
            label="Chiều cao (cm)"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="heartRate"
            label="Nhịp tim (bpm)"
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="sleep" label="Giờ ngủ">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}