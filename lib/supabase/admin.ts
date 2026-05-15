import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"
import {
  getSupabaseSecretKey,
  getSupabaseUrl,
} from "@/lib/supabase/env"

/** Client serveur uniquement — bypass RLS. Ne jamais exposer au navigateur. */
export function createAdminClient() {
  return createClient<Database>(getSupabaseUrl(), getSupabaseSecretKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
