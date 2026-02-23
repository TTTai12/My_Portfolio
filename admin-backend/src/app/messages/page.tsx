"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  Spin,
  Modal,
  Popconfirm,
  Input,
  Button,
  App as AntdApp,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";

const { Text } = Typography;

type Message = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  content: string;
  createdAt: string;
};

export default function MessagesPage() {
  const { message } = AntdApp.useApp();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState<Message | null>(null);

  // Fetch messages
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/messages");
      const json = await res.json();
      // Handle both formats: direct array or { success, data }
      const data = json.data !== undefined ? json.data : json;
      setMessages(Array.isArray(data) ? data : []);
    } catch (err: any) {
      message.error(err?.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Delete message
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        message.success("Message deleted");
        setMessages((prev) => prev.filter((m) => m._id !== id));
      } else {
        const body = await res.json().catch(() => ({}));
        message.error(body.error || "Delete failed");
      }
    } catch (err: any) {
      message.error(err?.message || "Delete failed");
    }
  };

  // Filtered data
  const filteredMessages = useMemo(() => {
    if (!search.trim()) return messages;
    const lower = search.toLowerCase();
    return messages.filter(
      (m) =>
        m.name.toLowerCase().includes(lower) ||
        m.subject.toLowerCase().includes(lower),
    );
  }, [messages, search]);

  const columns: ColumnsType<Message> = [
    {
      title: "Người gửi",
      dataIndex: "name",
      key: "sender",
      render: (_, record) => (
        <div>
          <Text strong>{record.name}</Text>
          <br />
          <Text type="secondary">{record.email}</Text>
        </div>
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Ngày gửi",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: string) => new Date(value).toLocaleString(),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button size="small" onClick={() => setViewing(record)}>
            Xem
          </Button>
          <Popconfirm
            title="Xóa tin nhắn?"
            description="Bạn có chắc muốn xóa tin nhắn này?"
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record._id)}
          >
            <Button size="small" danger>
              Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý Tin nhắn</h1>

      <Input.Search
        placeholder="Tìm theo tên hoặc tiêu đề..."
        allowClear
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: 300 }}
      />

      <Table<Message>
        rowKey="_id"
        columns={columns}
        dataSource={filteredMessages}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        open={!!viewing}
        title={viewing?.subject}
        onCancel={() => setViewing(null)}
        footer={[
          <Button key="close" onClick={() => setViewing(null)}>
            Đóng
          </Button>,
        ]}
      >
        <p>
          <strong>Người gửi:</strong> {viewing?.name} ({viewing?.email})
        </p>
        <p>
          <strong>Ngày gửi:</strong>{" "}
          {viewing?.createdAt
            ? new Date(viewing.createdAt).toLocaleString()
            : "-"}
        </p>
        <div className="mt-4 whitespace-pre-wrap">{viewing?.content}</div>
      </Modal>
    </div>
  );
}
