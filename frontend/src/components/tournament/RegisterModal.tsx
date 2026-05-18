import {
  Modal,
  Form,
  Input,
  Button,
  message,
} from "antd";

import { useState } from "react";

import { registerTournament } from "@/services/tournament.service";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function RegisterModal({
  open,
  onClose,
}: Props) {
  const [form] = Form.useForm();

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const values =
        await form.validateFields();

      const response =
        await registerTournament(values);

      message.success(response.message);

      form.resetFields();

      onClose();
    } catch (error) {
      console.log(error);

      message.error(
        "Đăng ký thất bại!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Đăng ký giải đấu"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
      >
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
          <Input placeholder="Nhập tên đội" />
        </Form.Item>

        <Form.Item
          label="Thông tin liên hệ"
          name="contact"
          rules={[
            {
              required: true,
              message:
                "Nhập thông tin liên hệ",
            },
          ]}
        >
          <Input placeholder="Email hoặc số điện thoại" />
        </Form.Item>

        <Button
          type="primary"
          block
          loading={loading}
          onClick={handleSubmit}
        >
          Xác nhận đăng ký
        </Button>
      </Form>
    </Modal>
  );
}