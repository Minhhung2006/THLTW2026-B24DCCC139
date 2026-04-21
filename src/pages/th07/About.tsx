import { Card, Row, Col, Tag, Typography, Space } from 'antd'
import {
  GithubOutlined,
  FacebookOutlined,
  MailOutlined
} from '@ant-design/icons'

const { Title, Paragraph } = Typography

export default function About() {
  return (
    <Card style={{ maxWidth: 900, margin: 'auto' }}>
      <Row gutter={32} align="middle">
        
        {/* AVATAR */}
        <Col span={8} style={{ textAlign: 'center' }}>
          <img
            src="/avatar.jpg"
            style={{
              width: 180,
              height: 180,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '4px solid #f0f0f0'
            }}
          />
        </Col>

        {/* INFO */}
        <Col span={16}>
          <Title level={2}>Ngô Minh Hưng</Title>

          <Paragraph>
            🎓 Sinh viên Công nghệ thông tin - PTIT  
            <br />
            💻 Định hướng: Frontend Developer (ReactJS)
          </Paragraph>

          <Paragraph>
            Mình yêu thích xây dựng giao diện đẹp, tối ưu trải nghiệm người dùng
            và phát triển các hệ thống quản lý web.
          </Paragraph>

          {/* SKILLS */}
          <Title level={4}>Kỹ năng</Title>
          <Space wrap>
            <Tag color="blue">ReactJS</Tag>
            <Tag color="green">TypeScript</Tag>
            <Tag color="purple">Ant Design</Tag>
            <Tag color="orange">JavaScript</Tag>
            <Tag color="cyan">HTML/CSS</Tag>
          </Space>

          {/* SOCIAL */}
          <Title level={4} style={{ marginTop: 20 }}>
            Liên hệ
          </Title>

          <Space size="large">
            <a href="https://github.com/Minhhung2006" target="_blank">
              <GithubOutlined style={{ fontSize: 24 }} />
            </a>

            <a href="https://facebook.com/" target="_blank">
              <FacebookOutlined style={{ fontSize: 24, color: '#1877f2' }} />
            </a>

            <a href="mailto:youremail@gmail.com">
              <MailOutlined style={{ fontSize: 24, color: 'red' }} />
            </a>
          </Space>
        </Col>

      </Row>
    </Card>
  )
}