import { Card, Table, Button, Popconfirm, message, Tag } from 'antd'
import { useEffect, useState } from 'react'

type Course = {
  id: number
  name: string
  teacher: string
  students: number
  status: string
}

export default function Remove() {
  const [list, setList] = useState<Course[]>([])

  // LOAD DATA
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('courses') || '[]')
    setList(data)
  }, [])

  // SAVE
  const save = (data: Course[]) => {
    setList(data)
    localStorage.setItem('courses', JSON.stringify(data))
  }

  // DELETE (có điều kiện)
  const handleRemove = (record: Course) => {
    if (record.students > 0) {
      message.error('Không thể xóa khóa học đã có học viên')
      return
    }

    const newData = list.filter(item => item.id !== record.id)
    save(newData)
    message.success('Xóa thành công')
  }

  return (
    <Card title="🗑️ Xóa khóa học">

      <Table
        rowKey="id"
        bordered
        dataSource={list}
        columns={[
          { title: 'Tên khóa', dataIndex: 'name' },
          { title: 'Giảng viên', dataIndex: 'teacher' },
          { title: 'Học viên', dataIndex: 'students' },
          {
            title: 'Trạng thái',
            render: (_: any, r: Course) => {
              if (r.status === 'Đang mở')
                return <Tag color="green">Đang mở</Tag>
              if (r.status === 'Tạm dừng')
                return <Tag color="orange">Tạm dừng</Tag>
              return <Tag color="red">Đã kết thúc</Tag>
            }
          },
          {
            title: 'Hành động',
            render: (_: any, r: Course) => (
              <Popconfirm
                title="Bạn có chắc muốn xóa?"
                onConfirm={() => handleRemove(r)}
                okText="Xóa"
                cancelText="Hủy"
                disabled={r.students > 0}
              >
                <Button danger disabled={r.students > 0}>
                  Xóa
                </Button>
              </Popconfirm>
            )
          }
        ]}
      />

    </Card>
  )
}