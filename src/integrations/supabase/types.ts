export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      coaching_bookings: {
        Row: {
          booking_type: string
          card_id: string | null
          checkout_session_id: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          paid_at: string | null
          pending_card_type: string | null
          phone: string | null
          session_date: string | null
          slot_id: string
          stripe_subscription_id: string | null
        }
        Insert: {
          booking_type: string
          card_id?: string | null
          checkout_session_id?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          paid_at?: string | null
          pending_card_type?: string | null
          phone?: string | null
          session_date?: string | null
          slot_id: string
          stripe_subscription_id?: string | null
        }
        Update: {
          booking_type?: string
          card_id?: string | null
          checkout_session_id?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          paid_at?: string | null
          pending_card_type?: string | null
          phone?: string | null
          session_date?: string | null
          slot_id?: string
          stripe_subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coaching_bookings_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "coaching_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coaching_bookings_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "coaching_availability"
            referencedColumns: ["slot_id"]
          },
          {
            foreignKeyName: "coaching_bookings_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "coaching_slots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coaching_bookings_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "coaching_upcoming_sessions"
            referencedColumns: ["slot_id"]
          },
        ]
      }
      coaching_cards: {
        Row: {
          card_type: string
          checkout_session_id: string | null
          created_at: string
          email: string
          expires_on: string
          full_name: string
          id: string
          phone: string | null
          price_eur: number
          total_sessions: number
          used_sessions: number
        }
        Insert: {
          card_type: string
          checkout_session_id?: string | null
          created_at?: string
          email: string
          expires_on: string
          full_name: string
          id?: string
          phone?: string | null
          price_eur: number
          total_sessions: number
          used_sessions?: number
        }
        Update: {
          card_type?: string
          checkout_session_id?: string | null
          created_at?: string
          email?: string
          expires_on?: string
          full_name?: string
          id?: string
          phone?: string | null
          price_eur?: number
          total_sessions?: number
          used_sessions?: number
        }
        Relationships: []
      }
      coaching_slots: {
        Row: {
          booking_open: boolean
          capacity: number
          created_at: string
          day_label: string
          day_order: number
          excluded_dates: string[]
          id: string
          is_active: boolean
          location: string
          next_session_at: string | null
          season_ends_on: string | null
          subscription_price_eur: number
          subscription_stripe_url: string
          time_label: string
          trial_price_eur: number
          trial_stripe_url: string
        }
        Insert: {
          booking_open?: boolean
          capacity?: number
          created_at?: string
          day_label: string
          day_order: number
          excluded_dates?: string[]
          id?: string
          is_active?: boolean
          location: string
          next_session_at?: string | null
          season_ends_on?: string | null
          subscription_price_eur?: number
          subscription_stripe_url: string
          time_label: string
          trial_price_eur?: number
          trial_stripe_url: string
        }
        Update: {
          booking_open?: boolean
          capacity?: number
          created_at?: string
          day_label?: string
          day_order?: number
          excluded_dates?: string[]
          id?: string
          is_active?: boolean
          location?: string
          next_session_at?: string | null
          season_ends_on?: string | null
          subscription_price_eur?: number
          subscription_stripe_url?: string
          time_label?: string
          trial_price_eur?: number
          trial_stripe_url?: string
        }
        Relationships: []
      }
      discovery_bookings: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          session_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone?: string | null
          session_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discovery_bookings_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "discovery_availability"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "discovery_bookings_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "discovery_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      discovery_sessions: {
        Row: {
          capacity: number
          created_at: string
          day_label: string
          id: string
          is_active: boolean
          location: string
          price_eur: number
          starts_at: string
          stripe_url: string
          time_label: string
        }
        Insert: {
          capacity?: number
          created_at?: string
          day_label: string
          id?: string
          is_active?: boolean
          location: string
          price_eur?: number
          starts_at: string
          stripe_url: string
          time_label: string
        }
        Update: {
          capacity?: number
          created_at?: string
          day_label?: string
          id?: string
          is_active?: boolean
          location?: string
          price_eur?: number
          starts_at?: string
          stripe_url?: string
          time_label?: string
        }
        Relationships: []
      }
    }
    Views: {
      coaching_availability: {
        Row: {
          booked: number | null
          booking_open: boolean | null
          capacity: number | null
          day_label: string | null
          day_order: number | null
          location: string | null
          next_session_at: string | null
          remaining: number | null
          season_ends_on: string | null
          slot_id: string | null
          subscription_price_eur: number | null
          subscription_stripe_url: string | null
          time_label: string | null
          trial_price_eur: number | null
          trial_stripe_url: string | null
        }
        Relationships: []
      }
      coaching_upcoming_sessions: {
        Row: {
          booked: number | null
          capacity: number | null
          day_order: number | null
          position: number | null
          remaining: number | null
          session_at: string | null
          session_date: string | null
          slot_id: string | null
        }
        Relationships: []
      }
      discovery_availability: {
        Row: {
          booked: number | null
          capacity: number | null
          day_label: string | null
          location: string | null
          price_eur: number | null
          remaining: number | null
          session_id: string | null
          starts_at: string | null
          stripe_url: string | null
          time_label: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      book_coaching_session: {
        Args: {
          p_booking_type: string
          p_email: string
          p_full_name: string
          p_phone?: string
          p_session_date: string
          p_slot_id: string
        }
        Returns: Json
      }
      book_coaching_slot: {
        Args: {
          p_booking_type: string
          p_email: string
          p_full_name: string
          p_phone?: string
          p_slot_id: string
        }
        Returns: Json
      }
      book_discovery_session: {
        Args: {
          p_email: string
          p_full_name: string
          p_phone?: string
          p_session_id: string
        }
        Returns: Json
      }
      confirm_paid_booking: {
        Args: {
          p_amount_cents: number
          p_booking_id: string
          p_checkout_session_id: string
        }
        Returns: Json
      }
      credit_link_card: {
        Args: {
          p_amount_cents: number
          p_card_type: string
          p_checkout_session_id: string
          p_email: string
          p_full_name: string
          p_sessions: number
        }
        Returns: Json
      }
      get_card_balance: { Args: { p_email: string }; Returns: Json }
      release_subscription_booking: {
        Args: { p_booking_id: string }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
