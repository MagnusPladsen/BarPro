import { type NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Login page and offer pages — no auth needed, skip i18n
  if (pathname === "/login" || pathname.startsWith("/offer")) {
    return NextResponse.next();
  }

  // Old admin login — redirect to /login
  if (pathname === "/admin/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Admin + Portal routes — handle auth, skip i18n
  if (pathname.startsWith("/admin") || pathname.startsWith("/portal")) {

    // Check Supabase auth
    let response = NextResponse.next({
      request: { headers: request.headers },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request: { headers: request.headers },
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return response;
  }

  // Public routes — handle i18n
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/",
    "/(no|en)/:path*",
    "/login",
    "/admin/:path*",
    "/portal/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)"],
};
