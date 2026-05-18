import {
  Card,
  Progress,
  Button,
} from "antd";

interface Props {
  tournament: any;
  onRegister: () => void;
}

export default function TournamentSidebar({
  tournament,
  onRegister,
}: Props) {
  const percent =
    (tournament.currentTeams /
      tournament.maxTeams) *
    100;

  return (
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
        onClick={onRegister}
      >
        Đăng ký tham gia
      </Button>
    </Card>
  );
}