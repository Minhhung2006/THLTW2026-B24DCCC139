import {
  Modal,
  Form,
  Input,
  Button,
  Select,
  message,
} from "antd";

import { useState } from "react";

const { Option } = Select;

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (values: any) => void;
}

export default function CreateTournamentModal({
  open,
  onClose,
  onCreate,
}: Props) {
  const [form] = Form.useForm();

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const values =
        await form.validateFields();

      onCreate(values);

      message.success(
        "Tạo giải đấu thành công"
      );

      form.resetFields();

      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Tạo giải đấu"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          label="Tên giải đấu"
          name="name"
          rules={[
            {
              required: true,
              message:
                "Nhập tên giải đấu",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Game"
          name="game"
          rules={[
            {
              required: true,
              message: "Chọn game",
            },
          ]}
        >
          <Select>
            <Option value="Valorant">
              Valorant
            </Option>

            <Option value="League of Legends">
              League of Legends
            </Option>

            <Option value="CS2">
              CS2
            </Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[
            {
              required: true,
              message:
                "Chọn trạng thái",
            },
          ]}
        >
          <Select>
            <Option value="UPCOMING">
              UPCOMING
            </Option>

            <Option value="ONGOING">
              ONGOING
            </Option>

            <Option value="FINISHED">
              FINISHED
            </Option>
          </Select>
        </Form.Item>

        <Button
          type="primary"
          block
          loading={loading}
          onClick={handleSubmit}
        >
          Tạo giải đấu
        </Button>
      </Form>
    </Modal>
  );
}