import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { match } from "@formatjs/intl-localematcher"
import Negotiator from "negotiator"

const locales = ["en", "ja"]
const defaultLocale = "ja"

function getLocale(request: NextRequest) {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  return match(languages, locales, defaultLocale)
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // メンテナンスモード: 準備中ページ以外のすべてのアクセスをリダイレクト
  if (!pathname.startsWith("/maintenance")) {
    // 静的ファイル、API routes、画像などは除外
    const staticFileRegex = /\.(.*)$/
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/images") ||
      pathname.startsWith("/svg") ||
      pathname.startsWith("/fonts") ||
      pathname === "/favicon.ico" ||
      pathname === "/ogp.png" ||
      staticFileRegex.test(pathname)
    ) {
      return NextResponse.next()
    }

    // すべてのページアクセスを準備中ページにリダイレクト
    return NextResponse.redirect(new URL("/maintenance", request.url))
  }

  return NextResponse.next()

  /* 国際化対応のコード（メンテナンス終了後に復元）
  // Check if the pathname starts with any locale followed by /presentations/
  const isPresentationPath = locales.some((locale) =>
    pathname.startsWith(`/${locale}/presentations/`)
  )

  // Skip static files, API routes, images, and presentation paths
  const staticFileRegex = /\.(.*)$/
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    isPresentationPath || // Use the new check
    pathname === "/favicon.ico" ||
    staticFileRegex.test(pathname)
  ) {
    return NextResponse.next()
  }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)

    // Redirect to /{locale} if path is /
    if (pathname === "/") {
      return NextResponse.redirect(new URL(`/${locale}`, request.url))
    }

    // Redirect to /{locale}/{pathname} for other paths
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))
  }

  return NextResponse.next()
  */
}

export const config = {
  // Run middleware for paths not starting with specific prefixes (api, _next, files, images)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)/"],
}
