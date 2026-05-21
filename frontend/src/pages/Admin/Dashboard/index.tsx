import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Typography, Form, Input, Select, DatePicker, InputNumber, Button, message, Space, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { createTournament } from '@/services/adminTournament.service';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const payload = {
        ...values,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
      };

      await createTournament(payload);
      message.success('Tạo giải đấu thành công!');
      form.resetFields();
      form.setFieldsValue({ status: 'UPCOMING', maxTeams: 8 });
    } catch (error: any) {
      if (error.response) {
        message.error(error.response.data.message || 'Có lỗi xảy ra khi tạo giải đấu');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title="Bảng điều khiển Admin">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Title level={4}>Chào mừng đến với hệ thống quản trị</Title>
            <p>Đây là nơi hiển thị các số liệu thống kê và quản lý nhanh.</p>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Tạo giải đấu nhanh" bordered={false}>
            <Form 
              form={form} 
              layout="vertical" 
              onFinish={handleSubmit}
              initialValues={{ status: 'UPCOMING', maxTeams: 8 }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Tên giải đấu"
                    rules={[{ required: true, message: 'Vui lòng nhập tên giải đấu' }]}
                  >
                    <Input placeholder="Nhập tên giải" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="game"
                    label="Game"
                    rules={[{ required: true, message: 'Vui lòng chọn game' }]}
                  >
                    <Select
                      placeholder="Chọn game"
                      options={[
                        { label: 'Liên Quân Mobile', value: 'Liên Quân Mobile' },
                        { label: 'PUBG Mobile', value: 'PUBG Mobile' },
                        { label: 'Free Fire', value: 'Free Fire' },
                        { label: 'League of Legends', value: 'League of Legends' },
                        { label: 'VALORANT', value: 'VALORANT' },
                        { label: 'FC Online', value: 'FC Online' },
                        { label: 'Mobile Legends: Bang Bang', value: 'Mobile Legends: Bang Bang' },
                        { label: 'Teamfight Tactics', value: 'Teamfight Tactics' },
                        { label: 'Counter-Strike 2', value: 'Counter-Strike 2' },
                        { label: 'Dota 2', value: 'Dota 2' },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="banner" label="Banner URL">
                    <Input placeholder="Nhập link ảnh banner" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="status" label="Trạng thái">
                    <Select
                      options={[
                        { label: 'UPCOMING', value: 'UPCOMING' },
                        { label: 'ONGOING', value: 'ONGOING' },
                        { label: 'FINISHED', value: 'FINISHED' },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="startDate"
                    label="Ngày bắt đầu"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
                  >
                    <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    name="endDate"
                    label="Ngày kết thúc"
                    dependencies={['startDate']}
                    rules={[
                      { required: true, message: 'Vui lòng chọn ngày kết thúc' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const start = getFieldValue('startDate');
                          if (!value || !start || value.isAfter(start) || value.isSame(start)) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Ngày kết thúc phải sau hoặc bằng ngày bắt đầu'));
                        },
                      }),
                    ]}
                  >
                    <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    name="maxTeams"
                    label="Số đội tối đa"
                    rules={[{ required: true, message: 'Vui lòng nhập số đội tối đa' }]}
                  >
                    <InputNumber min={2} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<PlusOutlined />} loading={loading}>
                  Tạo giải đấu
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Dashboard;
