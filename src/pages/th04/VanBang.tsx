import {
  Card,
  Input,
  Button,
  Table,
  Select,
  DatePicker,
  Row,
  Col,
  message,
  InputNumber
} from 'antd'
import { useEffect, useState } from 'react'
import moment from 'moment'

interface FieldType {
  id: number
  name: string
  type: 'string' | 'number' | 'date'
}

interface SoType {
  year: number
  currentNumber: number
}

interface QDType {
  id: number
  so: string
  year: number
}

interface VBType {
  id: number
  soVaoSo: number
  soHieu: string
  msv: string
  name: string
  dob: string
  qdId: number
  extra: any
}

export default function VanBang() {

  const [list, setList] = useState<VBType[]>([])
  const [fields, setFields] = useState<FieldType[]>([])
  const [soList, setSoList] = useState<SoType[]>([])
  const [qdList, setQdList] = useState<QDType[]>([])

  const [form, setForm] = useState<any>({ extra: {} })

  useEffect(() => {
    setList(JSON.parse(localStorage.getItem('vanBang') || '[]'))
    setFields(JSON.parse(localStorage.getItem('fields') || '[]'))
    setSoList(JSON.parse(localStorage.getItem('soVanBang') || '[]'))
    setQdList(JSON.parse(localStorage.getItem('quyetDinh') || '[]'))
  }, [])

  const save = (data: VBType[]) => {
    setList(data)
    localStorage.setItem('vanBang', JSON.stringify(data))
  }

  const getSoVaoSo = (year: number) => {
    const so = soList.find(s => s.year === year)
    if (!so) return 1

    const next = so.currentNumber + 1

    const newSoList = soList.map(s =>
      s.year === year ? { ...s, currentNumber: next } : s
    )

    localStorage.setItem('soVanBang', JSON.stringify(newSoList))
    setSoList(newSoList)

    return next
  }

  const add = () => {

    if (!form.msv || !form.name || !form.dob || !form.qdId || !form.soHieu) {
      message.error('Nhập thiếu thông tin!')
      return
    }

    const qd = qdList.find(q => q.id === form.qdId)
    if (!qd) return

    const soVaoSo = getSoVaoSo(qd.year)

    const newVB: VBType = {
      id: Date.now(),
      soVaoSo,
      soHieu: form.soHieu,
      msv: form.msv,
      name: form.name,
      dob: form.dob,
      qdId: form.qdId,
      extra: form.extra
    }

    save([...list, newVB])
    message.success('Thêm thành công!')

    setForm({ extra: {} })
  }

  const renderField = (f: FieldType): React.ReactNode => {

    if (f.type === 'string') {
      return (
        <Input
          placeholder={f.name}
          value={form.extra?.[f.name]}
          onChange={e =>
            setForm({
              ...form,
              extra: {
                ...form.extra,
                [f.name]: e.target.value
              }
            })
          }
        />
      )
    }

    if (f.type === 'number') {
      return (
        <InputNumber
          style={{ width: '100%' }}
          placeholder={f.name}
          value={form.extra?.[f.name]}
          onChange={(value) =>
            setForm({
              ...form,
              extra: {
                ...form.extra,
                [f.name]: value
              }
            })
          }
        />
      )
    }

    if (f.type === 'date') {
      return (
        <DatePicker
          style={{ width: '100%' }}
          value={
            form.extra?.[f.name]
              ? moment(form.extra[f.name], 'YYYY-MM-DD')
              : null
          }
          onChange={(date) =>
            setForm({
              ...form,
              extra: {
                ...form.extra,
                [f.name]: date
                  ? date.format('YYYY-MM-DD')
                  : null
              }
            })
          }
        />
      )
    }

    return null
  }

  return (
    <Card title="🎓 Thông tin văn bằng">

      {/* FORM CƠ BẢN */}
      <Row gutter={10}>

        <Col span={6}>
          <Input
            placeholder="Mã sinh viên"
            value={form.msv}
            onChange={e =>
              setForm({ ...form, msv: e.target.value })
            }
          />
        </Col>

        <Col span={6}>
          <Input
            placeholder="Họ tên"
            value={form.name}
            onChange={e =>
              setForm({ ...form, name: e.target.value })
            }
          />
        </Col>

        <Col span={6}>
          <DatePicker
            style={{ width: '100%' }}
            placeholder="Ngày sinh"
            value={form.dob ? moment(form.dob) : null}
            onChange={(date) =>
              setForm({
                ...form,
                dob: date ? date.format('YYYY-MM-DD') : null
              })
            }
          />
        </Col>

        <Col span={6}>
          <Input
            placeholder="Số hiệu văn bằng"
            value={form.soHieu}
            onChange={e =>
              setForm({ ...form, soHieu: e.target.value })
            }
          />
        </Col>

      </Row>

      {/* QUYẾT ĐỊNH */}
      <Row gutter={10} style={{ marginTop: 10 }}>
        <Col span={6}>
          <Select
            placeholder="Chọn quyết định"
            style={{ width: '100%' }}
            value={form.qdId}
            onChange={(value) =>
              setForm({ ...form, qdId: value })
            }
          >
            {qdList.map(q => (
              <Select.Option key={q.id} value={q.id}>
                {q.so} - {q.year}
              </Select.Option>
            ))}
          </Select>
        </Col>
      </Row>

      {/* 🔥 FIELD ĐỘNG */}
      <Row gutter={10} style={{ marginTop: 20 }}>
        {fields.map(f => (
          <Col span={6} key={f.id}>
            {renderField(f)}
          </Col>
        ))}
      </Row>

      <Button
        type="primary"
        style={{ marginTop: 20 }}
        onClick={add}
      >
        Thêm văn bằng
      </Button>

      {/* TABLE */}
      <Table
        style={{ marginTop: 20 }}
        dataSource={list}
        rowKey="id"
        bordered
        columns={[
          { title: 'Số vào sổ', dataIndex: 'soVaoSo' },
          { title: 'Số hiệu', dataIndex: 'soHieu' },
          { title: 'MSV', dataIndex: 'msv' },
          { title: 'Họ tên', dataIndex: 'name' },
          { title: 'Ngày sinh', dataIndex: 'dob' }
        ]}
      />

    </Card>
  )
}