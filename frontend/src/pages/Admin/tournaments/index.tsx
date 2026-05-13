import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  message,
  Input,
  Select,
  Spin,
  Popconfirm,
  Empty,
} from "antd";

import {
  useState,
  useEffect,
} from "react";

import CreateTournamentModal from "@/components/tournament/CreateTournamentModal";

import EditTournamentModal from "@/components/tournament/EditTournamentModal";

import TournamentStats from "@/components/dashboard/TournamentStats";

import {
  getTournaments,
  createTournament,
  updateTournament,
  deleteTournament,
} from "@/services/adminTournament.service";

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

  const [loading, setLoading] =
    useState(false);

  const [createLoading,
    setCreateLoading] =
    useState(false);

  const [updateLoading,
    setUpdateLoading] =
    useState(false);

  const [tournaments, setTournaments] =
    useState<any[]>([]);

  const fetchTournaments =
    async () => {
      try {
        setLoading(true);

        const data =
          await getTournaments();

        setTournaments(data);
      } catch (error) {
        console.log(error);

        message.error(
          "Lỗi tải dữ liệu"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleDelete =
    async (id: number) => {
      try {
        await deleteTournament(
          id
        );

        message.success(
          "Xóa thành công"
        );

        fetchTournaments();
      } catch (error) {
        console.log(error);

        message.error(
          "Xóa thất bại"
        );
      }
    };

  const handleCreate =
    async (values: any) => {
      try {
        setCreateLoading(true);

        await createTournament(
          values
        );

        message.success(
          "Tạo giải đấu thành công"
        );

        setOpen(false);

        fetchTournaments();
      } catch (error) {
        console.log(error);

        message.error(
          "Tạo giải đấu thất bại"
        );
      } finally {
        setCreateLoading(false);
      }
    };

  const handleEdit = (
    tournament: any
  ) => {
    setSelectedTournament(
      tournament
    );

    setEditOpen(true);
  };

  const handleUpdate =
    async (values: any) => {
      try {
        setUpdateLoading(true);

        await updateTournament(
          selectedTournament.id,
          values
        );

        message.success(
          "Cập nhật thành công"
        );

        setEditOpen(false);

        fetchTournaments();
      } catch (error) {
        console.log(error);

        message.error(
          "Cập nhật thất bại"
        );
      } finally {
        setUpdateLoading(false);
      }
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
          ?.toLowerCase()
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

          <Popconfirm
            title="Xóa giải đấu"
            description="Bạn có chắc muốn xóa giải đấu này?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() =>
              handleDelete(record.id)
            }
          >
            <Button danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent:
            "center",
          marginTop: 100,
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <TournamentStats
        tournaments={tournaments}
      />

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
            flexWrap: "wrap",
          }}
        >
          <Input
            placeholder="Tìm giải đấu..."
            value={searchText}
            style={{ width: 250 }}
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
          scroll={{ x: 800 }}
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
          }}
          locale={{
            emptyText: (
              <Empty
                description="Không có giải đấu nào"
              />
            ),
          }}
        />

        <CreateTournamentModal
          open={open}
          onClose={() =>
            setOpen(false)
          }
          onCreate={handleCreate}
          loading={createLoading}
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
          loading={updateLoading}
        />
      </Card>
    </div>
  );
}