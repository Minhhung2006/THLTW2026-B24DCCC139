import {
  Card,
  Col,
  Row,
  Spin,
} from "antd";

import {
  useEffect,
  useState,
} from "react";

import { useParams } from "react-router-dom";

import TournamentBanner from "@/components/tournament/TournamentBanner";

import TournamentSidebar from "@/components/tournament/TournamentSidebar";

import RegisterModal from "@/components/tournament/RegisterModal";

import TournamentTeams from "@/components/tournament/TournamentTeams";

import { getTournamentById } from "@/services/tournament.service";

import TournamentMatches from "@/components/tournament/TournamentMatches";

export default function TournamentDetail() {
  const params = useParams();

  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [tournament, setTournament] =
    useState<any>(null);

  // Fake teams
  const teams = [
    {
      id: 1,
      name: "Team Flash",
      captain: "Hưng",
      rank: "Diamond",
      logo:
        "https://cdn-icons-png.flaticon.com/512/5968/5968705.png",
    },

    {
      id: 2,
      name: "SBTC Esports",
      captain: "Minh",
      rank: "Immortal",
      logo:
        "https://cdn-icons-png.flaticon.com/512/5968/5968705.png",
    },

    {
      id: 3,
      name: "DivisionX",
      captain: "Long",
      rank: "Ascendant",
      logo:
        "https://cdn-icons-png.flaticon.com/512/5968/5968705.png",
    },
  ];

  const fetchTournament =
    async () => {
      try {
        setLoading(true);

        const data =
          await getTournamentById(
            params.id || ""
          );

        setTournament(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchTournament();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 100,
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card>
            <TournamentBanner
              tournament={tournament}
            />
          </Card>

          <TournamentTeams
            teams={teams}
          />
        </Col>

        <Col xs={24} lg={8}>
          <TournamentSidebar
            tournament={tournament}
            onRegister={() =>
              setOpen(true)
            }
          />
        </Col>
      </Row>

      <RegisterModal
        open={open}
        onClose={() =>
          setOpen(false)
        }
      />
    </div>
  );
}