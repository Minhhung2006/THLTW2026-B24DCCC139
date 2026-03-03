import { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Table,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Progress,
  Space,
} from 'antd';
import moment from 'moment';

const { Option } = Select;

interface StudyItem {
  id: number;
  subject: string;
  date: string;
  duration: number;
  goal: number;
  note?: string;
}

export default function Bai2() {
  const [data, setData] = useState<StudyItem[]>([]);
  const [visible, setVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<StudyItem | null>(null);
  const [form] = Form.useForm();
  useEffect(() => {
    const saved = localStorage.getItem('studyData');
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('studyData', JSON.stringify(data));
  }, [data]);

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setVisible(true);
  };

  const handleEdit = (record: StudyItem) => {
    setEditingItem(record);
    form.setFieldsValue({
      ...record,
      date: moment(record.date, 'DD/MM/YYYY'),
    });
    setVisible(true);
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const newItem: StudyItem = {
        id: editingItem ? editingItem.id : Date.now(),
        subject: values.subject,
        date: values.date.format('DD/MM/YYYY'),
        duration: values.duration,
        goal: values.goal,
        note: values.note,
      };

      if (editingItem) {
        setData(data.map(item => (item.id === editingItem.id ? newItem : item)));
      } else {
        setData([...data, newItem]);
      }

      setVisible(false);
      form.resetFields();
    });
  };

  const handleDelete = (id: number) => {
    setData(data.filter(item => item.id !== id));
  };

  return (
    <Card title="Quản lý tiến độ học tập">
      <Button type="primary" onClick={handleAdd}>
        Thêm lịch học
      </Button>

      <Table
        rowKey="id"
        dataSource={data}
        style={{ marginTop: 20 }}
        columns={[
          {
            title: 'Môn học',
            dataIndex: 'subject',
          },
          {
            title: 'Ngày học',
            dataIndex: 'date',
          },
          {
            title: 'Thời lượng (giờ)',
            dataIndex: 'duration',
          },
          {
            title: 'Tiến độ',
            render: (_, record) => {
              const percent = Math.min(
                Math.round((record.duration / record.goal) * 100),
                100,
              );
              return <Progress percent={percent} />;
            },
          },
          {
            title: 'Ghi chú',
            dataIndex: 'note',
          },
          {
            title: 'Thao tác',
            render: (_, record: StudyItem) => (
              <Space>
                <Button onClick={() => handleEdit(record)}>Sửa</Button>
                <Button danger onClick={() => handleDelete(record.id)}>
                  Xóa
                </Button>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={editingItem ? 'Chỉnh sửa lịch học' : 'Thêm lịch học'}
        visible={visible}   // ⚠ antd v4 dùng visible
        onCancel={() => setVisible(false)}
        onOk={handleSubmit}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="subject"
            label="Môn học"
            rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
          >
            <Select placeholder="Chọn môn học">
              <Option value="Toán">Toán</Option>
              <Option value="Văn">Văn</Option>
              <Option value="Anh">Anh</Option>
              <Option value="Khoa học">Khoa học</Option>
              <Option value="Công nghệ">Công nghệ</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label="Ngày học"
            rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Thời lượng học (giờ)"
            rules={[{ required: true, message: 'Nhập thời lượng' }]}
          >
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>

          <Form.Item
            name="goal"
            label="Mục tiêu tháng (giờ)"
            rules={[{ required: true, message: 'Nhập mục tiêu tháng' }]}
          >
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>

          <Form.Item name="note" label="Ghi chú">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}