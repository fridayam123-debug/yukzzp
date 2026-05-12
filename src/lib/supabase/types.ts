export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          display_name: string | null
          id: string
          role: string
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          id: string
          role?: string
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          id?: string
          role?: string
        }
        Relationships: []
      }
      emergency_banner: {
        Row: {
          active: boolean | null
          created_at: string | null
          expires_at: string | null
          id: string
          message_en: string | null
          message_ko: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          message_en?: string | null
          message_ko: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          message_en?: string | null
          message_ko?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer_en: string | null
          answer_ko: string
          category: string | null
          id: string
          location_id: string | null
          question_en: string | null
          question_ko: string
          slug: string
          sort_order: number | null
        }
        Insert: {
          answer_en?: string | null
          answer_ko: string
          category?: string | null
          id?: string
          location_id?: string | null
          question_en?: string | null
          question_ko: string
          slug: string
          sort_order?: number | null
        }
        Update: {
          answer_en?: string | null
          answer_ko?: string
          category?: string | null
          id?: string
          location_id?: string | null
          question_en?: string | null
          question_ko?: string
          slug?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "faqs_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address_jibun: string
          address_road: string
          amenities: string[] | null
          catchtable_url: string | null
          category_en: string
          category_ko: string
          created_at: string | null
          geo: Json | null
          group_seats: Json | null
          hero_image: string | null
          hours: Json
          id: string
          meta_description_en: string | null
          meta_description_ko: string | null
          name_en: string
          name_ko: string
          naver_place_id: string | null
          parking: Json | null
          phone: string
          photos: string[] | null
          postal_code: string | null
          rooms: Json | null
          slug: string
          updated_at: string | null
          virtual_phone: string | null
        }
        Insert: {
          address_jibun: string
          address_road: string
          amenities?: string[] | null
          catchtable_url?: string | null
          category_en: string
          category_ko: string
          created_at?: string | null
          geo?: Json | null
          group_seats?: Json | null
          hero_image?: string | null
          hours?: Json
          id?: string
          meta_description_en?: string | null
          meta_description_ko?: string | null
          name_en: string
          name_ko: string
          naver_place_id?: string | null
          parking?: Json | null
          phone: string
          photos?: string[] | null
          postal_code?: string | null
          rooms?: Json | null
          slug: string
          updated_at?: string | null
          virtual_phone?: string | null
        }
        Update: {
          address_jibun?: string
          address_road?: string
          amenities?: string[] | null
          catchtable_url?: string | null
          category_en?: string
          category_ko?: string
          created_at?: string | null
          geo?: Json | null
          group_seats?: Json | null
          hero_image?: string | null
          hours?: Json
          id?: string
          meta_description_en?: string | null
          meta_description_ko?: string | null
          name_en?: string
          name_ko?: string
          naver_place_id?: string | null
          parking?: Json | null
          phone?: string
          photos?: string[] | null
          postal_code?: string | null
          rooms?: Json | null
          slug?: string
          updated_at?: string | null
          virtual_phone?: string | null
        }
        Relationships: []
      }
      menu_categories: {
        Row: {
          id: string
          name_en: string
          name_ko: string
          slug: string
          sort_order: number
        }
        Insert: {
          id?: string
          name_en: string
          name_ko: string
          slug: string
          sort_order?: number
        }
        Update: {
          id?: string
          name_en?: string
          name_ko?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          available_at_euljiro: boolean | null
          available_at_yangjae: boolean | null
          category_id: string | null
          description_en: string | null
          description_ko: string | null
          id: string
          image_url: string | null
          is_lunch_special: boolean | null
          is_signature: boolean | null
          name_en: string | null
          name_ko: string
          photo_url: string | null
          price_krw: number | null
          sort_order: number
          updated_at: string | null
          weight_g: number | null
        }
        Insert: {
          available_at_euljiro?: boolean | null
          available_at_yangjae?: boolean | null
          category_id?: string | null
          description_en?: string | null
          description_ko?: string | null
          id?: string
          image_url?: string | null
          photo_url?: string | null
          is_lunch_special?: boolean | null
          is_signature?: boolean | null
          name_en?: string | null
          name_ko: string
          price_krw?: number | null
          sort_order?: number
          updated_at?: string | null
          weight_g?: number | null
        }
        Update: {
          available_at_euljiro?: boolean | null
          available_at_yangjae?: boolean | null
          category_id?: string | null
          description_en?: string | null
          description_ko?: string | null
          id?: string
          image_url?: string | null
          is_lunch_special?: boolean | null
          is_signature?: boolean | null
          name_en?: string | null
          name_ko?: string
          photo_url?: string | null
          price_krw?: number | null
          sort_order?: number
          updated_at?: string | null
          weight_g?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      site_config: {
        Row: {
          key: string
          value: string
          updated_at: string | null
        }
        Insert: {
          key: string
          value: string
          updated_at?: string | null
        }
        Update: {
          key?: string
          value?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ingredient_catalog: {
        Row: {
          id: string
          category: string
          brand: string
          product_name: string
          sku: string | null
          use_cases: string[]
          flavor_notes: string | null
          price_krw: number | null
          unit: string | null
          retailer: string | null
          retailer_url: string | null
          source_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category: string
          brand: string
          product_name: string
          sku?: string | null
          use_cases?: string[]
          flavor_notes?: string | null
          price_krw?: number | null
          unit?: string | null
          retailer?: string | null
          retailer_url?: string | null
          source_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<{
          category: string; brand: string; product_name: string
          sku: string | null; use_cases: string[]
          flavor_notes: string | null; price_krw: number | null
          unit: string | null; retailer: string | null
          retailer_url: string | null; source_score: number; updated_at: string
        }>
        Relationships: []
      }
      ingredient_profile: {
        Row: {
          id: string
          ingredient_name: string
          catalog_id: string | null
          custom_brand: string | null
          custom_note: string | null
          vendor: string | null
          is_active: boolean
          added_at: string
        }
        Insert: {
          id?: string
          ingredient_name: string
          catalog_id?: string | null
          custom_brand?: string | null
          custom_note?: string | null
          vendor?: string | null
          is_active?: boolean
          added_at?: string
        }
        Update: Partial<{
          ingredient_name: string; catalog_id: string | null
          custom_brand: string | null; custom_note: string | null
          vendor: string | null; is_active: boolean
        }>
        Relationships: [{ foreignKeyName: "ingredient_profile_catalog_id_fkey"; columns: ["catalog_id"]; referencedRelation: "ingredient_catalog"; referencedColumns: ["id"] }]
      }
      recipe_usage_log: {
        Row: {
          id: string
          admin_user_id: string | null
          dish_name: string | null
          input_tokens: number | null
          output_tokens: number | null
          cost_usd: number | null
          model: string
          tier: string
          error: string | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_user_id?: string | null
          dish_name?: string | null
          input_tokens?: number | null
          output_tokens?: number | null
          cost_usd?: number | null
          model?: string
          tier?: string
          error?: string | null
          created_at?: string
        }
        Update: Partial<{
          dish_name: string | null; input_tokens: number | null
          output_tokens: number | null; cost_usd: number | null
          error: string | null
        }>
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
