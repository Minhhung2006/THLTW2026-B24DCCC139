import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Select, Card, Spin, Typography, Empty } from 'antd';
import { TrophyOutlined, FireOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { getAllTournaments, getTournamentById } from '@/services/tournament.service';
import { getMatchesByTournament } from '@/services/schedule.service';
import { Table } from 'antd';
import PageTransition from '@/components/motion/PageTransition';
import './leaderboard.css';

const { Title, Text } = Typography;

// Thứ tự vòng đấu cố định
const ROUND_ORDER = ['Vòng Bảng', 'Tứ Kết', 'Bán Kết', 'Chung Kết'];

interface Team {
  id: string;
  teamName: string;
}

interface Match {
  id: string;
  team1: Team | null;
  team2: Team | null;
  team1Score: number | null;
  team2Score: number | null;
  status: 'PENDING' | 'ONGOING' | 'COMPLETED';
  round: string;
  startTime?: string;
}

/** Xác định đội thắng */
const getWinnerId = (match: Match): string | null => {
  if (match.status !== 'COMPLETED') return null;
  if (match.team1Score == null || match.team2Score == null) return null;
  if (match.team1Score > match.team2Score) return match.team1?.id ?? null;
  if (match.team2Score > match.team1Score) return match.team2?.id ?? null;
  return null;
};

// ── Match Card ──────────────────────────────────────────────
const MatchCard: React.FC<{ match: Match }> = ({ match }) => {
  const winnerId = getWinnerId(match);

  const TeamRow: React.FC<{ team: Team | null; score: number | null }> = ({ team, score }) => {
    const isWinner = !!winnerId && winnerId === team?.id;
    const isLoser = !!winnerId && !!team && winnerId !== team.id;
    return (
      <div className={`bracket-team-row ${isWinner ? 'winner' : ''} ${isLoser ? 'loser' : ''}`}>
        {isWinner && <TrophyOutlined style={{ color: '#52c41a', fontSize: 10, flexShrink: 0 }} />}
        <span className="bracket-team-name">{team?.teamName ?? 'TBD'}</span>
        <span className="bracket-team-score">{score != null ? score : '-'}</span>
      </div>
    );
  };

  return (
    <motion.div
      className={`bracket-match-card ${match.status === 'ONGOING' ? 'ongoing' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {match.status === 'ONGOING' && <div className="bracket-live-badge">● LIVE</div>}
      <TeamRow team={match.team1} score={match.team1Score} />
      <div className="bracket-match-divider" />
      <TeamRow team={match.team2} score={match.team2Score} />
    </motion.div>
  );
};

// ── Champion Box ────────────────────────────────────────────
const ChampionBox: React.FC<{ match: Match }> = ({ match }) => {
  const winnerId = getWinnerId(match);
  const champion =
    winnerId === match.team1?.id ? match.team1 :
    winnerId === match.team2?.id ? match.team2 : null;

  if (!champion) return null;

  return (
    <motion.div
      className="bracket-champion-col"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.4 }}
    >
      <div className="bracket-champion-box">
        <div className="bracket-champion-trophy">🏆</div>
        <div className="bracket-champion-label">Vô địch</div>
        <div className="bracket-champion-name">{champion.teamName}</div>
      </div>
    </motion.div>
  );
};

// ── Bracket View ────────────────────────────────────────────
const BracketView: React.FC<{ matches: Match[] }> = ({ matches }) => {
  // Nhóm matches theo round, chỉ lấy các round có trong ROUND_ORDER
  const grouped: Record<string, Match[]> = {};
  for (const m of matches) {
    if (ROUND_ORDER.includes(m.round)) {
      if (!grouped[m.round]) grouped[m.round] = [];
      grouped[m.round].push(m);
    }
  }

  const rounds = ROUND_ORDER.filter((r) => grouped[r]?.length > 0).map((r) => ({
    name: r,
    matches: grouped[r],
  }));

  if (rounds.length === 0) {
    return <div className="bracket-empty"><Text type="secondary">Chưa có trận đấu nào.</Text></div>;
  }

  // Chỉ hiện champion khi vòng "Chung Kết" hoàn thành
  const finalRound = rounds.find((r) => r.name === 'Chung Kết');
  const finalMatch = finalRound?.matches[0];

  return (
    <div className="bracket-container">
      <div className="bracket-rounds">
        {rounds.map((round, roundIdx) => {
          // Group matches thành từng cặp 2 trận
          const pairs: Match[][] = [];
          for (let i = 0; i < round.matches.length; i += 2) {
            pairs.push(round.matches.slice(i, i + 2));
          }

          const isLast = roundIdx === rounds.length - 1;

          return (
            <React.Fragment key={round.name}>
              {/* Round column */}
              <div className="bracket-round-col">
                <div className="bracket-round-label">{round.name}</div>
                <div className="bracket-round-matches">
                  {pairs.map((pair, pairIdx) => (
                    <div
                      key={pairIdx}
                      className={pair.length === 2 && !isLast ? 'bracket-pair' : ''}
                      style={{ marginBottom: pairIdx < pairs.length - 1 ? 32 : 0 }}
                    >
                      {pair.map((match, slotIdx) => (
                        <div
                          key={match.id}
                          className={pair.length === 2 && !isLast ? 'bracket-match-slot' : ''}
                        >
                          <MatchCard match={match} />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Connector spacer between rounds */}
              {!isLast && <div className="bracket-connector-col" />}
            </React.Fragment>
          );
        })}

        {/* Champion display nếu chung kết xong */}
        {finalMatch && getWinnerId(finalMatch) && (
          <ChampionBox match={finalMatch} />
        )}
      </div>
    </div>
  );
};

// ── Survival Stage Leaderboard ──────────────────────────────
const SurvivalStageLeaderboard: React.FC<{ teams: any[] }> = ({ teams }) => {
  const sortedTeams = [...teams].sort((a, b) => {
    const pointsDiff = (b.survivalPoints || 0) - (a.survivalPoints || 0);
    if (pointsDiff !== 0) return pointsDiff;
    const top1Diff = (b.top1Count || 0) - (a.top1Count || 0);
    if (top1Diff !== 0) return top1Diff;
    return (b.kills || 0) - (a.kills || 0);
  });

  return (
    <motion.div 
      className="survival-leaderboard" 
      style={{ padding: '0 20px' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Table
        className="premium-table"
        dataSource={sortedTeams}
        rowKey="id"
        pagination={false}
        columns={[
          { 
            title: 'HẠNG', 
            render: (_, __, i) => {
              const rank = i + 1;
              let rankStyle: React.CSSProperties = { color: 'rgba(255,255,255,0.45)', fontWeight: 'bold', fontSize: 16 };
              let icon = null;
              
              if (rank === 1) { 
                rankStyle.color = '#ffd700'; 
                icon = <TrophyOutlined style={{ color: '#ffd700', marginRight: 8, fontSize: 18 }}/>; 
              } else if (rank === 2) { 
                rankStyle.color = '#e0e0e0'; 
              } else if (rank === 3) { 
                rankStyle.color = '#cd7f32'; 
              }
              
              return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', ...rankStyle }}>
                  {icon}
                  {rank === 1 ? '1' : rank}
                </div>
              );
            }, 
            width: 80, 
            align: 'center', 
            key: 'stt' 
          },
          { 
            title: 'ĐỘI TUYỂN', 
            dataIndex: 'teamName', 
            key: 'teamName', 
            render: (text, _, i) => (
              <Text strong style={{ 
                color: i === 0 ? '#ffd700' : '#fff', 
                fontSize: 16,
                textShadow: i === 0 ? '0 0 10px rgba(255,215,0,0.5)' : 'none'
              }}>
                {text}
              </Text>
            )
          },
          { 
            title: 'TOP 1', 
            dataIndex: 'top1Count', 
            key: 'top1Count', 
            align: 'center', 
            render: (val) => <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15 }}>{val || 0}</Text> 
          },
          { 
            title: 'KILLS', 
            dataIndex: 'kills', 
            key: 'kills', 
            align: 'center', 
            render: (val) => <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15 }}>{val || 0}</Text> 
          },
          { 
            title: 'TỔNG ĐIỂM', 
            dataIndex: 'survivalPoints', 
            key: 'survivalPoints', 
            align: 'center', 
            render: (val, _, i) => (
              <Text strong style={{ 
                color: i === 0 ? '#ffd700' : '#faad14', 
                fontSize: i === 0 ? 20 : 18,
                textShadow: i === 0 ? '0 0 10px rgba(255,215,0,0.5)' : 'none'
              }}>
                {val || 0}
              </Text> 
            )
          },
        ]}
      />
    </motion.div>
  );
};

// ── Main Page ───────────────────────────────────────────────
const LeaderboardPage: React.FC = () => {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedTournament, setSelectedTournament] = useState<any>(null);
  const [approvedTeams, setApprovedTeams] = useState<any[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loadingTournaments, setLoadingTournaments] = useState(false);
  const [loadingMatches, setLoadingMatches] = useState(false);

  useEffect(() => {
    setLoadingTournaments(true);
    getAllTournaments()
      .then((res) => {
        const list = res.data?.data || (Array.isArray(res.data) ? res.data : []);
        setTournaments(list);
        if (list.length > 0) setSelectedId(list[0].id);
      })
      .catch(console.error)
      .finally(() => setLoadingTournaments(false));
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setLoadingMatches(true);
    Promise.all([
      getMatchesByTournament(selectedId),
      getTournamentById(selectedId)
    ])
      .then(([matchesRes, tournament]) => {
        setMatches(matchesRes.success ? matchesRes.data : []);
        setSelectedTournament(tournament);
        setApprovedTeams(tournament?.registrations || []);
      })
      .catch(console.error)
      .finally(() => setLoadingMatches(false));
  }, [selectedId]);

  return (
    <PageContainer title={false}>
      <PageTransition>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0, color: '#fff' }}>
            <TrophyOutlined style={{ color: '#faad14', marginRight: 10 }} />
            {selectedTournament?.format === 'SURVIVAL_STAGE' ? 'Bảng Xếp Hạng Sinh Tồn' : 'Bảng Nhánh Đấu'}
          </Title>
          <Select
            style={{ width: 280 }}
            placeholder="Chọn giải đấu..."
            loading={loadingTournaments}
            value={selectedId}
            onChange={setSelectedId}
            options={tournaments.map((t) => ({ value: t.id, label: t.name }))}
          />
        </div>

        {/* Bracket */}
        <Card
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            minHeight: 300,
          }}
          bodyStyle={{ padding: 32 }}
        >
          {loadingMatches ? (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <Spin size="large" />
            </div>
          ) : selectedTournament?.format === 'SURVIVAL_STAGE' ? (
            <SurvivalStageLeaderboard teams={approvedTeams} />
          ) : (
            <BracketView matches={matches} />
          )}
        </Card>
      </PageTransition>
    </PageContainer>
  );
};

export default LeaderboardPage;
