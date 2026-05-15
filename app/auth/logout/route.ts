import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import type { Database } from "@/lib/supabase/database.types"
import {
  getSupabasePublishableKey,
  getSupabaseUrl,
} from "@/lib/supabase/env"

export async function POST(request: NextRequest) {
  const loginUrl = new URL("/login", request.url)
  let response = NextResponse.redirect(loginUrl, { status: 303 })

  const supabase = createServerClient<Database>(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    },
  )

  await supabase.auth.signOut()
  return response
}
