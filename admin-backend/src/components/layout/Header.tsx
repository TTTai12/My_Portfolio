"use client";
import { useSession, signOut } from "next-auth/react";
import NotificationBell from "./NotificationBell";

export default function Header() {
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolio Admin</h1>
          <p className="text-sm text-gray-500">Manage your portfolio content</p>
        </div>

        {/* Right: User info and actions */}
        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <NotificationBell />

          {/* User Info */}
          {status === "loading" ? (
            <div className="h-10 w-32 bg-gray-200 animate-pulse rounded-lg" />
          ) : session ? (
            <div className="flex items-center space-x-3">
              {/* User Avatar */}
              <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-4 py-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {session.user?.name?.charAt(0) || "A"}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {session.user?.name || "Admin User"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {session.user?.email || "admin@example.com"}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
