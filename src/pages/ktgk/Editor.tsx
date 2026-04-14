import { Card, Form, Input, Select, Button, message } from 'antd'
import { useEffect } from 'react'
import { history, useLocation } from 'umi'

type Course = {
  id: number
  name: string
  teacher: string
  students: number
  status: string
  description: string
}

export default function Editor() {
  const [form] = Form.useForm()
  const location = useLocation()

  const params = new URLSearchParams(location.search)
  const id = params.get('id')

  useEffect(() => {
    if (id) {
      const list: Course[] = JSON.parse(localStorage.getItem('courses') || '[]')
      const found = list.find(i => i.id === Number(id))
      if (found) form.setFieldsValue(found)
    }
  }, [id])

  const onFinish = (values: Course) => {
    let list: Course[] = JSON.parse(localStorage.getItem('courses') || '[]')

    const duplicate = list.find(
      i => i.name === values.name && i.id !== Number(id)
    )

    if (duplicate) {
      message.error('Tên khóa học đã tồn tại')
      return
    }

    if (id) {
      list = list.map(i =>
        i.id === Number(id) ? { ...i, ...values } : i
      )
      message.success('Cập nhật thành công')
    } else {
      list.push({ ...values, id: Date.now() })
      message.success('Thêm thành công')
    }

    localStorage.setItem('courses', JSON.stringify(list))
    history.push('/ktgk/management')
  }

  return (
    <Card title="✏️ Thêm / Chỉnh sửa khóa học">
      <Form layout="vertical" form={form} onFinish={onFinish}>

        <Form.Item
          name="name"
          label="Tên khóa học"
          rules={[
            { required: true, message: 'Không được để trống' },
            { max: 100, message: 'Tối đa 100 ký tự' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="teacher"
          label="Giảng viên"
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value="Nguyễn Văn A">Nguyễn Văn A</Select.Option>
            <Select.Option value="Trần Văn B">Trần Văn B</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="students"
          label="Số học viên"
          rules={[{ required: true }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả (HTML)"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value="Đang mở">Đang mở</Select.Option>
            <Select.Option value="Tạm dừng">Tạm dừng</Select.Option>
            <Select.Option value="Đã kết thúc">Đã kết thúc</Select.Option>
          </Select>
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Lưu
        </Button>
      </Form>
    </Card>
  )
}