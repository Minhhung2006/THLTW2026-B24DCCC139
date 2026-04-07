import {
  Card,
  Row,
  Col,
  Typography,
  Table,
  Progress
} from 'antd'
import { useEffect, useState } from 'react'

const { Title } = Typography

export default function Report() {
  const [trip, setTrip] = useState<any[]>([])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('trip') || '[]')
    setTrip(data)
  }, [])

  const totalTrips = trip.length
  const totalMoney = trip.reduce((s, i) => s + (i.price || 0), 0)

  const monthly = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    value: Math.floor(Math.random() * 10) + 1
  }))

  const map: any = {}
  trip.forEach(i => {
    map[i.name] = (map[i.name] || 0) + 1
  })

  const top = Object.keys(map).map(k => ({
    name: k,
    count: map[k]
  })).sort((a, b) => b.count - a.count)

  const columns = [
    { title: 'Địa điểm', dataIndex: 'name' },
    { title: 'Số lần chọn', dataIndex: 'count' }
  ]

  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>📊 Báo cáo & thống kê</Title>

      {/* SUMMARY */}
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <h3>🗺️ Tổng điểm trong lịch trình</h3>
            <h1>{totalTrips}</h1>
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <h3>💰 Tổng chi phí</h3>
            <h1>{totalMoney}$</h1>
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <h3>⭐ Trung bình chi tiêu</h3>
            <h1>{totalTrips ? (totalMoney / totalTrips).toFixed(1) : 0}$</h1>
          </Card>
        </Col>
      </Row>

      {/* COLUMN CHART GIẢ */}
      <Card style={{ marginTop: 20 }}>
        <Title level={4}>📅 Lịch trình theo tháng</Title>

        <Row align="bottom" style={{ height: 200 }}>
          {monthly.map(m => (
            <Col key={m.month} span={2} style={{ textAlign: 'center' }}>
              <div
                style={{
                  height: m.value * 15,
                  background: '#1890ff',
                  margin: '0 auto',
                  width: 20
                }}
              />
              <div>Th{m.month}</div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* TOP ĐỊA ĐIỂM */}
      <Card style={{ marginTop: 20 }}>
        <Title level={4}>🔥 Địa điểm phổ biến</Title>

        <Table
          dataSource={top}
          columns={columns}
          rowKey="name"
          pagination={false}
        />
      </Card>

      {/* TỶ LỆ CHI TIÊU */}
      <Card style={{ marginTop: 20 }}>
        <Title level={4}>💸 Tỷ lệ sử dụng ngân sách</Title>

        <Progress
          percent={Math.min(100, totalMoney / 10)}
          status={totalMoney > 1000 ? 'exception' : 'active'}
        />
      </Card>

    </div>
  )
}