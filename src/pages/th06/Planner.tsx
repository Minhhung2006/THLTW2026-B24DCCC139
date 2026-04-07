import {
  Card,
  Button,
  Select,
  Typography,
  Divider,
  Tag,
  Space,
  Empty
} from 'antd'
import { useEffect, useState } from 'react'

const { Title } = Typography

export default function Planner() {
  const [places, setPlaces] = useState<any[]>([])
  const [trip, setTrip] = useState<any[]>([])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('destinations') || '[]')
    setPlaces(data)

    const saved = JSON.parse(localStorage.getItem('trip') || '[]')
    setTrip(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem('trip', JSON.stringify(trip))
  }, [trip])

  const add = (id: number) => {
    const p = places.find(i => i.id === id)
    if (!p) return

    const newItem = {
      ...p,
      day: trip.length ? trip[trip.length - 1].day : 1
    }

    setTrip([...trip, newItem])
  }

  const remove = (index: number) => {
    setTrip(trip.filter((_, i) => i !== index))
  }

  const changeDay = (index: number, type: 'up' | 'down') => {
    const newTrip = [...trip]
    if (type === 'up') newTrip[index].day++
    if (type === 'down' && newTrip[index].day > 1) newTrip[index].day--
    setTrip(newTrip)
  }

  const move = (index: number, dir: 'up' | 'down') => {
    const newTrip = [...trip]
    const target = dir === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= trip.length) return

    ;[newTrip[index], newTrip[target]] = [newTrip[target], newTrip[index]]
    setTrip(newTrip)
  }

  const grouped: any = {}
  trip.forEach(i => {
    if (!grouped[i.day]) grouped[i.day] = []
    grouped[i.day].push(i)
  })

  const days = Object.keys(grouped).sort((a, b) => Number(a) - Number(b))

  const total = trip.reduce((s, i) => s + (i.price || 0), 0)

  const travelTime = trip.reduce((time, curr, index) => {
    if (index === 0) return 0
    const prev = trip[index - 1]

    if (prev.type === curr.type) return time + 1
    if (prev.type === 'thành phố') return time + 2
    return time + 3
  }, 0)

  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>✈️ Planner Pro</Title>

      {/* SELECT */}
      <Select
        style={{ width: 300 }}
        placeholder="Chọn điểm đến"
        onChange={add}
      >
        {places.map(p => (
          <Select.Option key={p.id} value={p.id}>
            {p.name}
          </Select.Option>
        ))}
      </Select>

      <Divider />

      {trip.length === 0 && <Empty description="Chưa có lịch trình" />}

      {/* TIMELINE */}
      {days.map(day => {
        const list = grouped[day]
        const dayTotal = list.reduce((s: number, i: any) => s + i.price, 0)

        return (
          <div key={day} style={{ marginBottom: 40 }}>
            <Title level={4}>📅 Ngày {day}</Title>

            {list.map((i: any, idx: number) => {
              const globalIndex = trip.findIndex(t => t === i)

              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    marginBottom: 20
                  }}
                >
                  {/* TIMELINE DOT */}
                  <div style={{ marginRight: 10 }}>
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        background: '#1890ff',
                        borderRadius: '50%'
                      }}
                    />
                    <div
                      style={{
                        width: 2,
                        height: 80,
                        background: '#ddd',
                        margin: '0 auto'
                      }}
                    />
                  </div>

                  {/* CARD */}
                  <Card style={{ flex: 1 }} hoverable>
                    <Title level={5}>{i.name}</Title>

                    <Tag color="blue">{i.type}</Tag>

                    <p>💰 {i.price}$</p>

                    <Space wrap>
                      <Button onClick={() => changeDay(globalIndex, 'up')}>
                        + Ngày
                      </Button>

                      <Button onClick={() => changeDay(globalIndex, 'down')}>
                        - Ngày
                      </Button>

                      <Button onClick={() => move(globalIndex, 'up')}>
                        ↑
                      </Button>

                      <Button onClick={() => move(globalIndex, 'down')}>
                        ↓
                      </Button>

                      <Button danger onClick={() => remove(globalIndex)}>
                        Xóa
                      </Button>
                    </Space>
                  </Card>
                </div>
              )
            })}

            <p>
              👉 Tổng ngày {day}: <b>{dayTotal}$</b>
            </p>
          </div>
        )
      })}

      <Divider />

      {/* SUMMARY */}
      <Card>
        <h3>💰 Tổng chi phí: {total}$</h3>
        <h3>⏱️ Thời gian di chuyển: {travelTime} giờ</h3>
      </Card>
    </div>
  )
}