import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Select, Card, Spin, Typography, Empty } from 'antd';
import { TrophyOutlined, FireOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { getAllTournaments } from '@/services/tournament.service';
import { getMatchesByTournament } from '@/services/schedule.service';
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

// ── Main Page ───────────────────────────────────────────────
const LeaderboardPage: React.FC = () => {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
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
    getMatchesByTournament(selectedId)
      .then((res) => setMatches(res.success ? res.data : []))
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
            Bảng Nhánh Đấu
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
          ) : (
            <BracketView matches={matches} />
          )}
        </Card>
      </PageTransition>
    </PageContainer>
  );
};

export default LeaderboardPage;
