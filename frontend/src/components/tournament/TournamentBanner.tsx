import { Tag, Typography } from "antd";

const { Title, Paragraph } = Typography;

interface Props {
  tournament: any;
}

export default function TournamentBanner({
  tournament,
}: Props) {
  return (
    <>
      <img
        src={tournament.banner}
        alt="banner"
        style={{
          width: "100%",
          borderRadius: 12,
          marginBottom: 20,
        }}
      />

      <Title level={2}>
        {tournament.name}
      </Title>

      <div style={{ marginBottom: 16 }}>
        <Tag color="blue">
          {tournament.game}
        </Tag>

        <Tag color="green">
          {tournament.status}
        </Tag>
      </div>

      <Paragraph>
        {tournament.description}
      </Paragraph>

      <Paragraph>
        <strong>Giải thưởng:</strong>{" "}
        {tournament.prizePool}
      </Paragraph>
    </>
  );
}