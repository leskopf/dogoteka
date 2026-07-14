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
      audit_log: {
        Row: {
          action: string
          changed_at: string | null
          changed_by: string | null
          id: string
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
        }
        Insert: {
          action: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
        }
        Update: {
          action?: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
        }
        Relationships: []
      }
      dog_photos: {
        Row: {
          created_at: string | null
          dog_id: string | null
          id: string
          is_primary: boolean | null
          storage_path: string
        }
        Insert: {
          created_at?: string | null
          dog_id?: string | null
          id?: string
          is_primary?: boolean | null
          storage_path: string
        }
        Update: {
          created_at?: string | null
          dog_id?: string | null
          id?: string
          is_primary?: boolean | null
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "dog_photos_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      dog_tags: {
        Row: {
          color: string
          dog_id: string | null
          id: string
          label: string
        }
        Insert: {
          color?: string
          dog_id?: string | null
          id?: string
          label: string
        }
        Update: {
          color?: string
          dog_id?: string | null
          id?: string
          label?: string
        }
        Relationships: [
          {
            foreignKeyName: "dog_tags_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      dogs: {
        Row: {
          breed: string | null
          chip_number: string | null
          created_at: string | null
          extra_notes: string | null
          food_notes: string | null
          id: string
          medication: string | null
          name: string
          owner_id: string | null
          passport_number: string | null
          photo_url: string | null
          vet_name: string | null
          vet_phone: string | null
          weight_kg: number | null
        }
        Insert: {
          breed?: string | null
          chip_number?: string | null
          created_at?: string | null
          extra_notes?: string | null
          food_notes?: string | null
          id?: string
          medication?: string | null
          name: string
          owner_id?: string | null
          passport_number?: string | null
          photo_url?: string | null
          vet_name?: string | null
          vet_phone?: string | null
          weight_kg?: number | null
        }
        Update: {
          breed?: string | null
          chip_number?: string | null
          created_at?: string | null
          extra_notes?: string | null
          food_notes?: string | null
          id?: string
          medication?: string | null
          name?: string
          owner_id?: string | null
          passport_number?: string | null
          photo_url?: string | null
          vet_name?: string | null
          vet_phone?: string | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dogs_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
        ]
      }
      owners: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          first_name: string
          id: string
          is_recurring: boolean | null
          last_name: string
          phone: string
          phone_emergency: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          first_name: string
          id?: string
          is_recurring?: boolean | null
          last_name: string
          phone: string
          phone_emergency?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: string
          is_recurring?: boolean | null
          last_name?: string
          phone?: string
          phone_emergency?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          due_date: string | null
          id: string
          invoice_number: string | null
          notes: string | null
          paid_at: string | null
          stay_id: string
          type: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          notes?: string | null
          paid_at?: string | null
          stay_id: string
          type: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          notes?: string | null
          paid_at?: string | null
          stay_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_stay_id_fkey"
            columns: ["stay_id"]
            isOneToOne: false
            referencedRelation: "stays"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          bank_account: string | null
          bank_iban: string | null
          bank_name: string | null
          default_rate_czk: number | null
          id: number
          invoice_counter: number | null
          issuer_address: string | null
          issuer_dic: string | null
          issuer_email: string | null
          issuer_ico: string | null
          issuer_name: string | null
          issuer_phone: string | null
          issuer_web: string | null
          max_capacity: number | null
        }
        Insert: {
          bank_account?: string | null
          bank_iban?: string | null
          bank_name?: string | null
          default_rate_czk?: number | null
          id?: number
          invoice_counter?: number | null
          issuer_address?: string | null
          issuer_dic?: string | null
          issuer_email?: string | null
          issuer_ico?: string | null
          issuer_name?: string | null
          issuer_phone?: string | null
          issuer_web?: string | null
          max_capacity?: number | null
        }
        Update: {
          bank_account?: string | null
          bank_iban?: string | null
          bank_name?: string | null
          default_rate_czk?: number | null
          id?: number
          invoice_counter?: number | null
          issuer_address?: string | null
          issuer_dic?: string | null
          issuer_email?: string | null
          issuer_ico?: string | null
          issuer_name?: string | null
          issuer_phone?: string | null
          issuer_web?: string | null
          max_capacity?: number | null
        }
        Relationships: []
      }
      share_tokens: {
        Row: {
          created_at: string | null
          dog_id: string | null
          id: string
          token: string
        }
        Insert: {
          created_at?: string | null
          dog_id?: string | null
          id?: string
          token?: string
        }
        Update: {
          created_at?: string | null
          dog_id?: string | null
          id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "share_tokens_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      stay_notes: {
        Row: {
          content: string
          created_at: string | null
          id: string
          stay_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          stay_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          stay_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stay_notes_stay_id_fkey"
            columns: ["stay_id"]
            isOneToOne: false
            referencedRelation: "stays"
            referencedColumns: ["id"]
          },
        ]
      }
      stays: {
        Row: {
          created_at: string | null
          date_from: string
          date_to: string
          dog_id: string | null
          id: string
          notes: string | null
          time_from: string | null
          time_to: string | null
        }
        Insert: {
          created_at?: string | null
          date_from: string
          date_to: string
          dog_id?: string | null
          id?: string
          notes?: string | null
          time_from?: string | null
          time_to?: string | null
        }
        Update: {
          created_at?: string | null
          date_from?: string
          date_to?: string
          dog_id?: string | null
          id?: string
          notes?: string | null
          time_from?: string | null
          time_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stays_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_dog_by_token: {
        Args: { p_token: string }
        Returns: {
          breed: string | null
          chip_number: string | null
          created_at: string | null
          extra_notes: string | null
          food_notes: string | null
          id: string
          medication: string | null
          name: string
          owner_id: string | null
          passport_number: string | null
          photo_url: string | null
          vet_name: string | null
          vet_phone: string | null
          weight_kg: number | null
        }[]
        SetofOptions: {
          from: "*"
          to: "dogs"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      increment_invoice_counter: { Args: never; Returns: string }
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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

export type Payment = Database['public']['Tables']['payments']['Row']
export type PaymentType = Payment['type']
export type Settings = Database['public']['Tables']['settings']['Row']
export type Dog = Database['public']['Tables']['dogs']['Row']
export type Owner = Database['public']['Tables']['owners']['Row']
export type Stay = Database['public']['Tables']['stays']['Row']
export type StayNote = Database['public']['Tables']['stay_notes']['Row']
export type DogTag = Database['public']['Tables']['dog_tags']['Row']
export type DogPhoto = Database['public']['Tables']['dog_photos']['Row']
export type AuditLog = Database['public']['Tables']['audit_log']['Row']
export type ShareToken = Database['public']['Tables']['share_tokens']['Row']
