import {
  Card,
  Select,
  Row,
  Col,
  Rate,
  Slider,
  Typography,
  Tag,
  Input,
  Empty,
  Button
} from 'antd'
import { useEffect, useState } from 'react'

const { Title } = Typography
const { Search } = Input

export default function Home() {
  const [list, setList] = useState<any[]>([])

  const [type, setType] = useState<string>('')
  const [price, setPrice] = useState<[number, number]>([0, 1000])
  const [rating, setRating] = useState<number>(0)
  const [sort, setSort] = useState<string>('')
  const [keyword, setKeyword] = useState<string>('')

  // ✅ AUTO DATA (CÁCH 2)
  useEffect(() => {
    if (!localStorage.getItem('destinations')) {
      localStorage.setItem('destinations', JSON.stringify([
        { id: 1, name: 'Đà Nẵng', type: 'biển', price: 300, rating: 4.5, img: 'https://picsum.photos/300?1' },
        { id: 2, name: 'Sapa', type: 'núi', price: 200, rating: 4, img: 'https://picsum.photos/300?2' },
        { id: 3, name: 'Hà Nội', type: 'thành phố', price: 150, rating: 4.2, img: 'https://picsum.photos/300?3' },
        { id: 4, name: 'Phú Quốc', type: 'biển', price: 400, rating: 4.8, img: 'https://picsum.photos/300?4' },
        { id: 5, name: 'Đà Lạt', type: 'núi', price: 250, rating: 4.6, img: 'https://picsum.photos/300?5' }
      ]))
    }

    const data = JSON.parse(localStorage.getItem('destinations') || '[]')
    setList(data)
  }, [])

  // RESET
  const reset = () => {
    setType('')
    setPrice([0, 1000])
    setRating(0)
    setSort('')
    setKeyword('')
  }

  // FILTER
  let filtered = list.filter(i =>
    (!type || i.type === type) &&
    i.price >= price[0] &&
    i.price <= price[1] &&
    i.rating >= rating &&
    (!keyword || i.name.toLowerCase().includes(keyword.toLowerCase()))
  )

  // SORT
  if (sort === 'price_asc') filtered.sort((a, b) => a.price - b.price)
  if (sort === 'price_desc') filtered.sort((a, b) => b.price - a.price)
  if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating)

  return (
    <div style={{ padding: 20 }}>

      {/* TITLE */}
      <Title level={2}>🌍 Khám phá điểm đến</Title>

      {/* SEARCH */}
      <Search
        placeholder="Tìm kiếm điểm đến..."
        allowClear
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{ marginBottom: 20, maxWidth: 400 }}
      />

      {/* FILTER */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>

        {/* TYPE */}
        <Col xs={24} sm={12} md={6}>
          <Select
            value={type || undefined}
            placeholder="Loại hình"
            style={{ width: '100%' }}
            onChange={setType}
            allowClear
          >
            <Select.Option value="biển">🏖 Biển</Select.Option>
            <Select.Option value="núi">⛰ Núi</Select.Option>
            <Select.Option value="thành phố">🏙 Thành phố</Select.Option>
          </Select>
        </Col>

        {/* SORT */}
        <Col xs={24} sm={12} md={6}>
          <Select
            value={sort || undefined}
            placeholder="Sắp xếp"
            style={{ width: '100%' }}
            onChange={setSort}
            allowClear
          >
            <Select.Option value="price_asc">💰 Giá tăng</Select.Option>
            <Select.Option value="price_desc">💰 Giá giảm</Select.Option>
            <Select.Option value="rating">⭐ Rating cao</Select.Option>
          </Select>
        </Col>

        {/* RATING */}
        <Col xs={24} sm={12} md={6}>
          <Select
            value={rating || undefined}
            placeholder="Rating"
            style={{ width: '100%' }}
            onChange={setRating}
            allowClear
          >
            <Select.Option value={4}>⭐ 4+</Select.Option>
            <Select.Option value={3}>⭐ 3+</Select.Option>
          </Select>
        </Col>

        {/* PRICE */}
        <Col xs={24} sm={12} md={6}>
          <div>
            <div>💰 {price[0]} - {price[1]}$</div>
            <Slider
              range
              max={1000}
              value={price}
              onChange={(v: any) => setPrice(v)}
            />
          </div>
        </Col>

        {/* RESET */}
        <Col span={24}>
          <Button onClick={reset}>Reset bộ lọc</Button>
        </Col>
      </Row>

      {/* LIST */}
      <Row gutter={[16, 16]}>
        {filtered.length > 0 ? (
          filtered.map(i => (
            <Col xs={24} sm={12} md={8} lg={6} key={i.id}>
              <Card
                hoverable
                style={{ borderRadius: 12, overflow: 'hidden' }}
                cover={
                  <img
                    src={i.img}
                    alt={i.name}
                    style={{
                      height: 180,
                      objectFit: 'cover'
                    }}
                  />
                }
              >
                <Title level={5}>{i.name}</Title>

                <Tag color="blue">{i.type}</Tag>

                <p style={{ marginTop: 8 }}>
                  💰 <b>{i.price}$</b>
                </p>

                <Rate disabled value={i.rating} />
              </Card>
            </Col>
          ))
        ) : (
          <Col span={24}>
            <Empty description="Không có điểm đến phù hợp" />
          </Col>
        )}
      </Row>

    </div>
  )
}