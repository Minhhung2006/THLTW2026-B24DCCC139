import React, { useEffect, useState } from 'react';

interface TournamentItem {
  id: string;
  name: string;
  game: string;
  status: string;
  startDate: string;
  endDate: string;
  banner?: string | null;
  maxTeams: number;
  registered: number;
}

const TournamentList: React.FC = () => {
  const [items, setItems] = useState<TournamentItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchList();
  }, [page]);

  async function fetchList() {
    setLoading(true);
    try {
      const res = await fetch(`/api/tournament-list?page=${page}&limit=12`);
      const json = await res.json();
      if (json?.success && json.data) {
        setItems(json.data.data || []);
        setTotalPages(json.data.totalPages || 1);
      } else {
        console.error('Failed to load tournaments', json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Danh sách giải đấu</h2>
      {loading && <p>Đang tải...</p>}
      {!loading && items.length === 0 && <p>Không có giải đấu.</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 12 }}>
        {items.map(t => (
          <div key={t.id} style={{ border: '1px solid #e6e6e6', borderRadius: 6, padding: 12, background: '#fff' }}>
            {t.banner && (
              <img src={t.banner} alt={t.name} style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 4 }} />
            )}
            <h3 style={{ margin: '8px 0' }}>{t.name}</h3>
            <div style={{ fontSize: 13, color: '#555' }}>{t.game} — {t.status}</div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 6 }}>Teams: {t.registered}/{t.maxTeams}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{new Date(t.startDate).toLocaleDateString()} — {new Date(t.endDate).toLocaleDateString()}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14, display: 'flex', gap: 8, alignItems: 'center' }}>
        <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
        <div>Trang {page} / {totalPages}</div>
        <button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button>
      </div>
    </div>
  );
};

export default TournamentList;
