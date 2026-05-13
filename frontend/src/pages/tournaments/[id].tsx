import {
  Card,
  Col,
  Row,
} from "antd";

import { useState } from "react";

import { useParams } from "react-router-dom";

import TournamentBanner from "@/components/tournament/TournamentBanner";

import TournamentSidebar from "@/components/tournament/TournamentSidebar";

import RegisterModal from "@/components/tournament/RegisterModal";

export default function TournamentDetail() {
  const params = useParams();

  const [open, setOpen] =
    useState(false);

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

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card>
            <TournamentBanner
              tournament={tournament}
            />
          </Card>
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