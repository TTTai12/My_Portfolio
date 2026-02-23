"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Card, Statistic, Spin, App as AntdApp, Typography } from "antd";
import { ProjectOutlined, ToolOutlined, MessageOutlined, EyeOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";

// Ant Design Charts (lazy to avoid SSR issues)
const Line = dynamic(() => import("@ant-design/charts").then((m) => m.Line), { ssr: false });

type MessageItem = {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  createdAt?: string;
};

export default function DashboardPage() {
  const { message } = AntdApp.useApp();
  const [loadingStats, setLoadingStats] = useState(true);
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    messages: 0,
    views: 0,
  });

  const [loadingMsgs, setLoadingMsgs] = useState(true);
  const [messages, setMessages] = useState<MessageItem[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        // You can optimize by having a single endpoint for dashboard stats
        const [pRes, sRes, mRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/skills"),
          fetch("/api/messages?limit=5"),
        ]);

        const [pData, sData, mData] = await Promise.all([
          pRes.json(),
          sRes.json(),
          mRes.json(),
        ]);

        setStats({
          projects: Array.isArray(pData) ? pData.length : 0,
          skills: Array.isArray(sData) ? sData.length : 0,
          messages: Array.isArray(mData) ? mData.length : 0,
          views: 1284, // mock views; replace with real metric if available
        });
      } catch (err: any) {
        message.error(err?.message || "Failed to load statistics");
      } finally {
        setLoadingStats(false);
      }
    };

    const fetchMessages = async () => {
      setLoadingMsgs(true);
      try {
        const res = await fetch("/api/messages?limit=5");
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      } catch (err: any) {
        message.error(err?.message || "Failed to load messages");
      } finally {
        setLoadingMsgs(false);
      }
    };

    fetchStats();
    fetchMessages();
  }, [message]);

  const chartData = useMemo(
    () => [
      { day: "Mon", visits: 120 },
      { day: "Tue", visits: 180 },
      { day: "Wed", visits: 90 },
      { day: "Thu", visits: 150 },
      { day: "Fri", visits: 210 },
      { day: "Sat", visits: 170 },
      { day: "Sun", visits: 200 },
    ],
    []
  );

  const chartConfig = useMemo(
    () => ({
      data: chartData,
      xField: "day",
      yField: "visits",
      smooth: true,
      height: 260,
      point: { size: 4, shape: "circle" },
      tooltip: { showMarkers: true },
      color: "#722ED1", // purple
    }),
    [chartData]
  );

  return (
    <div className="space-y-6">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            {loadingStats ? (
              <Spin />
            ) : (
              <Statistic
                title="Projects"
                value={stats.projects}
                prefix={<ProjectOutlined />}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            {loadingStats ? (
              <Spin />
            ) : (
              <Statistic title="Skills" value={stats.skills} prefix={<ToolOutlined />} />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            {loadingStats ? (
              <Spin />
            ) : (
              <Statistic
                title="Messages"
                value={stats.messages}
                prefix={<MessageOutlined />}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            {loadingStats ? (
              <Spin />
            ) : (
              <Statistic title="Views" value={stats.views} prefix={<EyeOutlined />} />
            )}
          </Card>
        </Col>
      </Row>

      <Card title="Weekly visits" hoverable>
        <Line {...chartConfig} />
      </Card>

      <Card title="Latest messages" hoverable>
        {loadingMsgs ? (
          <Spin />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {messages.map((m) => (
                  <tr key={m._id}>
                    <td className="px-4 py-2 text-sm">{m.name}</td>
                    <td className="px-4 py-2 text-sm">
                      <Typography.Link href={`mailto:${m.email}`}>{m.email}</Typography.Link>
                    </td>
                    <td className="px-4 py-2 text-sm">{m.subject ?? "-"}</td>
                    <td className="px-4 py-2 text-sm">
                      {m.createdAt ? new Date(m.createdAt).toLocaleString() : "-"}
                    </td>
                  </tr>
                ))}
                {messages.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500 text-sm">
                      No recent messages
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
