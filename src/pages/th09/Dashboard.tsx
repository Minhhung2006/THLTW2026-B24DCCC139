import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Table,
  Tag,
} from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const { Title } = Typography;

interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'doing' | 'done';
  tags?: string[];
}

const getTasks = (): Task[] =>
  JSON.parse(localStorage.getItem('tasks') || '[]');

const saveTasks = (tasks: Task[]) =>
  localStorage.setItem('tasks', JSON.stringify(tasks));

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setTasks(getTasks());
  }, []);

  const refresh = (data: Task[]) => {
    setTasks(data);
    saveTasks(data);
  };

  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  const overdue = tasks.filter(
    t => t.status !== 'done' && dayjs(t.deadline).isBefore(dayjs())
  ).length;

  const onFinish = (values: any) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: values.title,
      description: values.description,
      deadline: values.deadline.format('YYYY-MM-DD'),
      priority: values.priority,
      status: values.status,
      tags: [],
    };

    refresh([...tasks, newTask]);
    setOpen(false);
    form.resetFields();
  };

  const handleDelete = (id: string) => {
    refresh(tasks.filter(t => t.id !== id));
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const updated = tasks.map(t =>
      t.id === result.draggableId
        ? { ...t, status: result.destination.droppableId }
        : t
    );

    refresh(updated);
  };

  const columnsMap = {
    todo: 'Cần làm',
    doing: 'Đang làm',
    done: 'Hoàn thành',
  };

  const columnKeys: Array<keyof typeof columnsMap> = [
    'todo',
    'doing',
    'done',
  ];

  const tableColumns = [
    {
      title: 'Tên',
      dataIndex: 'title',
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'priority',
      render: (p: string) => {
        const color =
          p === 'high' ? 'red' : p === 'medium' ? 'orange' : 'green';
        return <Tag color={color}>{p}</Tag>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
    },
    {
      title: 'Hành động',
      render: (_: any, record: Task) => (
        <Button danger onClick={() => handleDelete(record.id)}>
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>Task Manager</Title>

      {/* DASHBOARD */}
      <Row gutter={16}>
        <Col span={8}>
          <Card> Tổng task: {total} </Card>
        </Col>
        <Col span={8}>
          <Card> Hoàn thành: {done} </Card>
        </Col>
        <Col span={8}>
          <Card> Quá hạn: {overdue} </Card>
        </Col>
      </Row>

      <br />

      <Button type="primary" onClick={() => setOpen(true)}>
        + Thêm task
      </Button>

      {/* KANBAN */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Row gutter={16} style={{ marginTop: 20 }}>
          {columnKeys.map(col => (
            <Col span={8} key={col}>
              <Card title={columnsMap[col]}>
                <Droppable droppableId={col}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{ minHeight: 200 }}
                    >
                      {tasks
                        .filter(t => t.status === col)
                        .map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(prov) => (
                              <Card
                                size="small"
                                style={{ marginBottom: 10 }}
                                ref={prov.innerRef}
                                {...prov.draggableProps}
                                {...prov.dragHandleProps}
                              >
                                <b>{task.title}</b>
                                <div style={{ fontSize: 12 }}>
                                  {task.deadline}
                                </div>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Card>
            </Col>
          ))}
        </Row>
      </DragDropContext>

      <br />

      {/* TABLE */}
      <Table
        rowKey="id"
        dataSource={tasks}
        columns={tableColumns}
      />

      {/* MODAL (ANTD v4 FIX) */}
      <Modal
        visible={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        title="Thêm task"
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="title"
            label="Tên task"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input />
          </Form.Item>

          <Form.Item
            name="deadline"
            label="Deadline"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="priority" label="Ưu tiên">
            <Select>
              <Select.Option value="high">Cao</Select.Option>
              <Select.Option value="medium">Trung bình</Select.Option>
              <Select.Option value="low">Thấp</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="status" label="Trạng thái">
            <Select>
              <Select.Option value="todo">Todo</Select.Option>
              <Select.Option value="doing">Doing</Select.Option>
              <Select.Option value="done">Done</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}