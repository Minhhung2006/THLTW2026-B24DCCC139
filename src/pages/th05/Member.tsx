import {
  Card,
  Table,
  Select,
  Button,
  Modal,
  message,
  Tag
} from 'antd'
import { useEffect, useState } from 'react'

export default function Member() {
  const [members, setMembers] = useState<any[]>([])
  const [clubs, setClubs] = useState<any[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const [open, setOpen] = useState(false)
  const [targetClub, setTargetClub] = useState<string>('')

  useEffect(() => {
    const reg = JSON.parse(localStorage.getItem('reg') || '[]')
    const club = JSON.parse(localStorage.getItem('clubs') || '[]')

    // chỉ lấy Approved
    const approved = reg.filter((i: any) => i.status === 'Approved')

    setMembers(approved)
    setClubs(club)
  }, [])

  // SAVE + SYNC localStorage
  const save = (updatedMembers: any[]) => {
    setMembers(updatedMembers)

    const reg = JSON.parse(localStorage.getItem('reg') || '[]')

    const updated = reg.map((i: any) => {
      const found = updatedMembers.find(m => m.id === i.id)
      return found ? found : i
    })

    localStorage.setItem('reg', JSON.stringify(updated))
  }

  // CHUYỂN CLB (FIX TS7030 + validate)
  const changeClub = (): void => {
    if (!targetClub) {
      message.error('Chọn CLB')
      return
    }

    if (!selectedRowKeys.length) {
      message.error('Chọn thành viên')
      return
    }

    const data = members.map(i =>
      selectedRowKeys.includes(i.id)
        ? { ...i, club: targetClub }
        : i
    )

    save(data)

    setOpen(false)
    setSelectedRowKeys([])
    setTargetClub('')

    message.success(`Đã chuyển ${data.filter(i => selectedRowKeys.includes(i.id)).length} thành viên`)
  }

  return (
    <Card title="👥 Thành viên CLB">

      {/* ACTION */}
      <div style={{ marginBottom: 10 }}>
        <Button
          type="primary"
          disabled={!selectedRowKeys.length}
          onClick={() => setOpen(true)}
        >
          Chuyển CLB ({selectedRowKeys.length})
        </Button>
      </div>

      {/* TABLE */}
      <Table
        rowKey="id"
        bordered
        dataSource={members}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys)
        }}
        columns={[
          { title: 'Họ tên', dataIndex: 'name' },
          { title: 'Email', dataIndex: 'email' },
          { title: 'SĐT', dataIndex: 'phone' },
          { title: 'Giới tính', dataIndex: 'gender' },
          {
            title: 'CLB',
            dataIndex: 'club',
            render: (c: string) => <Tag color="blue">{c}</Tag>
          }
        ]}
      />

      {/* MODAL CHUYỂN CLB */}
      <Modal
        title={`Chuyển ${selectedRowKeys.length} thành viên`}
        visible={open} 
        onCancel={() => setOpen(false)}
        onOk={changeClub}
      >
        <Select
          style={{ width: '100%' }}
          placeholder="Chọn CLB"
          value={targetClub || undefined}
          onChange={(v) => setTargetClub(v)}
        >
          {clubs.map(c => (
            <Select.Option key={c.id} value={c.name}>
              {c.name}
            </Select.Option>
          ))}
        </Select>
      </Modal>

    </Card>
  )
}