import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/lib/supabase/database.types"
import {
  getSupabasePublishableKey,
  getSupabaseUrl,
} from "@/lib/supabase/env"

export function createBrowserSupabaseClient() {
  return createBrowserClient<Database>(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
  )
}
