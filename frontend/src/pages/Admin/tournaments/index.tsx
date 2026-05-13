import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  message,
} from "antd";

import { useState } from "react";

export default function AdminTournaments() {
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
        <Tag color="blue">
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
          <Button type="primary">
            Tạo giải đấu
          </Button>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={tournaments}
        />
      </Card>
    </div>
  );
}