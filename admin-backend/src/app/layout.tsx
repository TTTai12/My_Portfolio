import React from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import ToastProvider from "@/components/ToastProvider";
import "antd/dist/reset.css"; // Antd v5 style reset
import "@/app/globals.css"; // your tailwind or global styles

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>
          <AdminLayout>{children}</AdminLayout>
          <ToastProvider />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
