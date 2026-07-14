import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";
import { defaultLocale, locales } from "@/i18n/config";

const PUBLIC_FILE = /\.(.*)$/;

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // --- Admin auth (optimistic check only, real checks happen in the DAL) ---
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }
    const cookie = req.cookies.get("carver_session")?.value;
    const session = await decrypt(cookie);
    if (!session?.adminId) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }

  // --- Locale routing ---
  const matchedLocale = locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (!matchedLocale) {
    const acceptLanguage = req.headers.get("accept-language") ?? "";
    const preferred = acceptLanguage.toLowerCase().startsWith("en") ? "en" : defaultLocale;

    const url = req.nextUrl.clone();
    url.pathname = `/${preferred}${pathname}`;
    return NextResponse.redirect(url);
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-locale", matchedLocale);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
