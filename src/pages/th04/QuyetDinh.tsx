import {
  Card,
  Input,
  Button,
  Table,
  DatePicker,
  Select,
  Row,
  Col,
  Tag,
  message
} from 'antd'
import { useState, useEffect } from 'react'
import moment from 'moment'

interface SoType {
  year: number
  currentNumber: number
}

interface QDType {
  id: number
  so: string
  ngay: string
  note: string
  year: number
  count: number
}

export default function QuyetDinh() {

  const [list, setList] = useState<QDType[]>([])
  const [soList, setSoList] = useState<SoType[]>([])

  const [form, setForm] = useState<{
    so?: string
    ngay?: string
    note?: string
    year?: number
  }>({})

  useEffect(() => {
    setList(JSON.parse(localStorage.getItem('quyetDinh') || '[]'))
    setSoList(JSON.parse(localStorage.getItem('soVanBang') || '[]'))
  }, [])

  const save = (data: QDType[]) => {
    setList(data)
    localStorage.setItem('quyetDinh', JSON.stringify(data))
  }

  const add = () => {

    if (!form.so || !form.ngay || !form.year) {
      message.error('Nhập đầy đủ thông tin!')
      return
    }

    if (list.find(q => q.so === form.so)) {
      message.error('Số quyết định đã tồn tại!')
      return
    }

    const newQD: QDType = {
      id: Date.now(),
      so: form.so,
      ngay: form.ngay,
      note: form.note || '',
      year: form.year,
      count: 0
    }

    save([...list, newQD])
    message.success('Thêm thành công!')

    setForm({})
  }

  return (
    <Card title="📜 Quyết định tốt nghiệp">

      {/* FORM */}
      <Row gutter={10} style={{ marginBottom: 20 }}>

        {/* SỐ QĐ */}
        <Col span={6}>
          <Input
            placeholder="Số quyết định"
            value={form.so}
            onChange={e =>
              setForm({ ...form, so: e.target.value })
            }
          />
        </Col>

        {/* NGÀY */}
        <Col span={6}>
          <DatePicker
            style={{ width: '100%' }}
            value={form.ngay ? moment(form.ngay, 'YYYY-MM-DD') : null}
            onChange={(date) =>
              setForm({
                ...form,
                ngay: date ? date.format('YYYY-MM-DD') : undefined
              })
            }
          />
        </Col>

        {/* SỔ (NĂM) */}
        <Col span={6}>
          <Select
            placeholder="Chọn năm"
            style={{ width: '100%' }}
            value={form.year}
            onChange={(value) =>
              setForm({ ...form, year: value })
            }
          >
            {soList.map(s => (
              <Select.Option key={s.year} value={s.year}>
                {s.year}
              </Select.Option>
            ))}
          </Select>
        </Col>

        {/* TRÍCH YẾU */}
        <Col span={6}>
          <Input
            placeholder="Trích yếu"
            value={form.note}
            onChange={e =>
              setForm({ ...form, note: e.target.value })
            }
          />
        </Col>

      </Row>

      <Button type="primary" onClick={add}>
        Thêm quyết định
      </Button>

      {/* TABLE */}
      <Table
        style={{ marginTop: 20 }}
        dataSource={list}
        rowKey="id"
        bordered
        columns={[
          {
            title: 'Số QĐ',
            dataIndex: 'so',
          },
          {
            title: 'Ngày ban hành',
            dataIndex: 'ngay',
          },
          {
            title: 'Năm',
            dataIndex: 'year',
            render: (year: number) => (
              <Tag color="blue">{year}</Tag>
            )
          },
          {
            title: 'Trích yếu',
            dataIndex: 'note',
          },
          {
            title: 'Lượt tra cứu',
            dataIndex: 'count',
            render: (c: number) => (
              <Tag color="green">{c}</Tag>
            )
          }
        ]}
      />
    </Card>
  )
}