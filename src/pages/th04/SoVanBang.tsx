import {
  Card,
  InputNumber,
  Button,
  Table,
  Row,
  Col,
  Statistic,
  message,
  Popconfirm
} from 'antd'
import { useState, useEffect } from 'react'

interface SoType {
  year: number
  currentNumber: number
}

export default () => {

  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [list, setList] = useState<SoType[]>([])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('soVanBang') || '[]')
    setList(data)
  }, [])

  const save = (data: SoType[]) => {
    setList(data)
    localStorage.setItem('soVanBang', JSON.stringify(data))
  }

  const createSo = () => {

    const exist = list.find(s => s.year === year)
    if (exist) {
      message.error('Năm này đã có sổ!')
      return
    }

    const newSo = {
      year,
      currentNumber: 0
    }

    save([...list, newSo])
    message.success('Tạo sổ thành công!')
  }

  const increase = (year: number) => {

    const newList = list.map(s => {
      if (s.year === year) {
        return {
          ...s,
          currentNumber: s.currentNumber + 1
        }
      }
      return s
    })

    save(newList)
    message.success('Đã cấp số mới!')
  }

  const reset = (year: number) => {

    const newList = list.map(s => {
      if (s.year === year) {
        return {
          ...s,
          currentNumber: 0
        }
      }
      return s
    })

    save(newList)
    message.success('Đã reset sổ!')
  }

  return (
    <Card title="📘 Quản lý sổ văn bằng">

      {/* THỐNG KÊ */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={12}>
          <Statistic title="Tổng số sổ" value={list.length} />
        </Col>
        <Col span={12}>
          <Statistic
            title="Sổ năm hiện tại"
            value={
              list.find(s => s.year === new Date().getFullYear())
                ?.currentNumber || 0
            }
          />
        </Col>
      </Row>

      {/* TẠO SỔ */}
      <Row gutter={10} style={{ marginBottom: 20 }}>
        <Col>
          <InputNumber
            value={year}
            onChange={(value) =>
              setYear(value || new Date().getFullYear())
            }
          />
        </Col>

        <Col>
          <Button type="primary" onClick={createSo}>
            Tạo sổ mới
          </Button>
        </Col>
      </Row>

      {/* TABLE */}
      <Table
        dataSource={list}
        rowKey="year"
        bordered
        columns={[
          {
            title: 'Năm',
            dataIndex: 'year',
          },
          {
            title: 'Số hiện tại',
            dataIndex: 'currentNumber',
          },
          {
            title: 'Hành động',
            render: (_: any, record: SoType) => (
              <>
                <Button
                  type="primary"
                  onClick={() => increase(record.year)}
                  style={{ marginRight: 8 }}
                >
                  + Cấp số
                </Button>

                <Popconfirm
                  title="Reset sổ?"
                  onConfirm={() => reset(record.year)}
                >
                  <Button danger>Reset</Button>
                </Popconfirm>
              </>
            ),
          },
        ]}
      />
    </Card>
  )
}