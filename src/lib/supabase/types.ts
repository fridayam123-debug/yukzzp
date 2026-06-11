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
      ingredient_catalog: {
        Row: {
          brand: string
          category: string
          created_at: string
          flavor_notes: string | null
          id: string
          price_krw: number | null
          product_name: string
          retailer: string | null
          retailer_url: string | null
          sku: string | null
          source_score: number
          unit: string | null
          updated_at: string
          use_cases: string[]
        }
        Insert: {
          brand: string
          category: string
          created_at?: string
          flavor_notes?: string | null
          id?: string
          price_krw?: number | null
          product_name: string
          retailer?: string | null
          retailer_url?: string | null
          sku?: string | null
          source_score?: number
          unit?: string | null
          updated_at?: string
          use_cases?: string[]
        }
        Update: {
          brand?: string
          category?: string
          created_at?: string
          flavor_notes?: string | null
          id?: string
          price_krw?: number | null
          product_name?: string
          retailer?: string | null
          retailer_url?: string | null
          sku?: string | null
          source_score?: number
          unit?: string | null
          updated_at?: string
          use_cases?: string[]
        }
        Relationships: []
      }
      ingredient_profile: {
        Row: {
          added_at: string
          catalog_id: string | null
          custom_brand: string | null
          custom_note: string | null
          id: string
          ingredient_name: string
          is_active: boolean
          vendor: string | null
        }
        Insert: {
          added_at?: string
          catalog_id?: string | null
          custom_brand?: string | null
          custom_note?: string | null
          id?: string
          ingredient_name: string
          is_active?: boolean
          vendor?: string | null
        }
        Update: {
          added_at?: string
          catalog_id?: string | null
          custom_brand?: string | null
          custom_note?: string | null
          id?: string
          ingredient_name?: string
          is_active?: boolean
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ingredient_profile_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "ingredient_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      instagram_reels: {
        Row: {
          caption: string | null
          created_at: string | null
          id: string
          reel_id: string
          sort_order: number
          visible: boolean
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          id?: string
          reel_id: string
          sort_order?: number
          visible?: boolean
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          id?: string
          reel_id?: string
          sort_order?: number
          visible?: boolean
        }
        Relationships: []
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
          is_lunch_special?: boolean | null
          is_signature?: boolean | null
          name_en?: string | null
          name_ko: string
          photo_url?: string | null
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
      recipe_usage_log: {
        Row: {
          admin_user_id: string | null
          cost_usd: number | null
          created_at: string
          dish_name: string | null
          error: string | null
          id: string
          input_tokens: number | null
          model: string
          output_tokens: number | null
          tier: string
        }
        Insert: {
          admin_user_id?: string | null
          cost_usd?: number | null
          created_at?: string
          dish_name?: string | null
          error?: string | null
          id?: string
          input_tokens?: number | null
          model?: string
          output_tokens?: number | null
          tier?: string
        }
        Update: {
          admin_user_id?: string | null
          cost_usd?: number | null
          created_at?: string
          dish_name?: string | null
          error?: string | null
          id?: string
          input_tokens?: number | null
          model?: string
          output_tokens?: number | null
          tier?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_usage_log_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          author: string
          created_at: string
          id: string
          location_slug: string
          rating: number | null
          rec_count: number
          source: string
          source_id: string | null
          text: string
          visible: boolean
          visited_at: string | null
        }
        Insert: {
          author: string
          created_at?: string
          id?: string
          location_slug: string
          rating?: number | null
          rec_count?: number
          source?: string
          source_id?: string | null
          text: string
          visible?: boolean
          visited_at?: string | null
        }
        Update: {
          author?: string
          created_at?: string
          id?: string
          location_slug?: string
          rating?: number | null
          rec_count?: number
          source?: string
          source_id?: string | null
          text?: string
          visible?: boolean
          visited_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_location_slug_fkey"
            columns: ["location_slug"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["slug"]
          },
        ]
      }
      site_config: {
        Row: {
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      site_copy: {
        Row: {
          key: string
          label: string
          section: string
          updated_at: string | null
          value: string
          value_en: string | null
          value_ja: string | null
          value_vi: string | null
        }
        Insert: {
          key: string
          label: string
          section?: string
          updated_at?: string | null
          value: string
          value_en?: string | null
          value_ja?: string | null
          value_vi?: string | null
        }
        Update: {
          key?: string
          label?: string
          section?: string
          updated_at?: string | null
          value?: string
          value_en?: string | null
          value_ja?: string | null
          value_vi?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          id: string
          title: string
          excerpt: string | null
          content: string
          category: string
          thumbnail_url: string | null
          slug: string
          is_published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          excerpt?: string | null
          content?: string
          category: string
          thumbnail_url?: string | null
          slug: string
          is_published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          excerpt?: string | null
          content?: string
          category?: string
          thumbnail_url?: string | null
          slug?: string
          is_published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      daily_recipe_usage: {
        Row: {
          call_count: number | null
          cost_usd: number | null
          day: string | null
          error_count: number | null
          input_tokens: number | null
          output_tokens: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      update_menu_photo_url: {
        Args: { item_id: string; new_photo_url: string }
        Returns: undefined
      }
      update_site_copy: {
        Args: { p_key: string; p_value: string }
        Returns: undefined
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
