import { type NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin + Portal routes — handle auth, skip i18n
  if (pathname.startsWith("/admin") || pathname.startsWith("/portal")) {
    // Allow login page without auth
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

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
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
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
    "/admin/:path*",
    "/portal/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)"],
};
