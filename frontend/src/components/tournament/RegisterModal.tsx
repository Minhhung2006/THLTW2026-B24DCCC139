import {
  Modal,
  Form,
  Input,
  Button,
  message,
} from "antd";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function RegisterModal({
  open,
  onClose,
}: Props) {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values =
        await form.validateFields();

      console.log(values);

      message.success(
        "Đăng ký thành công!"
      );

      form.resetFields();

      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      title="Đăng ký giải đấu"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên đội"
          name="teamName"
          rules={[
            {
              required: true,
              message: "Nhập tên đội",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Liên hệ"
          name="contact"
          rules={[
            {
              required: true,
              message: "Nhập liên hệ",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Button
          type="primary"
          block
          onClick={handleSubmit}
        >
          Xác nhận đăng ký
        </Button>
      </Form>
    </Modal>
  );
}