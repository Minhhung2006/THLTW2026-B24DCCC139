import {
  Modal,
  Form,
  Input,
  Button,
  Select,
  message,
} from "antd";

import {
  useEffect,
  useState,
} from "react";

const { Option } = Select;

interface Props {
  open: boolean;
  onClose: () => void;
  tournament: any;
  onUpdate: (values: any) => void;
}

export default function EditTournamentModal({
  open,
  onClose,
  tournament,
  onUpdate,
}: Props) {
  const [form] = Form.useForm();

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (tournament) {
      form.setFieldsValue(
        tournament
      );
    }
  }, [tournament]);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const values =
        await form.validateFields();

      onUpdate(values);

      message.success(
        "Cập nhật giải đấu thành công"
      );

      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Chỉnh sửa giải đấu"
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
          <Input placeholder="Nhập tên giải đấu" />
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
          <Select placeholder="Chọn game">
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
          <Select placeholder="Chọn trạng thái">
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
          Cập nhật
        </Button>
      </Form>
    </Modal>
  );
}