export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
// export type carlistingRow = Database['public']['Tables']['carlisting']['Row']
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
      carbrand: {
        Row: {
          brandid: number
          brandname: string | null
          chinesebrandname: string | null
        }
        Insert: {
          brandid?: never
          brandname?: string | null
          chinesebrandname?: string | null
        }
        Update: {
          brandid?: never
          brandname?: string | null
          chinesebrandname?: string | null
        }
        Relationships: []
      }
      carlisting: {
        Row: {
          brandid: number | null
          carname: string
          cc: string | null
          create_dt: string | null
          fuel: string | null
          imagefilenames: string[] | null
          keyfeatures: string | null
          listingid: number
          mileageinfo: string | null
          modelid: number | null
          price: string | null
          seller_name: string | null
          seller_phone: string | null
          updated_at: string | null
          userid: string | null
          videofilenames: string[] | null
          year: number | null
        }
        Insert: {
          brandid?: number | null
          carname: string
          cc?: string | null
          create_dt?: string | null
          fuel?: string | null
          imagefilenames?: string[] | null
          keyfeatures?: string | null
          listingid?: never
          mileageinfo?: string | null
          modelid?: number | null
          price?: string | null
          seller_name?: string | null
          seller_phone?: string | null
          updated_at?: string | null
          userid?: string | null
          videofilenames?: string[] | null
          year?: number | null
        }
        Update: {
          brandid?: number | null
          carname?: string
          cc?: string | null
          create_dt?: string | null
          fuel?: string | null
          imagefilenames?: string[] | null
          keyfeatures?: string | null
          listingid?: never
          mileageinfo?: string | null
          modelid?: number | null
          price?: string | null
          seller_name?: string | null
          seller_phone?: string | null
          updated_at?: string | null
          userid?: string | null
          videofilenames?: string[] | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "carlisting_brandid_fkey"
            columns: ["brandid"]
            referencedRelation: "carbrand"
            referencedColumns: ["brandid"]
          },
          {
            foreignKeyName: "carlisting_modelid_fkey"
            columns: ["modelid"]
            referencedRelation: "carmodel"
            referencedColumns: ["modelid"]
          }
        ]
      }
      carmodel: {
        Row: {
          brandid: number | null
          modelid: number
          modelname: string | null
        }
        Insert: {
          brandid?: number | null
          modelid?: never
          modelname?: string | null
        }
        Update: {
          brandid?: number | null
          modelid?: never
          modelname?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carmodel_brandid_fkey"
            columns: ["brandid"]
            referencedRelation: "carbrand"
            referencedColumns: ["brandid"]
          }
        ]
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
