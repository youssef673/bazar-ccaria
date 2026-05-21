import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLogin = req.nextUrl.pathname === "/admin/login";
  const isLoggedIn = !!req.auth;
  const isAdmin = (req.auth?.user as { role?: string } | undefined)?.role === "ADMIN";

  if (isAdminRoute && !isLogin && !isLoggedIn) {
    const loginUrl = new URL("/admin/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && !isLogin && !isAdmin) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl.origin));
  }

  if (isLogin && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
