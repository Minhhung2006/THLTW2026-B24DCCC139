import {
  Card,
  Col,
  Row,
  Statistic,
  Timeline,
  Typography
} from 'antd'
import {
  FireOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
  RiseOutlined
} from '@ant-design/icons'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

const { Title } = Typography

export default function Dashboard() {
  const [workouts, setWorkouts] = useState<any[]>([])
  const [health, setHealth] = useState<any[]>([])
  const [goals, setGoals] = useState<any[]>([])

  useEffect(() => {
    setWorkouts(JSON.parse(localStorage.getItem('workouts') || '[]'))
    setHealth(JSON.parse(localStorage.getItem('health') || '[]'))
    setGoals(JSON.parse(localStorage.getItem('goals') || '[]'))
  }, [])

  // =====================
  // 🔥 1. TỔNG BUỔI TẬP
  // =====================
  const currentMonth = dayjs().month()
  const totalWorkouts = workouts.filter(
    w => dayjs(w.date).month() === currentMonth
  ).length

  // =====================
  // 🔥 2. TỔNG CALO
  // =====================
  const totalCalories = workouts.reduce(
    (sum, w) => sum + (w.calories || 0),
    0
  )

  // =====================
  // 🔥 3. STREAK
  // =====================
  const getStreak = () => {
    const dates = workouts.map(w =>
      dayjs(w.date).format('YYYY-MM-DD')
    )
    const unique = [...new Set(dates)].sort().reverse()

    let streak = 0
    let current = dayjs()

    for (let d of unique) {
      if (dayjs(d).isSame(current, 'day')) {
        streak++
        current = current.subtract(1, 'day')
      } else break
    }

    return streak
  }

  // =====================
  // 🔥 4. GOAL %
  // =====================
  const goalPercent = () => {
    if (!goals.length) return 0
    const g = goals[0]
    return Math.min((g.current / g.target) * 100, 100)
  }

  // =====================
  // 📊 BAR CHART (tuần)
  // =====================
  const getWeeklyData = () => {
    const weeks = [1, 2, 3, 4]
    return weeks.map(week => ({
      name: `Tuần ${week}`,
      value: workouts.filter(w => {
        const wDate = dayjs(w.date)
        return (
          wDate.month() === currentMonth &&
          Math.ceil(wDate.date() / 7) === week
        )
      }).length
    }))
  }

  // =====================
  // 📈 LINE CHART (cân nặng)
  // =====================
  const weightData = health.map(h => ({
    date: dayjs(h.date).format('DD/MM'),
    weight: h.weight
  }))

  // =====================
  // ⏱ TIMELINE
  // =====================
  const latest = [...workouts]
    .sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix())
    .slice(0, 5)

  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>🏋️ Dashboard</Title>

      {/* ===== STAT CARDS ===== */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Buổi tập tháng"
              value={totalWorkouts}
              prefix={<FireOutlined />}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title="Calo đã đốt"
              value={totalCalories}
              prefix={<ThunderboltOutlined />}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title="Streak (ngày)"
              value={getStreak()}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title="Hoàn thành mục tiêu"
              value={goalPercent()}
              suffix="%"
              prefix={<RiseOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* ===== CHARTS ===== */}
      <Row gutter={16} style={{ marginTop: 30 }}>
        <Col span={12}>
          <Card title="📊 Buổi tập theo tuần">
            <BarChart width={400} height={250} data={getWeeklyData()}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="📈 Cân nặng">
            <LineChart width={400} height={250} data={weightData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="weight" />
            </LineChart>
          </Card>
        </Col>
      </Row>

      {/* ===== TIMELINE ===== */}
      <Card title="🕒 5 buổi tập gần nhất" style={{ marginTop: 30 }}>
        <Timeline>
          {latest.map((w, index) => (
            <Timeline.Item key={index}>
              {dayjs(w.date).format('DD/MM')} - {w.type} ({w.duration} phút)
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>
    </div>
  )
}