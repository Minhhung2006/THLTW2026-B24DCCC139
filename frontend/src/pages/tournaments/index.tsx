import {
  Card,
  Col,
  Row,
  Tag,
  Progress,
  Button,
  Typography,
} from "antd";

import { useParams } from "react-router-dom";

const { Title, Paragraph } = Typography;

export default function TournamentDetail() {
  const params = useParams();

  const tournament = {
    id: params.id,
    name: "Valorant Champions 2026",
    game: "Valorant",
    status: "UPCOMING",
    maxTeams: 16,
    currentTeams: 10,
    prizePool: "50,000,000 VNĐ",
    description:
      "Giải đấu Valorant dành cho các đội tuyển bán chuyên và chuyên nghiệp.",
    banner:
      "https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt0f5b8f7c18d4d5bb/valorant-champions.jpg",
  };

  const percent =
    (tournament.currentTeams / tournament.maxTeams) * 100;

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[24, 24]}>
        {/* LEFT */}
        <Col xs={24} lg={16}>
          <Card>
            <img
              src={tournament.banner}
              alt="banner"
              style={{
                width: "100%",
                borderRadius: 12,
                marginBottom: 20,
              }}
            />

            <Title level={2}>{tournament.name}</Title>

            <div style={{ marginBottom: 16 }}>
              <Tag color="blue">{tournament.game}</Tag>

              <Tag color="green">{tournament.status}</Tag>
            </div>

            <Paragraph>
              {tournament.description}
            </Paragraph>

            <Paragraph>
              <strong>Giải thưởng:</strong>{" "}
              {tournament.prizePool}
            </Paragraph>
          </Card>
        </Col>

        {/* RIGHT */}
        <Col xs={24} lg={8}>
          <Card title="Thông tin giải đấu">
            <p>
              <strong>Số đội:</strong>{" "}
              {tournament.currentTeams}/
              {tournament.maxTeams}
            </p>

            <Progress percent={percent} />

            <Button
              type="primary"
              size="large"
              block
              style={{ marginTop: 20 }}
            >
              Đăng ký tham gia
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}