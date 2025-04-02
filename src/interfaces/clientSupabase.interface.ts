export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          stock: number;
          image_url: string | null;
          category_id: string | null;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price: number;
          stock?: number;
          image_url?: string | null;
          category_id?: string | null;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          stock?: number;
          image_url?: string | null;
          category_id?: string | null;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'products_category_id_fkey';
            columns: ['category_id'];
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      carts: {
        Row: {
          id: string;
          user_id: string | null;
          created_at: string;
          updated_at: string;
          device_fingerprint: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
          device_fingerprint?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
          device_fingerprint?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'carts_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      cart_items: {
        Row: {
          id: string;
          cart_id: string;
          product_id: string;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cart_id: string;
          product_id: string;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cart_id?: string;
          product_id?: string;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'cart_items_cart_id_fkey';
            columns: ['cart_id'];
            referencedRelation: 'carts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'cart_items_product_id_fkey';
            columns: ['product_id'];
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
      favorite_collections: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          created_at: string;
          updated_at: string;
          device_fingerprint: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          created_at?: string;
          updated_at?: string;
          device_fingerprint?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          created_at?: string;
          updated_at?: string;
          device_fingerprint?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'favorite_collections_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      favorite_items: {
        Row: {
          id: string;
          collection_id: string;
          product_id: string;
          added_at: string;
        };
        Insert: {
          id?: string;
          collection_id: string;
          product_id: string;
          added_at?: string;
        };
        Update: {
          id?: string;
          collection_id?: string;
          product_id?: string;
          added_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'favorite_items_collection_id_fkey';
            columns: ['collection_id'];
            referencedRelation: 'favorite_collections';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'favorite_items_product_id_fkey';
            columns: ['product_id'];
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
