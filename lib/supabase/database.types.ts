export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      domains: {
        Row: {
          id: string
          slug: string
          name: string
          address: string | null
          cover_image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          address?: string | null
          cover_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["domains"]["Insert"]>
      }
      domain_events: {
        Row: {
          id: string
          domain_id: string
          legacy_id: string | null
          title: string
          type: string
          date_start: string
          date_end: string
          guest_count: number
          booking_status: string
          client_or_org: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          domain_id: string
          legacy_id?: string | null
          title: string
          type: string
          date_start: string
          date_end: string
          guest_count?: number
          booking_status?: string
          client_or_org?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["domain_events"]["Insert"]>
      }
      catalogue_extras: {
        Row: {
          id: string
          domain_id: string
          legacy_id: string | null
          label: string
          description: string
          price_eur: number
          category: string
          visible: boolean
          vat_percent: number
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          domain_id: string
          legacy_id?: string | null
          label: string
          description?: string
          price_eur?: number
          category: string
          visible?: boolean
          vat_percent?: number
          sort_order?: number
        }
        Update: Partial<Database["public"]["Tables"]["catalogue_extras"]["Insert"]>
      }
      catalogue_config: {
        Row: {
          domain_id: string
          show_ttc_by_default: boolean
          intro_client: string
          min_lead_days: number
          guest_booking_allowed: boolean
          platform_fee_percent: number
          updated_at: string
        }
        Insert: {
          domain_id: string
          show_ttc_by_default?: boolean
          intro_client?: string
          min_lead_days?: number
          guest_booking_allowed?: boolean
          platform_fee_percent?: number
        }
        Update: Partial<Database["public"]["Tables"]["catalogue_config"]["Insert"]>
      }
      prestataires: {
        Row: {
          id: string
          domain_id: string
          legacy_id: string | null
          name: string
          category: string
          contact_name: string
          email: string
          phone: string
          status: string
          events_linked: number
          last_or_next_mission: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          domain_id: string
          legacy_id?: string | null
          name: string
          category: string
          contact_name?: string
          email?: string
          phone?: string
          status?: string
          events_linked?: number
          last_or_next_mission?: string
        }
        Update: Partial<Database["public"]["Tables"]["prestataires"]["Insert"]>
      }
      domain_apps: {
        Row: {
          id: string
          domain_id: string
          legacy_id: string | null
          label: string
          slug: string
          host: string
          status: string
          description: string | null
          partner_one: string
          partner_two: string
          wedding_date: string
          welcome_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          domain_id: string
          legacy_id?: string | null
          label: string
          slug: string
          host: string
          status?: string
          description?: string | null
          partner_one?: string
          partner_two?: string
          wedding_date?: string
          welcome_message?: string | null
          created_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["domain_apps"]["Insert"]>
      }
      profiles: {
        Row: {
          id: string
          domain_id: string
          full_name: string | null
          role: string
          created_at: string
        }
        Insert: {
          id: string
          domain_id: string
          full_name?: string | null
          role?: string
        }
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
