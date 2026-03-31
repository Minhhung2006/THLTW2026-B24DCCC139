import { Card, Row, Col, Statistic, Table } from 'antd'
import { useEffect, useState } from 'react'

export default function Report() {
  const [stats, setStats] = useState({
    totalClubs: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  })

  const [tableData, setTableData] = useState<any[]>([])

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

    const data = clubs.map((c: any) => {
      const list = reg.filter((i: any) => i.club === c.name)

      return {
        key: c.id,
        club: c.name,
        pending: list.filter((i: any) => i.status === 'Pending').length,
        approved: list.filter((i: any) => i.status === 'Approved').length,
        rejected: list.filter((i: any) => i.status === 'Rejected').length
      }
    })

    setTableData(data)
  }, [])

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

      {/* TABLE GIỐNG CHART */}
      <Table
        bordered
        dataSource={tableData}
        columns={[
          { title: 'CLB', dataIndex: 'club' },
          { title: 'Pending', dataIndex: 'pending' },
          { title: 'Approved', dataIndex: 'approved' },
          { title: 'Rejected', dataIndex: 'rejected' }
        ]}
      />

    </Card>
  )
}