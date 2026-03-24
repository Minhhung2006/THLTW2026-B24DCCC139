import {
  Card,
  Input,
  Button,
  Table,
  Select,
  Row,
  Col,
  Tag,
  message,
  Modal,
  Popconfirm
} from 'antd'
import { useState, useEffect } from 'react'

interface FieldType {
  id: number
  name: string
  type: 'string' | 'number' | 'date'
}

export default function BieuMau() {

  const [list, setList] = useState<FieldType[]>([])
  const [form, setForm] = useState<any>({})
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<FieldType | null>(null)

  useEffect(() => {
    setList(JSON.parse(localStorage.getItem('fields') || '[]'))
  }, [])

  const save = (data: FieldType[]) => {
    setList(data)
    localStorage.setItem('fields', JSON.stringify(data))
  }

  const handleOk = () => {

    if (!form.name || !form.type) {
      message.error('Nhập đầy đủ!')
      return
    }

    if (
      list.find(f => f.name === form.name && f.id !== editing?.id)
    ) {
      message.error('Tên field đã tồn tại!')
      return
    }

    if (editing) {
      const newList = list.map(f =>
        f.id === editing.id ? { ...f, ...form } : f
      )
      save(newList)
      message.success('Cập nhật thành công!')
    } else {
      const newField: FieldType = {
        id: Date.now(),
        name: form.name,
        type: form.type
      }
      save([...list, newField])
      message.success('Thêm thành công!')
    }

    setOpen(false)
    setForm({})
    setEditing(null)
  }

  const edit = (record: FieldType) => {
    setEditing(record)
    setForm(record)
    setOpen(true)
  }

  const remove = (id: number) => {
    const newList = list.filter(f => f.id !== id)
    save(newList)
    message.success('Đã xóa!')
  }

  return (
    <Card title="⚙️ Cấu hình biểu mẫu văn bằng">

      <Button
        type="primary"
        onClick={() => {
          setOpen(true)
          setForm({})
          setEditing(null)
        }}
      >
        + Thêm trường
      </Button>

      {/* TABLE */}
      <Table
        style={{ marginTop: 20 }}
        dataSource={list}
        rowKey="id"
        bordered
        columns={[
          {
            title: 'Tên trường',
            dataIndex: 'name',
          },
          {
            title: 'Kiểu dữ liệu',
            dataIndex: 'type',
            render: (type: string) => {
              const color =
                type === 'string'
                  ? 'blue'
                  : type === 'number'
                  ? 'green'
                  : 'orange'

              return <Tag color={color}>{type}</Tag>
            }
          },
          {
            title: 'Hành động',
            render: (_: any, record: FieldType) => (
              <>
                <Button
                  onClick={() => edit(record)}
                  style={{ marginRight: 8 }}
                >
                  Sửa
                </Button>

                <Popconfirm
                  title="Xóa field?"
                  onConfirm={() => remove(record.id)}
                >
                  <Button danger>Xóa</Button>
                </Popconfirm>
              </>
            )
          }
        ]}
      />

      {/* MODAL */}
      <Modal
        title={editing ? 'Sửa trường' : 'Thêm trường'}
        visible={open}
        onCancel={() => setOpen(false)}
        onOk={handleOk}
        >
        <Row gutter={10}>
          <Col span={12}>
            <Input
              placeholder="Tên field (VD: Dân tộc)"
              value={form.name}
              onChange={e =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </Col>

          <Col span={12}>
            <Select
              placeholder="Kiểu dữ liệu"
              style={{ width: '100%' }}
              value={form.type}
              onChange={(value) =>
                setForm({ ...form, type: value })
              }
            >
              <Select.Option value="string">String</Select.Option>
              <Select.Option value="number">Number</Select.Option>
              <Select.Option value="date">Date</Select.Option>
            </Select>
          </Col>
        </Row>
      </Modal>
    </Card>
  )
}