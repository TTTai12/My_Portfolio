"use client";

import React, { useMemo, useState } from "react";
import {
  Layout,
  Menu,
  Breadcrumb,
  Input,
  Avatar,
  Dropdown,
  Badge,
  theme,
  App as AntdApp,
} from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  ProjectOutlined,
  ToolOutlined,
  ApartmentOutlined,
  ReadOutlined,
  MessageOutlined,
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import NotificationBell from "./NotificationBell";

const { Header, Sider, Content } = Layout;

type AdminLayoutProps = {
  children: React.ReactNode;
};

const MENU_ITEMS = [
  { key: "/", label: "Dashboard", icon: <DashboardOutlined /> },
  { key: "/about", label: "About", icon: <UserOutlined /> },
  { key: "/projects", label: "Projects", icon: <ProjectOutlined /> },
  { key: "/skills", label: "Skills", icon: <ToolOutlined /> },
  { key: "/experience", label: "Experience", icon: <ApartmentOutlined /> },
  { key: "/education", label: "Education", icon: <ReadOutlined /> },
  { key: "/messages", label: "Messages", icon: <MessageOutlined /> },
];

function deriveSelectedKey(pathname: string): string {
  // Normalize to first segment route
  if (!pathname || pathname === "/") return "/";
  const seg = `/${pathname.split("/")[1]}`;
  const match = MENU_ITEMS.find((i) => i.key === seg);
  return match ? match.key : "/";
}

function buildBreadcrumb(pathname: string): { label: string; href?: string }[] {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href?: string }[] = [];
  if (segments.length === 0) {
    crumbs.push({ label: "Dashboard", href: "/" });
    return crumbs;
  }
  let hrefAcc = "";
  segments.forEach((seg, idx) => {
    hrefAcc += `/${seg}`;
    const menuMatch = MENU_ITEMS.find((m) => m.key === `/${seg}`);
    const label =
      menuMatch?.label ??
      (seg.match(/^\[.*\]$/)
        ? "Detail"
        : seg.charAt(0).toUpperCase() + seg.slice(1));
    crumbs.push({
      label,
      href: idx < segments.length - 1 ? hrefAcc : undefined,
    });
  });
  return crumbs;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const selectedKey = useMemo(() => deriveSelectedKey(pathname), [pathname]);
  const breadcrumbs = useMemo(() => buildBreadcrumb(pathname), [pathname]);
  const { token } = theme.useToken();

  const userMenu = (
    <Dropdown
      menu={{
        items: [
          {
            key: "logout",
            icon: <LogoutOutlined />,
            label: "Logout",
            onClick: async () => {
              // Implement your logout here
              router.push("/login");
            },
          },
        ],
      }}
      trigger={["click"]}
      placement="bottomRight"
    >
      <div className="flex items-center gap-2 cursor-pointer">
        <Avatar
          size="small"
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
        />
        <span className="text-sm text-gray-700">Admin</span>
      </div>
    </Dropdown>
  );

  return (
    <AntdApp>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={220}
          style={{
            position: "sticky",
            left: 0,
            top: 0,
            height: "100vh",
          }}
        >
          <div
            style={{
              height: 64,
              display: "flex",
              alignItems: "center",
              paddingInline: 16,
              color: "#fff",
              gap: 8,
            }}
          >
            <div
              role="button"
              aria-label="Toggle sidebar"
              onClick={() => setCollapsed((c) => !c)}
              style={{ display: "flex", alignItems: "center" }}
            >
              {collapsed ? (
                <MenuUnfoldOutlined style={{ fontSize: 18 }} />
              ) : (
                <MenuFoldOutlined style={{ fontSize: 18 }} />
              )}
            </div>
            <span style={{ fontWeight: 700 }}>
              {collapsed ? "Admin" : "Admin Portfolio"}
            </span>
          </div>

          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            items={MENU_ITEMS.map((item) => ({
              key: item.key,
              icon: item.icon,
              label: <Link href={item.key}>{item.label}</Link>,
            }))}
          />
        </Sider>

        <Layout>
          <Header
            style={{
              background: "#fff",
              borderBottom: `1px solid ${token.colorSplit}`,
              position: "sticky",
              top: 0,
              zIndex: 100,
              paddingInline: 16,
            }}
          >
            <div className="flex items-center">
              {/* Logo bên trái */}
              <div className="font-semibold text-gray-800">Admin Portfolio</div>

              {/* Nhóm search + bell + avatar nằm sát phải */}
              <div className="flex items-center gap-3 ml-auto">
                <div className="flex-1 max-w-xl">
                  <Input
                    allowClear
                    prefix={<SearchOutlined />}
                    placeholder="Search..."
                    aria-label="Search"
                  />
                </div>
                <NotificationBell />
                {userMenu}
              </div>
            </div>
          </Header>

          <Content
            style={{ background: "#f5f5f5", minHeight: "calc(100vh - 64px)" }}
          >
            <div style={{ padding: "16px 16px 0" }}>
              <Breadcrumb
                items={breadcrumbs.map((b) => ({
                  title: b.href ? (
                    <Link href={b.href}>{b.label}</Link>
                  ) : (
                    b.label
                  ),
                }))}
              />
            </div>
            <div style={{ padding: 16 }}>{children}</div>
          </Content>
        </Layout>
      </Layout>
    </AntdApp>
  );
}
