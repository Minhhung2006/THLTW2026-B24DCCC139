import {
  Card,
  Col,
  Row,
  Statistic,
} from "antd";

interface Props {
  tournaments: any[];
}

export default function TournamentStats({
  tournaments,
}: Props) {
  const total =
    tournaments.length;

  const upcoming =
    tournaments.filter(
      (item) =>
        item.status ===
        "UPCOMING"
    ).length;

  const ongoing =
    tournaments.filter(
      (item) =>
        item.status ===
        "ONGOING"
    ).length;

  const finished =
    tournaments.filter(
      (item) =>
        item.status ===
        "FINISHED"
    ).length;

  return (
    <Row
      gutter={[16, 16]}
      style={{
        marginBottom: 24,
      }}
    >
      <Col xs={24} md={12} lg={6}>
        <Card>
          <Statistic
            title="Tổng giải đấu"
            value={total}
          />
        </Card>
      </Col>

      <Col xs={24} md={12} lg={6}>
        <Card>
          <Statistic
            title="Sắp diễn ra"
            value={upcoming}
          />
        </Card>
      </Col>

      <Col xs={24} md={12} lg={6}>
        <Card>
          <Statistic
            title="Đang diễn ra"
            value={ongoing}
          />
        </Card>
      </Col>

      <Col xs={24} md={12} lg={6}>
        <Card>
          <Statistic
            title="Đã kết thúc"
            value={finished}
          />
        </Card>
      </Col>
    </Row>
  );
}