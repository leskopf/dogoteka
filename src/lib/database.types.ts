export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      owners: {
        Row: {
          id: string
          first_name: string
          last_name: string
          phone: string
          phone_emergency: string | null
          email: string | null
          address: string | null
          is_recurring: boolean
          created_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          phone: string
          phone_emergency?: string | null
          email?: string | null
          address?: string | null
          is_recurring?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          phone?: string
          phone_emergency?: string | null
          email?: string | null
          address?: string | null
          is_recurring?: boolean
          created_at?: string
        }
        Relationships: []
      }
      dogs: {
        Row: {
          id: string
          owner_id: string | null
          name: string
          breed: string | null
          passport_number: string | null
          chip_number: string | null
          weight_kg: number | null
          food_notes: string | null
          medication: string | null
          vet_name: string | null
          vet_phone: string | null
          extra_notes: string | null
          photo_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          owner_id?: string | null
          name: string
          breed?: string | null
          passport_number?: string | null
          chip_number?: string | null
          weight_kg?: number | null
          food_notes?: string | null
          medication?: string | null
          vet_name?: string | null
          vet_phone?: string | null
          extra_notes?: string | null
          photo_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          owner_id?: string | null
          name?: string
          breed?: string | null
          passport_number?: string | null
          chip_number?: string | null
          weight_kg?: number | null
          food_notes?: string | null
          medication?: string | null
          vet_name?: string | null
          vet_phone?: string | null
          extra_notes?: string | null
          photo_url?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'dogs_owner_id_fkey'
            columns: ['owner_id']
            isOneToOne: false
            referencedRelation: 'owners'
            referencedColumns: ['id']
          }
        ]
      }
      dog_tags: {
        Row: {
          id: string
          dog_id: string
          label: string
          color: string
        }
        Insert: {
          id?: string
          dog_id: string
          label: string
          color?: string
        }
        Update: {
          id?: string
          dog_id?: string
          label?: string
          color?: string
        }
        Relationships: [
          {
            foreignKeyName: 'dog_tags_dog_id_fkey'
            columns: ['dog_id']
            isOneToOne: false
            referencedRelation: 'dogs'
            referencedColumns: ['id']
          }
        ]
      }
      stays: {
        Row: {
          id: string
          dog_id: string
          date_from: string
          date_to: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          dog_id: string
          date_from: string
          date_to: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          dog_id?: string
          date_from?: string
          date_to?: string
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'stays_dog_id_fkey'
            columns: ['dog_id']
            isOneToOne: false
            referencedRelation: 'dogs'
            referencedColumns: ['id']
          }
        ]
      }
      stay_notes: {
        Row: {
          id: string
          stay_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          stay_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          stay_id?: string
          content?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'stay_notes_stay_id_fkey'
            columns: ['stay_id']
            isOneToOne: false
            referencedRelation: 'stays'
            referencedColumns: ['id']
          }
        ]
      }
      dog_photos: {
        Row: {
          id: string
          dog_id: string
          storage_path: string
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          dog_id: string
          storage_path: string
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          dog_id?: string
          storage_path?: string
          is_primary?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'dog_photos_dog_id_fkey'
            columns: ['dog_id']
            isOneToOne: false
            referencedRelation: 'dogs'
            referencedColumns: ['id']
          }
        ]
      }
      share_tokens: {
        Row: {
          id: string
          dog_id: string
          token: string
          created_at: string
        }
        Insert: {
          id?: string
          dog_id: string
          token?: string
          created_at?: string
        }
        Update: {
          id?: string
          dog_id?: string
          token?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'share_tokens_dog_id_fkey'
            columns: ['dog_id']
            isOneToOne: false
            referencedRelation: 'dogs'
            referencedColumns: ['id']
          }
        ]
      }
      audit_log: {
        Row: {
          id: string
          table_name: string
          record_id: string | null
          action: string
          changed_by: string | null
          changed_at: string
          old_data: Json | null
          new_data: Json | null
        }
        Insert: {
          id?: string
          table_name: string
          record_id?: string | null
          action: string
          changed_by?: string | null
          changed_at?: string
          old_data?: Json | null
          new_data?: Json | null
        }
        Update: {
          id?: string
          table_name?: string
          record_id?: string | null
          action?: string
          changed_by?: string | null
          changed_at?: string
          old_data?: Json | null
          new_data?: Json | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          id: number
          max_capacity: number
          issuer_name: string | null
          issuer_address: string | null
          issuer_ico: string | null
          issuer_dic: string | null
          bank_account: string | null
          bank_iban: string | null
          bank_name: string | null
          default_rate_czk: number | null
          invoice_counter: number | null
        }
        Insert: {
          id?: number
          max_capacity?: number
          issuer_name?: string | null
          issuer_address?: string | null
          issuer_ico?: string | null
          issuer_dic?: string | null
          bank_account?: string | null
          bank_iban?: string | null
          bank_name?: string | null
          default_rate_czk?: number | null
          invoice_counter?: number | null
        }
        Update: {
          id?: number
          max_capacity?: number
          issuer_name?: string | null
          issuer_address?: string | null
          issuer_ico?: string | null
          issuer_dic?: string | null
          bank_account?: string | null
          bank_iban?: string | null
          bank_name?: string | null
          default_rate_czk?: number | null
          invoice_counter?: number | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          id: string
          stay_id: string
          type: 'deposit' | 'final'
          amount: number
          paid_at: string | null
          invoice_number: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          stay_id: string
          type: 'deposit' | 'final'
          amount: number
          paid_at?: string | null
          invoice_number?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          stay_id?: string
          type?: 'deposit' | 'final'
          amount?: number
          paid_at?: string | null
          invoice_number?: string | null
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'payments_stay_id_fkey'
            columns: ['stay_id']
            isOneToOne: false
            referencedRelation: 'stays'
            referencedColumns: ['id']
          }
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
          id: string
          owner_id: string | null
          name: string
          breed: string | null
          passport_number: string | null
          chip_number: string | null
          weight_kg: number | null
          food_notes: string | null
          medication: string | null
          vet_name: string | null
          vet_phone: string | null
          extra_notes: string | null
          photo_url: string | null
          created_at: string
        }[]
      }
      increment_invoice_counter: {
        Args: Record<PropertyKey, never>
        Returns: string
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

export type Owner = Database['public']['Tables']['owners']['Row']
export type Dog = Database['public']['Tables']['dogs']['Row']
export type DogTag = Database['public']['Tables']['dog_tags']['Row']
export type Stay = Database['public']['Tables']['stays']['Row']
export type StayNote = Database['public']['Tables']['stay_notes']['Row']
export type DogPhoto = Database['public']['Tables']['dog_photos']['Row']
export type ShareToken = Database['public']['Tables']['share_tokens']['Row']
export type AuditLog = Database['public']['Tables']['audit_log']['Row']
export type Settings = Database['public']['Tables']['settings']['Row']
export type Payment = Database['public']['Tables']['payments']['Row']
export type PaymentType = Payment['type']
