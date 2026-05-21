import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Select, List, Typography, Spin, Space, Tag, Empty, Avatar, Button } from 'antd';
import { TeamOutlined, UserOutlined, TrophyOutlined, SyncOutlined } from '@ant-design/icons';
import { getTournaments } from '@/services/adminTournament.service';
import { getTournamentById } from '@/services/tournament.service';

const { Title, Text } = Typography;

export default function TeamsPage() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loadingTours, setLoadingTours] = useState(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);
  
  const [tournamentDetail, setTournamentDetail] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    fetchTournaments();
  }, []);

  useEffect(() => {
    if (selectedTournamentId) {
      fetchTournamentDetail(selectedTournamentId);
    } else {
      setTournamentDetail(null);
    }
  }, [selectedTournamentId]);

  const fetchTournaments = async () => {
    try {
      setLoadingTours(true);
      const res = await getTournaments({ limit: 100 });
      if (res.success !== false) {
        setTournaments(res.data?.data || res.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch tournaments', error);
    } finally {
      setLoadingTours(false);
    }
  };

  const fetchTournamentDetail = async (id: string) => {
    try {
      setLoadingDetail(true);
      const data = await getTournamentById(id);
      setTournamentDetail(data);
    } catch (error) {
      console.error('Failed to fetch tournament details', error);
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <PageContainer title="Danh sách Đội tham gia">
      <Card bordered={false} style={{ marginBottom: 24, borderRadius: 12 }}>
        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ fontSize: 16 }}>Chọn giải đấu: </Text>
        </div>
        <Select
          showSearch
          placeholder="Chọn giải đấu để xem danh sách đội..."
          loading={loadingTours}
          style={{ width: '100%', maxWidth: 400 }}
          onChange={(value) => setSelectedTournamentId(value)}
          options={tournaments.map((t) => ({ label: t.name, value: t.id }))}
          filterOption={(input, option) =>
            (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
          }
        />
      </Card>

      {selectedTournamentId && (
        <Spin spinning={loadingDetail}>
          {tournamentDetail ? (
            <Card bordered={false} style={{ borderRadius: 12 }}>
              <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Title level={3} style={{ margin: 0 }}>
                    <TrophyOutlined style={{ color: '#faad14', marginRight: 8 }} />
                    {tournamentDetail.name}
                  </Title>
                  <Space style={{ marginTop: 8 }}>
                    <Tag color="blue">{tournamentDetail.game}</Tag>
                    <Text type="secondary">
                      {tournamentDetail.registrations?.length || 0} đội đã được duyệt
                    </Text>
                  </Space>
                </div>
                <Button 
                  icon={<SyncOutlined />} 
                  onClick={() => fetchTournamentDetail(selectedTournamentId)}
                  loading={loadingDetail}
                >
                  Làm mới
                </Button>
              </div>

              {tournamentDetail.registrations?.length > 0 ? (
                <List
                  rowKey="id"
                  grid={{ gutter: 24, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4 }}
                  dataSource={tournamentDetail.registrations}
                  renderItem={(reg: any) => (
                    <List.Item>
                      <Card
                        hoverable
                        style={{ borderRadius: 8, height: '100%' }}
                        bodyStyle={{ padding: 20 }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                          <Avatar 
                            size={48} 
                            icon={<TeamOutlined />} 
                            src={reg.teamLogo}
                            style={{ backgroundColor: '#1890ff', marginRight: 16 }} 
                          />
                          <div>
                            <Title level={5} style={{ margin: 0, color: '#1890ff' }}>
                              {reg.teamName}
                            </Title>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Đại diện: {reg.user?.username}
                            </Text>
                          </div>
                        </div>

                        <div>
                          <Text strong style={{ display: 'block', marginBottom: 8 }}>
                            Thành viên ({reg.members?.length || 0}):
                          </Text>
                          <Space direction="vertical" style={{ width: '100%' }} size={4}>
                            {reg.members?.map((member: any) => (
                              <div key={member.id} style={{ display: 'flex', alignItems: 'center' }}>
                                <UserOutlined style={{ color: '#8c8c8c', marginRight: 8 }} />
                                <Text>{member.memberName}</Text>
                                <Text type="secondary" style={{ marginLeft: 'auto', fontSize: 12 }}>
                                  ID: {member.gameId}
                                </Text>
                              </div>
                            ))}
                          </Space>
                        </div>
                      </Card>
                    </List.Item>
                  )}
                />
              ) : (
                <Empty description="Chưa có đội nào đăng ký thành công cho giải đấu này." />
              )}
            </Card>
          ) : null}
        </Spin>
      )}
    </PageContainer>
  );
}
