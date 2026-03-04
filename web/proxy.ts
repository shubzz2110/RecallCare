import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login", "/forgot-password"];

const PUBLIC_ALWAYS_ROUTES = ["/setup-account"];

const PROTECTED_PREFIXES = ["/dashboard", "/profile", "/internal"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasRefreshToken = request.cookies.has("refreshToken");

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isAlwaysPublic = PUBLIC_ALWAYS_ROUTES.includes(pathname);
  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  // Always-public routes are accessible regardless of auth state
  if (isAlwaysPublic) {
    return NextResponse.next();
  }

  // Authenticated user trying to access login → redirect to dashboard
  if (hasRefreshToken && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Unauthenticated user trying to access protected route → redirect to login
  if (!hasRefreshToken && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, icons, images
     * - public files
     */
    "/((?!_next/static|_next/image|favicon\\.ico|icon\\.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
