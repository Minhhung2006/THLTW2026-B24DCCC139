import { Card, Row, Col, Typography, Tag } from 'antd';
import { useEffect, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';

const { Title } = Typography;

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

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setTasks(getTasks());
  }, []);

  const refresh = (data: Task[]) => {
    setTasks(data);
    saveTasks(data);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const updated = tasks.map(task =>
      task.id === result.draggableId
        ? { ...task, status: result.destination!.droppableId as Task['status'] }
        : task
    );

    refresh(updated);
  };

  const columns = {
    todo: '📝 Cần làm',
    doing: '⚡ Đang làm',
    done: '✅ Hoàn thành',
  };

  const columnKeys: Array<keyof typeof columns> = [
    'todo',
    'doing',
    'done',
  ];

  const getColor = (priority: string) => {
    if (priority === 'high') return 'red';
    if (priority === 'medium') return 'orange';
    return 'green';
  };

  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>📌 Kanban Board</Title>

      <DragDropContext onDragEnd={onDragEnd}>
        <Row gutter={16}>
          {columnKeys.map(col => (
            <Col span={8} key={col}>
              <Card title={columns[col]}>
                <Droppable droppableId={col}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        minHeight: 400,
                        background: '#fafafa',
                        padding: 10,
                        borderRadius: 8,
                      }}
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
                                style={{
                                  marginBottom: 12,
                                  cursor: 'grab',
                                  borderRadius: 10,
                                }}
                                ref={prov.innerRef}
                                {...prov.draggableProps}
                                {...prov.dragHandleProps}
                              >
                                <b>{task.title}</b>

                                <div style={{ fontSize: 12, marginTop: 5 }}>
                                  📅 {task.deadline}
                                </div>

                                <div style={{ marginTop: 5 }}>
                                  <Tag color={getColor(task.priority)}>
                                    {task.priority}
                                  </Tag>
                                </div>

                                {task.description && (
                                  <div
                                    style={{
                                      fontSize: 12,
                                      marginTop: 5,
                                      color: '#666',
                                    }}
                                  >
                                    {task.description}
                                  </div>
                                )}
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
    </div>
  );
}