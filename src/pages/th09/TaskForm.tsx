import { Modal, Form, Input, DatePicker, Select } from 'antd';
import { useEffect } from 'react';
import dayjs from 'dayjs';

export interface Task {
  id?: string;
  title: string;
  description: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'doing' | 'done';
  tags: string[];
}

interface Props {
  open: boolean;
  onCancel: () => void;
  onSubmit: (task: Task) => void;
  initialData?: Task | null;
}

export default function TaskForm({
  open,
  onCancel,
  onSubmit,
  initialData,
}: Props) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.setFieldsValue({
          ...initialData,
          deadline: dayjs(initialData.deadline),
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, initialData, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      const newTask: Task = {
        id: initialData?.id || Date.now().toString(),
        title: values.title,
        description: values.description,
        deadline: values.deadline.format('YYYY-MM-DD'),
        priority: values.priority,
        status: values.status,
        tags: values.tags || [],
      };

      onSubmit(newTask);
      form.resetFields();
    });
  };

  return (
    <Modal
      visible={open} // ✅ AntD v4 đúng
      title={initialData ? 'Sửa Task' : 'Thêm Task'}
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        {/* TÊN TASK */}
        <Form.Item
          name="title"
          label="Tên task"
          rules={[{ required: true, message: 'Nhập tên task' }]}
        >
          <Input placeholder="Nhập tên task..." />
        </Form.Item>

        {/* MÔ TẢ */}
        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={3} placeholder="Mô tả..." />
        </Form.Item>

        {/* DEADLINE */}
        <Form.Item
          name="deadline"
          label="Deadline"
          rules={[{ required: true, message: 'Chọn deadline' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        {/* PRIORITY */}
        <Form.Item
          name="priority"
          label="Mức độ ưu tiên"
          rules={[{ required: true }]}
        >
          <Select placeholder="Chọn mức độ">
            <Select.Option value="high">Cao</Select.Option>
            <Select.Option value="medium">Trung bình</Select.Option>
            <Select.Option value="low">Thấp</Select.Option>
          </Select>
        </Form.Item>

        {/* STATUS */}
        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Select.Option value="todo">Cần làm</Select.Option>
            <Select.Option value="doing">Đang làm</Select.Option>
            <Select.Option value="done">Hoàn thành</Select.Option>
          </Select>
        </Form.Item>

        {/* TAG */}
        <Form.Item name="tags" label="Tag">
          <Select
            mode="tags"
            placeholder="Nhập tag và Enter"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}