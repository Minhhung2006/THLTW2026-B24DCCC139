import {
  Card,
  Row,
  Col,
  Tag,
  Input,
  Pagination,
  Typography,
  Space,
  Empty
} from 'antd'
import { useEffect, useState } from 'react'
import { history } from 'umi'

const { Search } = Input
const { Title, Text } = Typography

type Post = {
  id: number
  title: string
  slug: string
  summary: string
  content: string
  thumbnail: string
  tags: string[]
  author: string
  createdAt: string
  status: 'draft' | 'published'
  views: number
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filtered, setFiltered] = useState<Post[]>([])

  const [keyword, setKeyword] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const [page, setPage] = useState(1)
  const pageSize = 9

  // LOAD DATA
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('posts') || '[]')
      .filter((p: Post) => p.status === 'published')

    setPosts(data)
    setFiltered(data)
  }, [])

  // SEARCH + FILTER + DEBOUNCE
  useEffect(() => {
    const timer = setTimeout(() => {
      let data = [...posts]

      if (keyword) {
        data = data.filter(p =>
          p.title.toLowerCase().includes(keyword.toLowerCase())
        )
      }

      if (activeTag) {
        data = data.filter(p => p.tags.includes(activeTag))
      }

      setFiltered(data)
      setPage(1)
    }, 300)

    return () => clearTimeout(timer)
  }, [keyword, activeTag, posts])

  // PAGINATION
  const start = (page - 1) * pageSize
  const currentData = filtered.slice(start, start + pageSize)

  return (
    <div style={{ padding: 24 }}>

      {/* TITLE */}
      <Title level={2}>📰 Blog cá nhân</Title>

      {/* SEARCH */}
      <Search
        placeholder="Tìm bài viết..."
        onChange={e => setKeyword(e.target.value)}
        style={{ marginBottom: 20, maxWidth: 400 }}
        allowClear
      />

      {/* TAG FILTER */}
      <Space style={{ marginBottom: 20 }} wrap>
        <Tag
          color={!activeTag ? 'blue' : 'default'}
          onClick={() => setActiveTag(null)}
          style={{ cursor: 'pointer' }}
        >
          Tất cả
        </Tag>

        {[...new Set(posts.flatMap(p => p.tags))].map(tag => (
          <Tag
            key={tag}
            color={activeTag === tag ? 'blue' : 'default'}
            onClick={() => setActiveTag(tag)}
            style={{ cursor: 'pointer' }}
          >
            #{tag}
          </Tag>
        ))}
      </Space>

      {/* LIST */}
      {currentData.length === 0 ? (
        <Empty description="Không có bài viết" />
      ) : (
        <Row gutter={[16, 16]}>
          {currentData.map(post => (
            <Col xs={24} sm={12} md={8} key={post.id}>
              <Card
                hoverable
                cover={
                  <img
                    src={post.thumbnail}
                    style={{ height: 200, objectFit: 'cover' }}
                  />
                }
                onClick={() => history.push(`/th07/post/${post.slug}`)}
              >
                <Title level={4}>{post.title}</Title>

                <Text type="secondary">
                  {new Date(post.createdAt).toLocaleDateString()} • {post.author}
                </Text>

                <p style={{ marginTop: 10 }}>
                  {post.summary}
                </p>

                <div>
                  {post.tags.map(tag => (
                    <Tag key={tag}>#{tag}</Tag>
                  ))}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* PAGINATION */}
      <div style={{ textAlign: 'center', marginTop: 30 }}>
        <Pagination
          current={page}
          pageSize={pageSize}
          total={filtered.length}
          onChange={setPage}
        />
      </div>

    </div>
  )
}