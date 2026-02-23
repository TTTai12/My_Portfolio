import { Badge, Popover, Table, Typography, Empty, Button } from "antd";
import { BellOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

type MessageItem = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  content: string;
  createdAt: string;
};

type SummaryResponse = {
  unreadCount: number;
  latestMessages: MessageItem[];
};

const { Text } = Typography;

async function fetchSummary(): Promise<SummaryResponse> {
  const res = await fetch("/api/messages/unread-summary", { cache: "no-store" });
  if (!res.ok) return { unreadCount: 0, latestMessages: [] };
  const text = await res.text();
  if (!text) return { unreadCount: 0, latestMessages: [] };
  return JSON.parse(text);
}

async function markAllRead(ids: string[]) {
  if (!ids.length) return;
  await fetch("/api/messages/mark-as-read", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });
}

function PopoverContent({
  items,
  onClickItem,
}: {
  items: MessageItem[];
  onClickItem: (item: MessageItem) => void;
}) {
  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "subject",
      key: "subject",
      render: (text: string) => (
        <Text strong style={{ color: "#1890ff" }}>
          {text || "Thông báo"}
        </Text>
      ),
    },
    {
      title: "Người gửi",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      render: (text: string) => (
        <Text style={{ color: "#595959" }}>{text}</Text>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (val: string) =>
        new Date(val).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: MessageItem) => (
        <Button type="link" onClick={() => onClickItem(record)}>
          Xem
        </Button>
      ),
    },
  ];

  return (
    <div style={{ width: 500 }}>
      {items.length === 0 ? (
        <Empty description="Không có thông báo mới" />
      ) : (
        <Table
          rowKey="_id"
          dataSource={items}
          columns={columns}
          pagination={false}
          size="small"
        />
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 8,
        }}
      >
        <Text
          onClick={async () => {
            const ids = items.map((i) => i._id);
            await markAllRead(ids);
          }}
          style={{ cursor: "pointer" }}
        >
          Đánh dấu là đã đọc
        </Text>
        <Link href="/messages">Xem tất cả tin nhắn</Link>
      </div>
    </div>
  );
}

export default function NotificationBell() {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);
  const [items, setItems] = useState<MessageItem[]>([]);
  const [open, setOpen] = useState(false);

  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const fetchingRef = useRef<boolean>(false);

  const loadSummary = async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    try {
      const data = await fetchSummary();
      setUnreadCount(data.unreadCount || 0);
      setItems(Array.isArray(data.latestMessages) ? data.latestMessages : []);
    } finally {
      fetchingRef.current = false;
    }
  };

  useEffect(() => {
    loadSummary();
    pollRef.current = setInterval(loadSummary, 30000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const onOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
  };

  const handleClickItem = async (item: MessageItem) => {
    setUnreadCount((c) => Math.max(0, c - 1));
    setItems((prev) => prev.filter((i) => i._id !== item._id));
    await markAllRead([item._id]);
    router.push(`/messages?id=${encodeURIComponent(item._id)}`);
    setOpen(false);
  };

  return (
    <Popover
      placement="bottomRight"
      trigger="click"
      open={open}
      onOpenChange={onOpenChange}
      content={<PopoverContent items={items} onClickItem={handleClickItem} />}
    >
      <Badge count={unreadCount} size="default">
        <BellOutlined style={{ fontSize: 18 }} />
      </Badge>
    </Popover>
  );
}
