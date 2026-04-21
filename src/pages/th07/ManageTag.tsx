import {
  Table,
  Card,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm
} from 'antd'
import { useEffect, useState } from 'react'

type TagType = {
  id: number
  name: string
}

type Post = {
  id: number
  tags: string[]
}

export default function ManageTag() {
  const [tags, setTags] = useState<TagType[]>([])
  const [posts, setPosts] = useState<Post[]>([])

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<TagType | null>(null)

  const [form] = Form.useForm()

  useEffect(() => {
    setTags(JSON.parse(localStorage.getItem('tags') || '[]'))
    setPosts(JSON.parse(localStorage.getItem('posts') || '[]'))
  }, [])

  const save = (data: TagType[]) => {
    setTags(data)
    localStorage.setItem('tags', JSON.stringify(data))
  }

  const countPost = (tagName: string) => {
    return posts.filter(p => p.tags.includes(tagName)).length
  }

  const openAdd = () => {
    setEditing(null)
    form.resetFields()
    setOpen(true)
  }

  const openEdit = (record: TagType) => {
    setEditing(record)
    form.setFieldsValue(record)
    setOpen(true)
  }

  const handleDelete = (id: number) => {
    const newData = tags.filter(t => t.id !== id)
    save(newData)
    message.success('Đã xóa')
  }

  const onFinish = (values: TagType) => {
    let data = [...tags]

    const duplicate = data.find(
      t => t.name.toLowerCase() === values.name.toLowerCase() &&
      t.id !== editing?.id
    )

    if (duplicate) {
      message.error('Tag đã tồn tại')
      return
    }

    if (editing) {
      data = data.map(t =>
        t.id === editing.id ? { ...t, ...values } : t
      )
      message.success('Cập nhật thành công')
    } else {
      data.push({
        id: Date.now(),
        name: values.name
      })
      message.success('Thêm thành công')
    }

    save(data)
    setOpen(false)
  }

  return (
    <Card title="🏷️ Quản lý thẻ">

      <Button type="primary" onClick={openAdd}>
        + Thêm thẻ
      </Button>

      <Table
        rowKey="id"
        style={{ marginTop: 20 }}
        dataSource={tags}
        columns={[
          { title: 'Tên thẻ', dataIndex: 'name' },
          {
            title: 'Số bài viết',
            render: (_, r) => countPost(r.name)
          },
          {
            title: 'Hành động',
            render: (_, r) => (
              <>
                <Button onClick={() => openEdit(r)}>Sửa</Button>

                <Popconfirm
                  title="Xóa thẻ?"
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

      {/* MODAL */}
      <Modal
        title={editing ? 'Sửa thẻ' : 'Thêm thẻ'}
        visible={open}   // 🔥 đúng AntD v4
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="name"
            label="Tên thẻ"
            rules={[{ required: true, message: 'Nhập tên thẻ' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

    </Card>
  )
}