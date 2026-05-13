import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  message,
} from "antd";

import { useState } from "react";

import CreateTournamentModal from "@/components/tournament/CreateTournamentModal";

export default function AdminTournaments() {
  const [open, setOpen] =
    useState(false);

  const [tournaments, setTournaments] =
    useState([
      {
        id: 1,
        name:
          "Valorant Champions 2026",
        game: "Valorant",
        status: "UPCOMING",
      },

      {
        id: 2,
        name: "LoL Spring Cup",
        game: "League of Legends",
        status: "ONGOING",
      },
    ]);

  const handleDelete = (
    id: number
  ) => {
    const filtered =
      tournaments.filter(
        (item) => item.id !== id
      );

    setTournaments(filtered);

    message.success(
      "Xóa giải đấu thành công"
    );
  };

  const handleCreate = (
    values: any
  ) => {
    const newTournament = {
      id: Date.now(),
      ...values,
    };

    setTournaments([
      ...tournaments,
      newTournament,
    ]);
  };

  const getStatusColor = (
    status: string
  ) => {
    switch (status) {
      case "UPCOMING":
        return "blue";

      case "ONGOING":
        return "green";

      case "FINISHED":
        return "red";

      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Tên giải đấu",
      dataIndex: "name",
    },

    {
      title: "Game",
      dataIndex: "game",
    },

    {
      title: "Trạng thái",
      dataIndex: "status",

      render: (status: string) => (
        <Tag
          color={getStatusColor(
            status
          )}
        >
          {status}
        </Tag>
      ),
    },

    {
      title: "Hành động",

      render: (_: any, record: any) => (
        <Space>
          <Button type="primary">
            Sửa
          </Button>

          <Button
            danger
            onClick={() =>
              handleDelete(record.id)
            }
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        title="Quản lý giải đấu"
        extra={
          <Button
            type="primary"
            onClick={() =>
              setOpen(true)
            }
          >
            Tạo giải đấu
          </Button>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={tournaments}
        />

        <CreateTournamentModal
          open={open}
          onClose={() =>
            setOpen(false)
          }
          onCreate={handleCreate}
        />
      </Card>
    </div>
  );
}