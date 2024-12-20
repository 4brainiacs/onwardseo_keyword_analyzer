export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      analyses: {
        Row: {
          id: string
          url: string
          title: string | null
          meta_description: string | null
          total_words: number | null
          content: string | null
          project_id: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          url: string
          title?: string | null
          meta_description?: string | null
          total_words?: number | null
          content?: string | null
          project_id: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          url?: string
          title?: string | null
          meta_description?: string | null
          total_words?: number | null
          content?: string | null
          project_id?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analyses_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      keywords: {
        Row: {
          id: string
          analysis_id: string
          phrase: string
          word_count: number
          occurrences: number
          density: number
          prominence: number
          created_at: string | null
        }
        Insert: {
          id?: string
          analysis_id: string
          phrase: string
          word_count: number
          occurrences: number
          density: number
          prominence: number
          created_at?: string | null
        }
        Update: {
          id?: string
          analysis_id?: string
          phrase?: string
          word_count?: number
          occurrences?: number
          density?: number
          prominence?: number
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "keywords_analysis_id_fkey"
            columns: ["analysis_id"]
            referencedRelation: "analyses"
            referencedColumns: ["id"]
          }
        ]
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          user_id: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          user_id: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          user_id?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          id: string
          email: string
          created_at: string | null
          updated_at: string | null
          last_login: string | null
        }
        Insert: {
          id?: string
          email: string
          created_at?: string | null
          updated_at?: string | null
          last_login?: string | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string | null
          updated_at?: string | null
          last_login?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}