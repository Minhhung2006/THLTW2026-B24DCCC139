import { Card, Col, Row, Statistic } from 'antd';

export default function Dashboard() {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');

  const totalStockValue = products.reduce(
    (sum: number, p: any) => sum + p.price * p.quantity,
    0,
  );

  const revenue = orders
    .filter((o: any) => o.status === 'Hoàn thành')
    .reduce((sum: number, o: any) => sum + o.totalAmount, 0);

  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card>
          <Statistic title="Tổng sản phẩm" value={products.length} />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic title="Giá trị tồn kho" value={totalStockValue} />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic title="Tổng đơn hàng" value={orders.length} />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic title="Doanh thu" value={revenue} />
        </Card>
      </Col>
    </Row>
  );
}
