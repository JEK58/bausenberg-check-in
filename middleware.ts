import { NextResponse, NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";

function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.endsWith("/admin")) {
    const year = new Date().getFullYear();
    return NextResponse.redirect(new URL(`/admin/${year}`, request.url));
  }
}

export default withAuth(middleware, {
  callbacks: {
    authorized({ token }) {
      if (token && token.name == "admin") return !!token;
      return false;
    },
  },
});

export const config = {
  matcher: "/admin/:path*",
};
