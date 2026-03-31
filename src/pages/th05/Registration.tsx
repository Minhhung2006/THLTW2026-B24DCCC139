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
import dayjs from 'dayjs'

export default function Registration() {
  const [list, setList] = useState<any[]>([])
  const [clubs, setClubs] = useState<any[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([])

  const [open, setOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)

  const [editing, setEditing] = useState<any>(null)
  const [current, setCurrent] = useState<any>(null)
  const [reason, setReason] = useState('')

  const [form] = Form.useForm()

  useEffect(() => {
    setList(JSON.parse(localStorage.getItem('reg') || '[]'))
    setClubs(JSON.parse(localStorage.getItem('clubs') || '[]'))
  }, [])

  const save = (data: any[]) => {
    setList(data)
    localStorage.setItem('reg', JSON.stringify(data))
  }

  const onFinish = (values: any) => {
    const newData = {
      ...values,
      id: editing ? editing.id : Date.now(),
      status: editing ? editing.status : 'Pending',
      history: editing ? editing.history || [] : []
    }

    if (editing) {
      save(list.map(i => (i.id === editing.id ? newData : i)))
      message.success('Cập nhật thành công')
    } else {
      save([...list, newData])
      message.success('Thêm mới thành công')
    }

    setOpen(false)
    setEditing(null)
    form.resetFields()
  }

  const remove = (id: number) => {
    save(list.filter(i => i.id !== id))
    message.success('Đã xóa')
  }

  const approveMulti = (): void => {
    const now = dayjs().format('HH:mm DD/MM/YYYY')

    const data = list.map(i =>
      selectedRowKeys.includes(i.id)
        ? {
            ...i,
            status: 'Approved',
            history: [...(i.history || []), `Approved lúc ${now}`]
          }
        : i
    )

    save(data)
    message.success('Đã duyệt')
  }

  const rejectMulti = (): void => {
    if (!reason) {
      message.error('Nhập lý do')
      return
    }

    const now = dayjs().format('HH:mm DD/MM/YYYY')

    const data = list.map(i =>
      selectedRowKeys.includes(i.id)
        ? {
            ...i,
            status: 'Rejected',
            note: reason,
            history: [...(i.history || []), `Rejected lúc ${now} - ${reason}`]
          }
        : i
    )

    save(data)
    setRejectOpen(false)
    setReason('')
    message.success('Đã từ chối')
  }

  // EDIT
  const edit = (record: any) => {
    setEditing(record)
    form.setFieldsValue(record)
    setOpen(true)
  }

  const viewDetail = (record: any) => {
    setCurrent(record)
    setDetailOpen(true)
  }

  const viewHistory = (record: any) => {
    setCurrent(record)
    setHistoryOpen(true)
  }

  return (
    <Card title="📋 Đơn đăng ký">

      {/* ACTION */}
      <div style={{ marginBottom: 10 }}>
        <Button type="primary" onClick={() => setOpen(true)}>
          Thêm đơn
        </Button>{' '}

        <Button onClick={approveMulti}>
          Duyệt {selectedRowKeys.length}
        </Button>{' '}

        <Button danger onClick={() => setRejectOpen(true)}>
          Từ chối {selectedRowKeys.length}
        </Button>
      </div>

      {/* TABLE */}
      <Table
        rowKey="id"
        rowSelection={{
          onChange: (keys) => setSelectedRowKeys(keys)
        }}
        dataSource={list}
        bordered
        columns={[
          { title: 'Tên', dataIndex: 'name' },
          { title: 'Email', dataIndex: 'email' },
          { title: 'SĐT', dataIndex: 'phone' },
          { title: 'Giới tính', dataIndex: 'gender' },
          { title: 'CLB', dataIndex: 'club' },
          {
            title: 'Trạng thái',
            render: (_: any, r: any) => {
              if (r.status === 'Approved') return <Tag color="green">Approved</Tag>
              if (r.status === 'Rejected') return <Tag color="red">Rejected</Tag>
              return <Tag>Pending</Tag>
            }
          },
          {
            title: 'Thao tác',
            render: (_: any, r: any) => (
              <>
                <Button onClick={() => viewDetail(r)}>Chi tiết</Button>{' '}
                <Button onClick={() => edit(r)}>Sửa</Button>{' '}
                <Button danger onClick={() => remove(r.id)}>Xóa</Button>{' '}
                <Button onClick={() => viewHistory(r)}>History</Button>
              </>
            )
          }
        ]}
      />

      {/* FORM */}
      <Modal
        title="Đơn đăng ký"
        visible={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Họ tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="SĐT">
            <Input />
          </Form.Item>

          <Form.Item name="gender" label="Giới tính">
            <Select>
              <Select.Option value="Nam">Nam</Select.Option>
              <Select.Option value="Nữ">Nữ</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="address" label="Địa chỉ">
            <Input />
          </Form.Item>

          <Form.Item name="skill" label="Sở trường">
            <Input />
          </Form.Item>

          <Form.Item name="club" label="CLB">
            <Select>
              {clubs.map(c => (
                <Select.Option key={c.id}>{c.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="reason" label="Lý do đăng ký">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      {/* DETAIL */}
      <Modal
        title="Chi tiết"
        visible={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={null}
      >
        {current && (
          <>
            <p><b>Tên:</b> {current.name}</p>
            <p><b>Email:</b> {current.email}</p>
            <p><b>SĐT:</b> {current.phone}</p>
            <p><b>CLB:</b> {current.club}</p>
            <p><b>Lý do:</b> {current.reason}</p>
            <p><b>Ghi chú:</b> {current.note}</p>
          </>
        )}
      </Modal>

      {/* REJECT */}
      <Modal
        title="Nhập lý do từ chối"
       visible ={rejectOpen}
        onCancel={() => setRejectOpen(false)}
        onOk={rejectMulti}
      >
        <Input.TextArea onChange={e => setReason(e.target.value)} />
      </Modal>

      {/* HISTORY */}
      <Modal
        title="Lịch sử"
        visible={historyOpen}
        onCancel={() => setHistoryOpen(false)}
        footer={null}
      >
        {current?.history?.map((h: any, i: number) => (
          <p key={i}>- {h}</p>
        ))}
      </Modal>

    </Card>
  )
}