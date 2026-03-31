import { Card, Row, Col, Statistic } from 'antd'
import { Column } from '@ant-design/charts'
import { useEffect, useState } from 'react'

export default function Report() {
  const [data, setData] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalClubs: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  })

  useEffect(() => {
    const reg = JSON.parse(localStorage.getItem('reg') || '[]')
    const clubs = JSON.parse(localStorage.getItem('clubs') || '[]')

    const pending = reg.filter((i: any) => i.status === 'Pending').length
    const approved = reg.filter((i: any) => i.status === 'Approved').length
    const rejected = reg.filter((i: any) => i.status === 'Rejected').length

    setStats({
      totalClubs: clubs.length,
      pending,
      approved,
      rejected
    })

    const result: any[] = []

    clubs.forEach((c: any) => {
      const list = reg.filter((i: any) => i.club === c.name)

      const p = list.filter((i: any) => i.status === 'Pending').length
      const a = list.filter((i: any) => i.status === 'Approved').length
      const r = list.filter((i: any) => i.status === 'Rejected').length

      result.push(
        { club: c.name, type: 'Pending', value: p },
        { club: c.name, type: 'Approved', value: a },
        { club: c.name, type: 'Rejected', value: r }
      )
    })

    setData(result)
  }, [])

  const config = {
    data,
    isGroup: true,
    xField: 'club',
    yField: 'value',
    seriesField: 'type',
    columnWidthRatio: 0.6,
    label: {
      position: 'middle' as const
    },
    legend: {
      position: 'top' as const
    }
  }

  return (
    <Card title="📊 Báo cáo & Thống kê">

      {/* STATISTIC */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <Statistic title="Số CLB" value={stats.totalClubs} />
        </Col>
        <Col span={6}>
          <Statistic title="Pending" value={stats.pending} />
        </Col>
        <Col span={6}>
          <Statistic title="Approved" value={stats.approved} />
        </Col>
        <Col span={6}>
          <Statistic title="Rejected" value={stats.rejected} />
        </Col>
      </Row>

      {/* CHART */}
      <Column {...config} />

    </Card>
  )
}