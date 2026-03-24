import {
  Card,
  Input,
  Button,
  Table,
  Row,
  Col,
  DatePicker,
  message,
  Modal
} from 'antd'
import { useEffect, useState } from 'react'

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

interface QDType {
  id: number
  so: string
  year: number
  count?: number
}

export default function TraCuu() {

  const [list, setList] = useState<VBType[]>([])
  const [qdList, setQdList] = useState<QDType[]>([])
  const [result, setResult] = useState<VBType[]>([])
  const [form, setForm] = useState<any>({})
  const [detail, setDetail] = useState<VBType | null>(null)

  useEffect(() => {
    setList(JSON.parse(localStorage.getItem('vanBang') || '[]'))
    setQdList(JSON.parse(localStorage.getItem('quyetDinh') || '[]'))
  }, [])

  const countFilled = () => {
    let count = 0
    if (form.soHieu) count++
    if (form.soVaoSo) count++
    if (form.msv) count++
    if (form.name) count++
    if (form.dob) count++
    return count
  }

  const search = () => {

    if (countFilled() < 2) {
      message.error('Nhập ít nhất 2 điều kiện!')
      return
    }

    const data = list.filter(item => {
      return (
        (!form.soHieu || item.soHieu.includes(form.soHieu)) &&
        (!form.soVaoSo || item.soVaoSo == form.soVaoSo) &&
        (!form.msv || item.msv.includes(form.msv)) &&
        (!form.name || item.name.toLowerCase().includes(form.name.toLowerCase())) &&
        (!form.dob || item.dob === form.dob)
      )
    })

    setResult(data)
  }

  const viewDetail = (record: VBType) => {

    const newQD = qdList.map(q => {
      if (q.id === record.qdId) {
        return { ...q, count: (q.count || 0) + 1 }
      }
      return q
    })

    localStorage.setItem('quyetDinh', JSON.stringify(newQD))
    setQdList(newQD)

    setDetail(record)
  }

  return (
    <Card title="🔎 Tra cứu văn bằng">

      {/* FORM */}
      <Row gutter={10}>

        <Col span={4}>
          <Input
            placeholder="Số hiệu"
            onChange={e => setForm({ ...form, soHieu: e.target.value })}
          />
        </Col>

        <Col span={4}>
          <Input
            placeholder="Số vào sổ"
            onChange={e => setForm({ ...form, soVaoSo: e.target.value })}
          />
        </Col>

        <Col span={4}>
          <Input
            placeholder="MSV"
            onChange={e => setForm({ ...form, msv: e.target.value })}
          />
        </Col>

        <Col span={4}>
          <Input
            placeholder="Họ tên"
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </Col>

        <Col span={4}>
          <DatePicker
            style={{ width: '100%' }}
            onChange={(date) =>
              setForm({
                ...form,
                dob: date ? date.format('YYYY-MM-DD') : null
              })
            }
          />
        </Col>

        <Col span={4}>
          <Button type="primary" onClick={search}>
            Tìm
          </Button>
        </Col>

      </Row>

      {/* TABLE */}
      <Table
        style={{ marginTop: 20 }}
        dataSource={result}
        rowKey="id"
        bordered
        columns={[
          { title: 'Số vào sổ', dataIndex: 'soVaoSo' },
          { title: 'Số hiệu', dataIndex: 'soHieu' },
          { title: 'MSV', dataIndex: 'msv' },
          { title: 'Họ tên', dataIndex: 'name' },
          {
            title: 'Chi tiết',
            render: (_: any, record: VBType) => (
              <Button onClick={() => viewDetail(record)}>
                Xem
              </Button>
            )
          }
        ]}
      />

      {/* MODAL */}
      <Modal
        title="Chi tiết văn bằng"
        visible={!!detail} // ✅ antd v4
        onCancel={() => setDetail(null)}
        footer={null}
      >
        {detail && (
          <>
            <p><b>Số vào sổ:</b> {detail.soVaoSo}</p>
            <p><b>Số hiệu:</b> {detail.soHieu}</p>
            <p><b>MSV:</b> {detail.msv}</p>
            <p><b>Họ tên:</b> {detail.name}</p>
            <p><b>Ngày sinh:</b> {detail.dob}</p>

            <p><b>Thông tin thêm:</b></p>
            {Object.entries(detail.extra || {}).map(([k, v]) => (
              <p key={k}>
                {k}: {String(v)}
              </p>
            ))}
          </>
        )}
      </Modal>

    </Card>
  )
}