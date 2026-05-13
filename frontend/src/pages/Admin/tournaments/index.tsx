import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  message,
  Input,
  Select,
} from "antd";

import { useState } from "react";

import CreateTournamentModal from "@/components/tournament/CreateTournamentModal";

import EditTournamentModal from "@/components/tournament/EditTournamentModal";

export default function AdminTournaments() {
  const [open, setOpen] =
    useState(false);

  const [editOpen, setEditOpen] =
    useState(false);

  const [selectedTournament,
    setSelectedTournament] =
    useState<any>(null);

  const [searchText,
    setSearchText] =
    useState("");

  const [statusFilter,
    setStatusFilter] =
    useState("");

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

      {
        id: 3,
        name: "CS2 Major Cup",
        game: "CS2",
        status: "FINISHED",
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

  const handleEdit = (
    tournament: any
  ) => {
    setSelectedTournament(
      tournament
    );

    setEditOpen(true);
  };

  const handleUpdate = (
    values: any
  ) => {
    const updated =
      tournaments.map((item) => {
        if (
          item.id ===
          selectedTournament.id
        ) {
          return {
            ...item,
            ...values,
          };
        }

        return item;
      });

    setTournaments(updated);

    setEditOpen(false);

    message.success(
      "Cập nhật giải đấu thành công"
    );
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

  const filteredData =
    tournaments.filter((item) => {
      const matchName =
        item.name
          .toLowerCase()
          .includes(
            searchText.toLowerCase()
          );

      const matchStatus =
        statusFilter
          ? item.status ===
            statusFilter
          : true;

      return (
        matchName && matchStatus
      );
    });

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
          <Button
            type="primary"
            onClick={() =>
              handleEdit(record)
            }
          >
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
        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <Input
            placeholder="Tìm giải đấu..."
            value={searchText}
            onChange={(e) =>
              setSearchText(
                e.target.value
              )
            }
          />

          <Select
            placeholder="Lọc trạng thái"
            style={{ width: 200 }}
            allowClear
            onChange={(value) =>
              setStatusFilter(
                value || ""
              )
            }
          >
            <Select.Option value="UPCOMING">
              UPCOMING
            </Select.Option>

            <Select.Option value="ONGOING">
              ONGOING
            </Select.Option>

            <Select.Option value="FINISHED">
              FINISHED
            </Select.Option>
          </Select>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredData}
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
          }}
        />

        <CreateTournamentModal
          open={open}
          onClose={() =>
            setOpen(false)
          }
          onCreate={handleCreate}
        />

        <EditTournamentModal
          open={editOpen}
          onClose={() =>
            setEditOpen(false)
          }
          tournament={
            selectedTournament
          }
          onUpdate={handleUpdate}
        />
      </Card>
    </div>
  );
}