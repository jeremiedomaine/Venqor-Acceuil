import { NextResponse, type NextRequest } from "next/server"
import { createMiddlewareSupabaseClient } from "@/lib/supabase/middleware"

const PUBLIC_PATHS = [
  "/login",
  "/auth/callback",
  "/auth/logout",
  "/onboarding",
  "/espace",
]

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  )
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createMiddlewareSupabaseClient(request, response)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  if (!user && !isPublicPath(pathname)) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = "/login"
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (!user && pathname === "/onboarding") {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = "/login"
    loginUrl.searchParams.set("next", "/onboarding")
    return NextResponse.redirect(loginUrl)
  }

  if (
    user &&
    pathname === "/login" &&
    request.nextUrl.searchParams.get("signed_out") !== "1"
  ) {
    const next = request.nextUrl.searchParams.get("next") || "/"
    const dest = request.nextUrl.clone()
    dest.pathname = next.startsWith("/") ? next : "/"
    dest.search = ""
    return NextResponse.redirect(dest)
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
