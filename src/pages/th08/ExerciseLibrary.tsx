import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Tag,
  Modal,
  Button,
  Form,
  Popconfirm,
  Space
} from 'antd'
import { useEffect, useState } from 'react'

export default function ExerciseLibrary() {
  const [data, setData] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [muscle, setMuscle] = useState('')
  const [level, setLevel] = useState('')
  const [open, setOpen] = useState(false)
  const [detail, setDetail] = useState<any>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form] = Form.useForm()

  // load
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('exercises') || '[]')
    setData(saved)
    setFiltered(saved)
  }, [])

  // filter
  useEffect(() => {
    let result = [...data]

    if (search) {
      result = result.filter((e) =>
        e.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (muscle) {
      result = result.filter((e) => e.muscle === muscle)
    }

    if (level) {
      result = result.filter((e) => e.level === level)
    }

    setFiltered(result)
  }, [search, muscle, level, data])

  // save
  const saveData = (newData: any[]) => {
    setData(newData)
    localStorage.setItem('exercises', JSON.stringify(newData))
  }

  // level color
  const levelTag = (l: string) => {
    if (l === 'easy') return <Tag color="green">Dễ</Tag>
    if (l === 'medium') return <Tag color="gold">Trung bình</Tag>
    return <Tag color="red">Khó</Tag>
  }

  // open detail
  const openDetail = (item: any) => {
    setDetail(item)
    setOpen(true)
  }

  // delete
  const handleDelete = (id: number) => {
    saveData(data.filter((e) => e.id !== id))
  }

  // edit
  const handleEdit = (item: any) => {
    setEditing(item)
    form.setFieldsValue(item)
    setFormOpen(true)
  }

  // submit
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const newItem = {
        ...values,
        id: editing ? editing.id : Date.now()
      }

      let newData = [...data]

      if (editing) {
        newData = newData.map((e) =>
          e.id === editing.id ? newItem : e
        )
      } else {
        newData.push(newItem)
      }

      saveData(newData)
      setFormOpen(false)
      setEditing(null)
      form.resetFields()
    })
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>🏋️ Thư viện bài tập</h2>

      {/* FILTER */}
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm bài tập..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />

        <Select
          placeholder="Nhóm cơ"
          style={{ width: 150 }}
          allowClear
          onChange={(v) => setMuscle(v)}
        >
          <Select.Option value="Chest">Chest</Select.Option>
          <Select.Option value="Back">Back</Select.Option>
          <Select.Option value="Legs">Legs</Select.Option>
          <Select.Option value="Shoulders">Shoulders</Select.Option>
          <Select.Option value="Arms">Arms</Select.Option>
          <Select.Option value="Core">Core</Select.Option>
          <Select.Option value="Full Body">Full Body</Select.Option>
        </Select>

        <Select
          placeholder="Độ khó"
          style={{ width: 150 }}
          allowClear
          onChange={(v) => setLevel(v)}
        >
          <Select.Option value="easy">Dễ</Select.Option>
          <Select.Option value="medium">Trung bình</Select.Option>
          <Select.Option value="hard">Khó</Select.Option>
        </Select>

        <Button type="primary" onClick={() => setFormOpen(true)}>
          + Thêm bài tập
        </Button>
      </Space>

      {/* GRID */}
      <Row gutter={[16, 16]}>
        {filtered.map((e) => (
          <Col span={8} key={e.id}>
            <Card
              hoverable
              onClick={() => openDetail(e)}
              extra={
                <Space onClick={(ev) => ev.stopPropagation()}>
                  <Button size="small" onClick={() => handleEdit(e)}>
                    Sửa
                  </Button>
                  <Popconfirm
                    title="Xóa bài tập?"
                    onConfirm={() => handleDelete(e.id)}
                  >
                    <Button danger size="small">
                      Xóa
                    </Button>
                  </Popconfirm>
                </Space>
              }
            >
              <h3>{e.name}</h3>
              <p>Nhóm cơ: {e.muscle}</p>
              <p>Độ khó: {levelTag(e.level)}</p>
              <p>{e.desc}</p>
              <p>🔥 {e.calories} cal/giờ</p>
            </Card>
          </Col>
        ))}
      </Row>

      {/* DETAIL MODAL */}
      <Modal
        title={detail?.name}
        visible={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        {detail && (
          <>
            <p>Nhóm cơ: {detail.muscle}</p>
            <p>Độ khó: {levelTag(detail.level)}</p>
            <p>{detail.desc}</p>
            <p>🔥 {detail.calories} cal/giờ</p>
            <hr />
            <p><b>Hướng dẫn:</b></p>
            <p>{detail.guide}</p>
          </>
        )}
      </Modal>

      {/* FORM MODAL */}
      <Modal
        title={editing ? 'Sửa bài tập' : 'Thêm bài tập'}
        visible={formOpen}
        onCancel={() => {
          setFormOpen(false)
          setEditing(null)
        }}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên bài tập"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="muscle"
            label="Nhóm cơ"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="Chest">Chest</Select.Option>
              <Select.Option value="Back">Back</Select.Option>
              <Select.Option value="Legs">Legs</Select.Option>
              <Select.Option value="Shoulders">Shoulders</Select.Option>
              <Select.Option value="Arms">Arms</Select.Option>
              <Select.Option value="Core">Core</Select.Option>
              <Select.Option value="Full Body">Full Body</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="level"
            label="Độ khó"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="easy">Dễ</Select.Option>
              <Select.Option value="medium">Trung bình</Select.Option>
              <Select.Option value="hard">Khó</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="desc"
            label="Mô tả"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="calories"
            label="Calo/giờ"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="guide"
            label="Hướng dẫn chi tiết"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}