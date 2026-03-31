import dayjs from 'dayjs'
import {
  Card,
  Table,
  Button,
  Input,
  Modal,
  Form,
  DatePicker,
  Switch,
  Upload,
} from 'antd'
import { useEffect, useState } from 'react'
import { UploadOutlined } from '@ant-design/icons'

export default function Club() {
  const [list, setList] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form] = Form.useForm()
  const [search, setSearch] = useState('')
  const [members, setMembers] = useState<any[]>([])
  const [memberOpen, setMemberOpen] = useState(false)

  useEffect(() => {
    setList(JSON.parse(localStorage.getItem('clubs') || '[]'))
  }, [])

  const save = (data: any[]) => {
    setList(data)
    localStorage.setItem('clubs', JSON.stringify(data))
  }

  const onFinish = (values: any) => {
    const newData = {
      ...values,
      id: editing ? editing.id : Date.now(),
      createdAt: values.createdAt.format('YYYY-MM-DD')
    }

    if (editing) {
      save(list.map(i => i.id === editing.id ? newData : i))
    } else {
      save([...list, newData])
    }

    setOpen(false)
    setEditing(null)
    form.resetFields()
  }

  const remove = (id: number) => {
    save(list.filter(i => i.id !== id))
  }

  const edit = (record: any) => {
    setEditing(record)
    form.setFieldsValue({
      ...record,
      createdAt: record.createdAt ? dayjs(record.createdAt) : null
    })
    setOpen(true)
  }

  const viewMembers = (club: any) => {
    const reg = JSON.parse(localStorage.getItem('reg') || '[]')
    const mem = reg.filter((i: any) => i.club === club.name && i.status === 'Approved')
    setMembers(mem)
    setMemberOpen(true)
  }

  const filtered = list.filter(i =>
    i.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Card title="🏫 Quản lý câu lạc bộ">

      {/* SEARCH + ADD */}
      <div style={{ display: 'flex', marginBottom: 10 }}>
        <Input
          placeholder="Tìm CLB..."
          style={{ width: 300, marginRight: 10 }}
          onChange={e => setSearch(e.target.value)}
        />
        <Button type="primary" onClick={() => setOpen(true)}>
          Thêm CLB
        </Button>
      </div>

      {/* TABLE */}
      <Table
        dataSource={filtered}
        rowKey="id"
        bordered
        columns={[
          {
            title: 'Ảnh',
            dataIndex: 'image',
            render: (img: string) =>
              img ? <img src={img} width={50} /> : 'No image'
          },
          {
            title: 'Tên CLB',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name)
          },
          {
            title: 'Ngày thành lập',
            dataIndex: 'createdAt',
            sorter: (a, b) => a.createdAt.localeCompare(b.createdAt)
          },
          {
            title: 'Mô tả',
            dataIndex: 'desc',
            render: (html: string) => (
              <div dangerouslySetInnerHTML={{ __html: html }} />
            )
          },
          {
            title: 'Chủ nhiệm',
            dataIndex: 'leader'
          },
          {
            title: 'Hoạt động',
            render: (_: any, r: any) => (r.active ? 'Có' : 'Không')
          },
          {
            title: 'Thao tác',
            render: (_: any, r: any) => (
              <>
                <Button onClick={() => edit(r)}>Sửa</Button>{' '}
                <Button danger onClick={() => remove(r.id)}>Xóa</Button>{' '}
                <Button onClick={() => viewMembers(r)}>Thành viên</Button>
              </>
            )
          }
        ]}
      />

      {/* MODAL FORM */}
      <Modal
        title={editing ? 'Sửa CLB' : 'Thêm CLB'}
        visible={open}
        onCancel={() => {
          setOpen(false)
          setEditing(null)
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>

          <Form.Item name="name" label="Tên CLB" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="leader" label="Chủ nhiệm">
            <Input />
          </Form.Item>

          <Form.Item name="createdAt" label="Ngày thành lập">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="desc" label="Mô tả (HTML)">
            <Input.TextArea rows={4} placeholder="<b>CLB rất hay</b>" />
          </Form.Item>

          <Form.Item name="image" label="Ảnh">
            <Upload
              beforeUpload={(file) => {
                const reader = new FileReader()
                reader.onload = (e) => {
                  form.setFieldsValue({ image: e.target?.result })
                }
                reader.readAsDataURL(file)
                return false
              }}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item name="active" label="Hoạt động" valuePropName="checked">
            <Switch />
          </Form.Item>

        </Form>
      </Modal>

      {/* MODAL MEMBERS */}
      <Modal
        title="Danh sách thành viên"
        visible={memberOpen}
        onCancel={() => setMemberOpen(false)}
        footer={null}
      >
        <Table
          dataSource={members}
          rowKey="id"
          columns={[
            { title: 'Tên', dataIndex: 'name' },
            { title: 'Email', dataIndex: 'email' },
            { title: 'SĐT', dataIndex: 'phone' }
          ]}
        />
      </Modal>

    </Card>
  )
}