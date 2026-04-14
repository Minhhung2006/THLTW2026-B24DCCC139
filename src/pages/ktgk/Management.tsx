import { Card, Table, Input, Select } from 'antd'
import { useEffect, useState } from 'react'
import { history } from 'umi'

const { Search } = Input

type Course = {
  id: number
  name: string
  teacher: string
  students: number
  status: string
}

export default function Management() {
  const [list, setList] = useState<Course[]>([])
  const [filtered, setFiltered] = useState<Course[]>([])

  const [teacher, setTeacher] = useState('')
  const [status, setStatus] = useState('')
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('courses') || '[]')
    setList(data)
    setFiltered(data)
  }, [])

  useEffect(() => {
    let data = [...list]

    if (keyword)
      data = data.filter(i =>
        i.name.toLowerCase().includes(keyword.toLowerCase())
      )

    if (teacher)
      data = data.filter(i => i.teacher === teacher)

    if (status)
      data = data.filter(i => i.status === status)

    setFiltered(data)
  }, [keyword, teacher, status, list])

  return (
    <Card title="📋 Danh sách khóa học">

      <Search
        placeholder="Tìm theo tên..."
        onChange={e => setKeyword(e.target.value)}
        style={{ marginBottom: 10 }}
      />

      <Select
        placeholder="Giảng viên"
        style={{ width: 200, marginRight: 10 }}
        onChange={setTeacher}
        allowClear
      >
        <Select.Option value="Nguyễn Văn A">Nguyễn Văn A</Select.Option>
        <Select.Option value="Trần Văn B">Trần Văn B</Select.Option>
      </Select>

      <Select
        placeholder="Trạng thái"
        style={{ width: 200 }}
        onChange={setStatus}
        allowClear
      >
        <Select.Option value="Đang mở">Đang mở</Select.Option>
        <Select.Option value="Tạm dừng">Tạm dừng</Select.Option>
        <Select.Option value="Đã kết thúc">Đã kết thúc</Select.Option>
      </Select>

      <Table
        rowKey="id"
        style={{ marginTop: 20 }}
        dataSource={filtered}
        columns={[
          { title: 'ID', dataIndex: 'id' },
          { title: 'Tên', dataIndex: 'name' },
          { title: 'Giảng viên', dataIndex: 'teacher' },
          {
            title: 'Số HV',
            dataIndex: 'students',
            sorter: (a, b) => a.students - b.students
          },
          { title: 'Trạng thái', dataIndex: 'status' },
          {
            title: 'Hành động',
            render: (_, r) => (
              <a onClick={() => history.push(`/ktgk/editor?id=${r.id}`)}>
                Sửa
              </a>
            )
          }
        ]}
      />
    </Card>
  )
}