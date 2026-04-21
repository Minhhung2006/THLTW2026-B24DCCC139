import {
  Table,
  Card,
  Input,
  Select,
  Button,
  Tag,
  Modal,
  Form,
  message,
  Popconfirm
} from 'antd'
import { useEffect, useState } from 'react'

type Post = {
  id: number
  title: string
  slug: string
  summary: string
  content: string
  thumbnail: string
  tags: string[]
  author: string
  createdAt: string
  status: 'draft' | 'published'
  views: number
}

export default function ManagePost() {
  const [list, setList] = useState<Post[]>([])
  const [filtered, setFiltered] = useState<Post[]>([])

  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState<string>('')

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Post | null>(null)

  const [form] = Form.useForm()

  // LOAD
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('posts') || '[]')
    setList(data)
    setFiltered(data)
  }, [])

  // FILTER
  useEffect(() => {
    let data = [...list]

    if (keyword)
      data = data.filter(p =>
        p.title.toLowerCase().includes(keyword.toLowerCase())
      )

    if (status)
      data = data.filter(p => p.status === status)

    setFiltered(data)
  }, [keyword, status, list])

  // SAVE
  const save = (data: Post[]) => {
    setList(data)
    localStorage.setItem('posts', JSON.stringify(data))
  }

  // DELETE
  const handleDelete = (id: number) => {
    const newData = list.filter(p => p.id !== id)
    save(newData)
    message.success('Đã xóa')
  }

  // OPEN ADD
  const openAdd = () => {
    setEditing(null)
    form.resetFields()
    setOpen(true)
  }

  // OPEN EDIT
  const openEdit = (record: Post) => {
    setEditing(record)
    form.setFieldsValue(record)
    setOpen(true)
  }

  // SUBMIT
  const onFinish = (values: Post) => {
    let data = [...list]

    const duplicate = data.find(
      p => p.slug === values.slug && p.id !== editing?.id
    )

    if (duplicate) {
      message.error('Slug đã tồn tại')
      return
    }

    if (editing) {
      data = data.map(p =>
        p.id === editing.id ? { ...p, ...values } : p
      )
      message.success('Cập nhật thành công')
    } else {
      data.push({
        ...values,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        views: 0
      })
      message.success('Thêm thành công')
    }

    save(data)
    setOpen(false)
  }

  return (
    <Card title="🛠️ Quản lý bài viết">

      {/* SEARCH + FILTER */}
      <Input
        placeholder="Tìm tiêu đề..."
        onChange={e => setKeyword(e.target.value)}
        style={{ width: 300, marginRight: 10 }}
      />

      <Select
        placeholder="Trạng thái"
        style={{ width: 200, marginRight: 10 }}
        onChange={setStatus}
        allowClear
      >
        <Select.Option value="draft">Nháp</Select.Option>
        <Select.Option value="published">Đã đăng</Select.Option>
      </Select>

      <Button type="primary" onClick={openAdd}>
        + Thêm bài
      </Button>

      {/* TABLE */}
      <Table
        rowKey="id"
        style={{ marginTop: 20 }}
        dataSource={filtered}
        columns={[
          { title: 'Tiêu đề', dataIndex: 'title' },
          {
            title: 'Trạng thái',
            render: (_, r) =>
              r.status === 'published'
                ? <Tag color="green">Đã đăng</Tag>
                : <Tag>Nháp</Tag>
          },
          {
            title: 'Thẻ',
            render: (_, r) =>
              r.tags.map((t: string) => <Tag key={t}>{t}</Tag>)
          },
          { title: 'Lượt xem', dataIndex: 'views' },
          {
            title: 'Ngày tạo',
            render: (_, r) =>
              new Date(r.createdAt).toLocaleDateString()
          },
          {
            title: 'Hành động',
            render: (_, r) => (
              <>
                <Button onClick={() => openEdit(r)}>Sửa</Button>

                <Popconfirm
                  title="Xóa bài viết?"
                  onConfirm={() => handleDelete(r.id)}
                >
                  <Button danger style={{ marginLeft: 8 }}>
                    Xóa
                  </Button>
                </Popconfirm>
              </>
            )
          }
        ]}
      />

      {/* MODAL FORM */}
      <Modal
        title={editing ? 'Sửa bài viết' : 'Thêm bài viết'}
        visible={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>

          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="summary" label="Tóm tắt" rules={[{ required: true }]}>
            <Input.TextArea />
          </Form.Item>

          <Form.Item name="thumbnail" label="Ảnh URL" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="tags" label="Thẻ" rules={[{ required: true }]}>
            <Select mode="tags" />
          </Form.Item>

          <Form.Item name="content" label="Nội dung" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="draft">Nháp</Select.Option>
              <Select.Option value="published">Đã đăng</Select.Option>
            </Select>
          </Form.Item>

        </Form>
      </Modal>

    </Card>
  )
}