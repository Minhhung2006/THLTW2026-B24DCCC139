import {
  Card,
  Progress,
  Button,
} from "antd";

interface Props {
  tournament: any;
  onRegister: () => void;
  user?: any;
  isRegistered?: boolean;
}

export default function TournamentSidebar({
  tournament,
  onRegister,
  user,
  isRegistered,
}: Props) {
  const currentTeams = tournament._count?.registrations || tournament.currentTeams || 0;
  const percent =
    (currentTeams /
      tournament.maxTeams) *
    100;

  const showRegisterButton = 
    user && 
    user.role === 'USER' && 
    tournament.status === 'UPCOMING' && 
    !isRegistered;

  return (
    <Card title="Thông tin giải đấu">
      <p>
        <strong>Số đội được duyệt:</strong>{" "}
        {currentTeams}/
        {tournament.maxTeams}
      </p>

      <Progress percent={percent} status={percent >= 100 ? "success" : "active"} />

      {showRegisterButton && (
        <Button
          type="primary"
          size="large"
          block
          style={{ marginTop: 20 }}
          onClick={onRegister}
        >
          Đăng ký tham gia
        </Button>
      )}

      {isRegistered && (
        <Button
          type="default"
          size="large"
          block
          disabled
          style={{ marginTop: 20 }}
        >
          Đã đăng ký tham gia
        </Button>
      )}
    </Card>
  );
}