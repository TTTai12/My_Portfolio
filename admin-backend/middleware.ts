import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";

const corsOrigin = process.env.CORS_ORIGIN || "*";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": corsOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export default function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // CORS preflight: trả về 204 để frontend (domain khác) gọi API được
  if (req.method === "OPTIONS" && pathname.startsWith("/api")) {
    return new NextResponse(null, { status: 204, headers: corsHeaders() });
  }
  // API routes: để Next.js xử lý (headers CORS đã cấu hình trong next.config)
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  return withAuth(req);
}

// Chạy middleware cho: trang admin (bảo vệ) + /api/* (CORS preflight)
export const config = {
  matcher: [
    "/",
    "/api/:path*",
    "/projects/:path*",
    "/skills/:path*",
    "/experience/:path*",
    "/education/:path*",
    "/about/:path*",
    "/messages/:path*",
  ],
};
