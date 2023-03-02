import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const year = new Date().getFullYear();
  return NextResponse.redirect(new URL(`/admin/flights/${year}`, request.url));
}

export const config = {
  matcher: "/admin/flights",
};
