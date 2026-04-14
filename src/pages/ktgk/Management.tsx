import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tag
} from 'antd'
import { useEffect, useState } from 'react'

type Course = {
  id: number
  name: string
  teacher: string
  students: number
  status: string
  description: string
}

export default function Management() {
  const [list, setList] = useState<Course[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Course | null>(null)

  const [form] = Form.useForm()

  // LOAD DATA
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('courses') || '[]')

    if (!data.length) {
      const fake: Course[] = [
        {
          id: 1,
          name: 'ReactJS',
          teacher: 'Nguyễn Văn A',
          students: 50,
          status: 'Đang mở',
          description: '<p>Khóa học React</p>'
        }
      ]
      localStorage.setItem('courses', JSON.stringify(fake))
      setList(fake)
    } else {
      setList(data)
    }
  }, [])

  // SAVE
  const save = (data: Course[]) => {
    setList(data)
    localStorage.setItem('courses', JSON.stringify(data))
  }

  // SUBMIT
  const onFinish = (values: Course) => {
    if (editing) {
      const updated = list.map(item =>
        item.id === editing.id ? { ...editing, ...values } : item
      )
      save(updated)
      message.success('Cập nhật khóa học thành công')
    } else {
      const newCourse: Course = {
        ...values,
        id: Date.now()
      }
      save([...list, newCourse])
      message.success('Thêm khóa học thành công')
    }

    setOpen(false)
    setEditing(null)
    form.resetFields()
  }

  // EDIT
  const handleEdit = (record: Course) => {
    setEditing(record)
    form.setFieldsValue(record)
    setOpen(true)
  }

  const teachers = ['Nguyễn Văn A', 'Trần Văn B', 'Lê Văn C']

  return (
    <Card title="📊 Quản lý khóa học">

      <Button
        type="primary"
        style={{ marginBottom: 10 }}
        onClick={() => {
          setEditing(null)
          form.resetFields()
          setOpen(true)
        }}
      >
        Thêm khóa học
      </Button>

      {/* TABLE */}
      <Table
        rowKey="id"
        bordered
        dataSource={list}
        columns={[
          { title: 'Tên khóa', dataIndex: 'name' },
          { title: 'Giảng viên', dataIndex: 'teacher' },
          { title: 'Học viên', dataIndex: 'students' },
          {
            title: 'Mô tả',
            render: (_: any, r: Course) => (
              <div dangerouslySetInnerHTML={{ __html: r.description }} />
            )
          },
          {
            title: 'Trạng thái',
            render: (_: any, r: Course) => {
              if (r.status === 'Đang mở')
                return <Tag color="green">Đang mở</Tag>
              if (r.status === 'Tạm dừng')
                return <Tag color="orange">Tạm dừng</Tag>
              return <Tag color="red">Đã kết thúc</Tag>
            }
          },
          {
            title: 'Hành động',
            render: (_: any, r: Course) => (
              <Button onClick={() => handleEdit(r)}>Sửa</Button>
            )
          }
        ]}
      />

      {/* MODAL */}
      <Modal
        title={editing ? 'Chỉnh sửa khóa học' : 'Thêm khóa học'}
        visible={open} // nếu AntD v4 thì đổi thành visible
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>

          <Form.Item
            name="name"
            label="Tên khóa học"
            rules={[
              { required: true, message: 'Không được để trống' },
              { max: 100, message: 'Tối đa 100 ký tự' },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve()

                  const isDuplicate = list.some(
                    item =>
                      item.name.toLowerCase() === value.toLowerCase() &&
                      item.id !== editing?.id
                  )

                  return isDuplicate
                    ? Promise.reject('Tên khóa học đã tồn tại')
                    : Promise.resolve()
                }
              }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="teacher"
            label="Giảng viên"
            rules={[{ required: true, message: 'Chọn giảng viên' }]}
          >
            <Select>
              {teachers.map(t => (
                <Select.Option key={t} value={t}>
                  {t}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="students"
            label="Số học viên"
            rules={[{ required: true, message: 'Nhập số học viên' }]}
          >
            <Input type="number" min={0} />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả (HTML)"
            rules={[{ required: true, message: 'Nhập mô tả' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Chọn trạng thái' }]}
          >
            <Select>
              <Select.Option value="Đang mở">Đang mở</Select.Option>
              <Select.Option value="Tạm dừng">Tạm dừng</Select.Option>
              <Select.Option value="Đã kết thúc">Đã kết thúc</Select.Option>
            </Select>
          </Form.Item>

        </Form>
      </Modal>

    </Card>
  )
}