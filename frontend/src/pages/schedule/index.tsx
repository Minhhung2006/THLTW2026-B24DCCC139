import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Typography, List, Modal, Button, Form, Select, InputNumber, Space, Tag, message, Row, Col, Spin, DatePicker, Table } from 'antd';
import { useModel } from '@umijs/max';
import { getAllTournaments, getTournamentById } from '@/services/tournament.service';
import { getAdminRegistrations } from '@/services/adminRegistration.service';
import { getMatchesByTournament, createMatch, updateMatchScore } from '@/services/schedule.service';
import PageTransition from '@/components/motion/PageTransition';
import { StaggerContainer, AnimatedItem } from '@/components/motion/AnimatedList';
import './schedule.css';

const { Title, Text } = Typography;
const { Option } = Select;

const SchedulePage: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const isAdmin = initialState?.role === 'ADMIN';

  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<any>(null);
  
  const [matches, setMatches] = useState<any[]>([]);
  const [approvedTeams, setApprovedTeams] = useState<any[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);

  // Modals state
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isAddMatchModalVisible, setIsAddMatchModalVisible] = useState(false);
  const [isUpdateScoreModalVisible, setIsUpdateScoreModalVisible] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<any>(null);

  const [form] = Form.useForm();
  const [scoreForm] = Form.useForm();

  const selectedTeam1Id = Form.useWatch('team1Id', form);
  const selectedTeam2Id = Form.useWatch('team2Id', form);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const res = await getAllTournaments();
      if (res.success) {
        setTournaments(res.data?.data || (Array.isArray(res.data) ? res.data : []));
      }
    } catch (error) {
      message.error('Lỗi khi tải danh sách giải đấu');
    } finally {
      setLoading(false);
    }
  };

  const fetchTournamentDetails = async (tournamentId: string) => {
    setMatchesLoading(true);
    try {
      const [matchesRes, tournamentDetails] = await Promise.all([
        getMatchesByTournament(tournamentId),
        getTournamentById(tournamentId)
      ]);

      if (matchesRes.success) setMatches(matchesRes.data);
      if (tournamentDetails) setApprovedTeams(tournamentDetails.registrations || []);
    } catch (error) {
      message.error('Lỗi khi tải thông tin chi tiết giải đấu');
    } finally {
      setMatchesLoading(false);
    }
  };

  const handleTournamentClick = (tournament: any) => {
    setSelectedTournament(tournament);
    setIsDetailModalVisible(true);
    fetchTournamentDetails(tournament.id);
  };

  const handleAddMatch = async (values: any) => {
    try {
      const payload = {
        tournamentId: selectedTournament.id,
        team1Id: values.team1Id,
        team2Id: values.team2Id,
        round: values.round,
        startTime: values.startTime ? values.startTime.toISOString() : undefined,
      };
      const res = await createMatch(payload);
      if (res.success) {
        message.success('Tạo cặp đấu thành công');
        setIsAddMatchModalVisible(false);
        form.resetFields();
        fetchTournamentDetails(selectedTournament.id);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi khi tạo cặp đấu');
    }
  };

  const handleUpdateScore = async (values: any) => {
    try {
      const payload = {
        team1Score: values.team1Score,
        team2Score: values.team2Score,
        status: values.status,
      };
      const res = await updateMatchScore(currentMatch.id, payload);
      if (res.success) {
        message.success('Cập nhật kết quả thành công');
        setIsUpdateScoreModalVisible(false);
        scoreForm.resetFields();
        fetchTournamentDetails(selectedTournament.id);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi khi cập nhật kết quả');
    }
  };

  const openUpdateScoreModal = (match: any) => {
    setCurrentMatch(match);
    scoreForm.setFieldsValue({
      team1Score: match.team1Score,
      team2Score: match.team2Score,
      status: match.status,
    });
    setIsUpdateScoreModalVisible(true);
  };

  // Tính các đội đã bị loại (thua ít nhất 1 trận đã hoàn thành) - Chỉ dùng cho SINGLE_ELIMINATION
  const eliminatedTeamIds = new Set(
    selectedTournament?.format === 'SINGLE_ELIMINATION' 
    ? matches
      .filter((m) => m.status === 'COMPLETED')
      .map((m) => {
        if ((m.team1Score ?? 0) > (m.team2Score ?? 0)) return m.team2?.id;
        if ((m.team2Score ?? 0) > (m.team1Score ?? 0)) return m.team1?.id;
        return null;
      })
      .filter(Boolean)
    : []
  );

  // Chỉ hiện đội chưa bị loại trong dropdown tạo cặp đấu (Với ROUND_ROBIN thì không loại ai)
  const eligibleTeams = approvedTeams.filter((t: any) => !eliminatedTeamIds.has(t.id));

  // Tính bảng xếp hạng cho vòng bảng (Round Robin)
  const calculateLeaderboard = () => {
    if (selectedTournament?.format !== 'ROUND_ROBIN') return [];

    const stats: Record<string, any> = {};
    
    // Khởi tạo stats cho tất cả đội đã đăng ký
    approvedTeams.forEach(t => {
      stats[t.id] = {
        id: t.id,
        teamName: t.teamName,
        matchesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0,
        goalDifference: 0
      };
    });

    // Cập nhật từ các trận đấu đã kết thúc
    matches.filter(m => m.status === 'COMPLETED').forEach(m => {
      const t1 = m.team1?.id;
      const t2 = m.team2?.id;
      const s1 = m.team1Score ?? 0;
      const s2 = m.team2Score ?? 0;

      if (t1 && stats[t1]) {
        stats[t1].matchesPlayed += 1;
        stats[t1].goalsFor += s1;
        stats[t1].goalsAgainst += s2;
        if (s1 > s2) { stats[t1].wins += 1; stats[t1].points += 3; }
        else if (s1 === s2) { stats[t1].draws += 1; stats[t1].points += 1; }
        else { stats[t1].losses += 1; }
        stats[t1].goalDifference = stats[t1].goalsFor - stats[t1].goalsAgainst;
      }

      if (t2 && stats[t2]) {
        stats[t2].matchesPlayed += 1;
        stats[t2].goalsFor += s2;
        stats[t2].goalsAgainst += s1;
        if (s2 > s1) { stats[t2].wins += 1; stats[t2].points += 3; }
        else if (s2 === s1) { stats[t2].draws += 1; stats[t2].points += 1; }
        else { stats[t2].losses += 1; }
        stats[t2].goalDifference = stats[t2].goalsFor - stats[t2].goalsAgainst;
      }
    });

    // Sắp xếp: Điểm -> Hệ số -> Bàn thắng -> Tên
    return Object.values(stats).sort((a: any, b: any) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return a.teamName.localeCompare(b.teamName);
    });
  };

  const leaderboard = calculateLeaderboard();

  // Vòng đấu hiển thị dựa theo số đội đăng ký
  const totalTeams = approvedTeams.length;
  const ALL_ROUNDS = [
    { value: 'Vòng Bảng', label: 'Vòng Bảng', minTeams: 16 },
    { value: 'Tứ Kết',   label: 'Tứ Kết',   minTeams: 8  },
    { value: 'Bán Kết', label: 'Bán Kết', minTeams: 4  },
    { value: 'Chung Kết', label: 'Chung Kết', minTeams: 2  },
  ];
  const availableRounds = ALL_ROUNDS.filter((r) => totalTeams >= r.minTeams);

  return (
    <PageContainer>
      <PageTransition>
      <Card title="Danh sách Giải Đấu">
        <StaggerContainer style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <AnimatedItem key={`sk-${i}`} style={{ flex: '1 1 260px' }}>
                  <Card loading style={{ height: 280 }} />
                </AnimatedItem>
              ))
            : tournaments.map((item) => (
                <AnimatedItem key={item.id} style={{ flex: '1 1 260px' }}>
                  <Card
                    hoverable
                    className="animated-card"
                    onClick={() => handleTournamentClick(item)}
                    cover={
                      <div className="card-banner" style={{ backgroundImage: `url(${item.banner || 'https://via.placeholder.com/400x300?text=No+Banner'})` }} />
                    }
                  >
                    <div className="card-content">
                      <h3 className="card-title">{item.name}</h3>
                      <p><strong>Game:</strong> {item.game}</p>
                      <p><strong>Trạng thái:</strong> {item.status}</p>
                    </div>
                  </Card>
                </AnimatedItem>
              ))
          }
        </StaggerContainer>
      </Card>

      {/* Tournament Details Modal */}
      <Modal
        title={`Chi tiết: ${selectedTournament?.name}`}
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        <Spin spinning={matchesLoading}>
          <div style={{ marginBottom: 24 }}>
            <Title level={4}>Đội đã đăng ký thành công ({approvedTeams.length})</Title>
            <Space size={[8, 8]} wrap>
              {approvedTeams.map(team => (
                <Tag color="blue" key={team.id}>{team.teamName}</Tag>
              ))}
              {approvedTeams.length === 0 && <Text type="secondary">Chưa có đội nào được duyệt.</Text>}
            </Space>
          </div>

          {selectedTournament?.format === 'ROUND_ROBIN' && leaderboard.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <Title level={4}>Bảng Xếp Hạng</Title>
              <Table
                dataSource={leaderboard}
                rowKey="id"
                pagination={false}
                size="small"
                columns={[
                  { title: '#', render: (_, __, i) => i + 1, width: 40, align: 'center' },
                  { title: 'Đội', dataIndex: 'teamName', key: 'teamName' },
                  { title: 'Trận', dataIndex: 'matchesPlayed', key: 'matchesPlayed', align: 'center' },
                  { title: 'T', dataIndex: 'wins', key: 'wins', align: 'center' },
                  { title: 'H', dataIndex: 'draws', key: 'draws', align: 'center' },
                  { title: 'B', dataIndex: 'losses', key: 'losses', align: 'center' },
                  { title: 'Hệ số', dataIndex: 'goalDifference', key: 'goalDifference', align: 'center', render: (val) => (val > 0 ? `+${val}` : val) },
                  { title: 'Điểm', dataIndex: 'points', key: 'points', align: 'center', render: (val) => <Text strong>{val}</Text> },
                ]}
              />
            </div>
          )}

          <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
              <Col><Title level={4} style={{ margin: 0 }}>Lịch Thi Đấu</Title></Col>
              <Col>
                {isAdmin && (
                  <Button type="primary" onClick={() => setIsAddMatchModalVisible(true)}>
                    Tạo cặp đấu
                  </Button>
                )}
              </Col>
            </Row>

            <List
              dataSource={matches}
              renderItem={match => (
                <List.Item
                  actions={isAdmin ? [
                    <Button key="update" type="link" onClick={() => openUpdateScoreModal(match)}>
                      Cập nhật
                    </Button>
                  ] : []}
                >
                  <List.Item.Meta
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>
                          <strong>{match.team1?.teamName || 'TBD'}</strong> vs <strong>{match.team2?.teamName || 'TBD'}</strong>
                        </span>
                        <Tag color={match.status === 'COMPLETED' ? 'green' : match.status === 'ONGOING' ? 'orange' : 'default'}>
                          {match.status}
                        </Tag>
                      </div>
                    }
                    description={
                      <div>
                        {match.round && <Text type="secondary">Vòng: {match.round} | </Text>}
                        <Text strong>Tỉ số: {match.team1Score ?? '-'} : {match.team2Score ?? '-'}</Text>
                        {match.startTime && <div><Text type="secondary">Thời gian: {new Date(match.startTime).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}</Text></div>}
                      </div>
                    }
                  />
                </List.Item>
              )}
              locale={{ emptyText: 'Chưa có cặp đấu nào' }}
            />
          </div>
        </Spin>
      </Modal>

      {/* Add Match Modal */}
      <Modal
        title="Tạo Cặp Đấu Mới"
        open={isAddMatchModalVisible}
        onCancel={() => setIsAddMatchModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleAddMatch}>
          <Form.Item label="Đội 1" name="team1Id" rules={[{ required: true, message: 'Vui lòng chọn đội 1' }]}>
            <Select placeholder="Chọn đội 1">
              {eligibleTeams.map((team: any) => (
                <Option key={team.id} value={team.id} disabled={team.id === selectedTeam2Id}>{team.teamName}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Đội 2" name="team2Id" rules={[{ required: true, message: 'Vui lòng chọn đội 2' }]}>
            <Select placeholder="Chọn đội 2">
              {eligibleTeams.map((team: any) => (
                <Option key={team.id} value={team.id} disabled={team.id === selectedTeam1Id}>{team.teamName}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Vòng đấu" name="round">
            <Select placeholder="Chọn vòng đấu" allowClear>
              {availableRounds.map((r) => (
                <Option key={r.value} value={r.value}>{r.label}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Thời gian diễn ra" name="startTime">
            <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Update Score Modal */}
      <Modal
        title={`Cập nhật trận đấu: ${currentMatch?.team1?.teamName} vs ${currentMatch?.team2?.teamName}`}
        open={isUpdateScoreModalVisible}
        onCancel={() => setIsUpdateScoreModalVisible(false)}
        onOk={() => scoreForm.submit()}
      >
        <Form form={scoreForm} layout="vertical" onFinish={handleUpdateScore}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={`Điểm ${currentMatch?.team1?.teamName || 'Đội 1'}`} name="team1Score">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={`Điểm ${currentMatch?.team2?.teamName || 'Đội 2'}`} name="team2Score">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Trạng thái" name="status" rules={[{ required: true }]}>
            <Select>
              <Option value="PENDING">Chưa bắt đầu</Option>
              <Option value="ONGOING">Đang diễn ra</Option>
              <Option value="COMPLETED">Đã kết thúc</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      </PageTransition>
    </PageContainer>
  );
};

export default SchedulePage;
