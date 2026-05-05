import {
  Table,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Tag,
  Typography,
  Button,
  Modal,
  Form,
  Popconfirm,
  message,
} from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'doing' | 'done';
}

const getTasks = (): Task[] =>
  JSON.parse(localStorage.getItem('tasks') || '[]');

const saveTasks = (tasks: Task[]) =>
  localStorage.setItem('tasks', JSON.stringify(tasks));

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filtered, setFiltered] = useState<Task[]>([]);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | undefined>();
  const [range, setRange] = useState<any>(null);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const [form] = Form.useForm();

  useEffect(() => {
    const data = getTasks();
    setTasks(data);
    setFiltered(data);
  }, []);

  useEffect(() => {
    let data = [...tasks];

    if (search) {
      data = data.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      data = data.filter(t => t.status === status);
    }

    if (range) {
      const [start, end] = range;
      data = data.filter(t =>
        dayjs(t.deadline).isBetween(start, end, 'day', '[]')
      );
    }

    setFiltered(data);
  }, [search, status, range, tasks]);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const newTask: Task = {
        id: editing?.id || Date.now().toString(),
        ...values,
        deadline: values.deadline.format('YYYY-MM-DD'),
      };

      let updated;

      if (editing) {
        updated = tasks.map(t => (t.id === editing.id ? newTask : t));
        message.success('Cập nhật thành công');
      } else {
        updated = [...tasks, newTask];
        message.success('Thêm task thành công');
      }

      setTasks(updated);
      saveTasks(updated);

      setOpen(false);
      setEditing(null);
      form.resetFields();
    });
  };

  const handleEdit = (task: Task) => {
    setEditing(task);
    setOpen(true);

    form.setFieldsValue({
      ...task,
      deadline: dayjs(task.deadline),
    });
  };

  const handleDelete = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    saveTasks(updated);
    message.success('Đã xóa');
  };

  const getPriorityColor = (p: string) =>
    p === 'high' ? 'red' : p === 'medium' ? 'orange' : 'green';

  const getStatusText = (s: string) => {
    const map: any = {
      todo: 'Cần làm',
      doing: 'Đang làm',
      done: 'Hoàn thành',
    };
    return map[s];
  };

  const columns = [
    {
      title: 'Tên task',
      dataIndex: 'title',
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      sorter: (a: Task, b: Task) =>
        dayjs(a.deadline).unix() - dayjs(b.deadline).unix(),
      render: (d: string) => {
        const isOverdue =
          dayjs(d).isBefore(dayjs(), 'day');

        return (
          <Tag color={isOverdue ? 'red' : 'blue'}>
            {d}
          </Tag>
        );
      },
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'priority',
      render: (p: string) => (
        <Tag color={getPriorityColor(p)}>{p}</Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      filters: [
        { text: 'Todo', value: 'todo' },
        { text: 'Doing', value: 'doing' },
        { text: 'Done', value: 'done' },
      ],
      onFilter: (value: any, record: Task) =>
        record.status === value,
      render: (s: string) => <Tag>{getStatusText(s)}</Tag>,
    },
    {
      title: 'Hành động',
      render: (_: any, record: Task) => (
        <>
          <Button
            size="small"
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Xóa task?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger size="small">
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>📋 Task Manager</Title>

      {/* ACTION */}
      <Button
        type="primary"
        onClick={() => {
          setOpen(true);
          setEditing(null);
        }}
        style={{ marginBottom: 20 }}
      >
        + Thêm Task
      </Button>

      {/* FILTER */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <Input
            placeholder="🔍 Tìm tên task..."
            onChange={e => setSearch(e.target.value)}
          />
        </Col>

        <Col span={6}>
          <Select
            allowClear
            placeholder="Lọc trạng thái"
            style={{ width: '100%' }}
            onChange={value => setStatus(value)}
          >
            <Select.Option value="todo">Todo</Select.Option>
            <Select.Option value="doing">Doing</Select.Option>
            <Select.Option value="done">Done</Select.Option>
          </Select>
        </Col>

        <Col span={10}>
          <RangePicker
            style={{ width: '100%' }}
            onChange={value => setRange(value)}
          />
        </Col>
      </Row>

      {/* TABLE */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        pagination={{ pageSize: 5 }}
      />

      {/* MODAL */}
      <Modal
        visible={open}
        title={editing ? 'Sửa Task' : 'Thêm Task'}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Tên task" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea />
          </Form.Item>

          <Form.Item name="deadline" label="Deadline" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="priority" label="Ưu tiên" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="high">Cao</Select.Option>
              <Select.Option value="medium">Trung bình</Select.Option>
              <Select.Option value="low">Thấp</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="todo">Cần làm</Select.Option>
              <Select.Option value="doing">Đang làm</Select.Option>
              <Select.Option value="done">Hoàn thành</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}