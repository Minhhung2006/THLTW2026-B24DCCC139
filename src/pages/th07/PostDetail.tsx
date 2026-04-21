import {
  Card,
  Tag,
  Typography,
  Space,
  Button,
  Row,
  Col,
  Divider
} from 'antd'
import {
  ArrowLeftOutlined,
  EyeOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import { history, useParams } from 'umi'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'
import { useEffect, useState } from 'react'

const { Title, Text } = Typography

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<any>(null)
  const [related, setRelated] = useState<any[]>([])

  useEffect(() => {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]')
    const current = posts.find((p: any) => p.slug === slug)

    if (!current) return

    // ✅ tăng view
    current.views = (current.views || 0) + 1

    const updated = posts.map((p: any) =>
      p.slug === slug ? current : p
    )

    localStorage.setItem('posts', JSON.stringify(updated))
    setPost(current)

    // ✅ bài liên quan
    const relatedPosts = posts.filter(
      (p: any) =>
        p.slug !== slug &&
        p.tags?.some((t: string) => current.tags?.includes(t))
    )

    setRelated(relatedPosts.slice(0, 3))
  }, [slug])

  if (!post) return <p>Không tìm thấy bài viết</p>

  return (
    <div style={{ maxWidth: 1000, margin: 'auto', padding: 20 }}>

      {/* BACK */}
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => history.push('/th07/home')}
        style={{ marginBottom: 20 }}
      >
        Quay lại
      </Button>

      {/* COVER */}
      {post.image && (
        <img
          src={post.image}
          style={{
            width: '100%',
            height: 350,
            objectFit: 'cover',
            borderRadius: 12,
            marginBottom: 20
          }}
        />
      )}

      {/* MAIN */}
      <Card bordered={false} style={{ padding: 20 }}>
        <Title>{post.title}</Title>

        {/* META */}
        <Space size="large" style={{ marginBottom: 16 }}>
          <Text type="secondary">✍️ {post.author || 'Admin'}</Text>

          <Text type="secondary">
            📅 {new Date(post.createdAt).toLocaleDateString()}
          </Text>

          <Text type="secondary">
            <ClockCircleOutlined /> 5 phút đọc
          </Text>

          <Text>
            <EyeOutlined /> {post.views || 0}
          </Text>
        </Space>

        {/* TAG */}
        <div style={{ marginBottom: 20 }}>
          {post.tags?.map((tag: string) => (
            <Tag color="geekblue" key={tag}>
              #{tag}
            </Tag>
          ))}
        </div>

        <Divider />

        {/* CONTENT */}
        <div style={{ fontSize: 16, lineHeight: 1.8 }}>
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </Card>

      {/* RELATED */}
      <Card
        title="🔥 Bài viết liên quan"
        style={{ marginTop: 30 }}
        bordered={false}
      >
        <Row gutter={[16, 16]}>
          {related.map((item) => (
            <Col span={8} key={item.slug}>
              <Card
                hoverable
                style={{ borderRadius: 10 }}
                cover={
                  <img
                    src={item.image}
                    style={{
                      height: 160,
                      objectFit: 'cover',
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10
                    }}
                  />
                }
                onClick={() =>
                  history.push(`/th07/post/${item.slug}`)
                }
              >
                <Title level={5}>{item.title}</Title>
                <Text type="secondary">
                  👁 {item.views || 0} lượt xem
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

    </div>
  )
}