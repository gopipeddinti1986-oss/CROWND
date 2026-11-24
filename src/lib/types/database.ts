export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = "brand" | "creator" | "admin";
export type CampaignStatus = "draft" | "active" | "paused" | "completed" | "archived";
export type ApplicationStatus = "pending" | "approved" | "rejected";
export type OrderStatus = "pending" | "delivered" | "return_cleared" | "refunded" | "cancelled";
export type RewardStatus = "pending" | "eligible" | "paid" | "forfeited";
export type TransactionType = "credit" | "debit" | "payout";
export type TransactionStatus = "pending" | "completed" | "failed";
export type RiskSeverity = "low" | "medium" | "high" | "critical";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          role: UserRole;
          full_name: string | null;
          avatar_url: string | null;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: UserRole;
          full_name?: string | null;
          avatar_url?: string | null;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: UserRole;
          full_name?: string | null;
          avatar_url?: string | null;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      brands: {
        Row: {
          id: string;
          profile_id: string;
          company_name: string;
          website: string | null;
          industry: string;
          description: string | null;
          verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          company_name: string;
          website?: string | null;
          industry: string;
          description?: string | null;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          company_name?: string;
          website?: string | null;
          industry?: string;
          description?: string | null;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      creators: {
        Row: {
          id: string;
          profile_id: string;
          handle: string;
          primary_niche: string;
          bio: string | null;
          primary_platform: string;
          audience_size: number;
          engagement_rate: number;
          verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          handle: string;
          primary_niche: string;
          bio?: string | null;
          primary_platform: string;
          audience_size?: number;
          engagement_rate?: number;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          handle?: string;
          primary_niche?: string;
          bio?: string | null;
          primary_platform?: string;
          audience_size?: number;
          engagement_rate?: number;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      campaigns: {
        Row: {
          id: string;
          brand_id: string;
          title: string;
          slug: string;
          description: string;
          requirements: string | null;
          budget: number;
          commission_rate: number;
          commission_type: "percentage" | "fixed";
          return_window_days: number;
          status: CampaignStatus;
          starts_at: string | null;
          ends_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          brand_id: string;
          title: string;
          slug: string;
          description: string;
          requirements?: string | null;
          budget?: number;
          commission_rate: number;
          commission_type?: "percentage" | "fixed";
          return_window_days?: number;
          status?: CampaignStatus;
          starts_at?: string | null;
          ends_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          brand_id?: string;
          title?: string;
          slug?: string;
          description?: string;
          requirements?: string | null;
          budget?: number;
          commission_rate?: number;
          commission_type?: "percentage" | "fixed";
          return_window_days?: number;
          status?: CampaignStatus;
          starts_at?: string | null;
          ends_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      campaign_applications: {
        Row: {
          id: string;
          campaign_id: string;
          creator_id: string;
          status: ApplicationStatus;
          pitch: string | null;
          applied_at: string;
          reviewed_at: string | null;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          creator_id: string;
          status?: ApplicationStatus;
          pitch?: string | null;
          applied_at?: string;
          reviewed_at?: string | null;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          creator_id?: string;
          status?: ApplicationStatus;
          pitch?: string | null;
          applied_at?: string;
          reviewed_at?: string | null;
        };
      };
      products: {
        Row: {
          id: string;
          brand_id: string;
          title: string;
          description: string | null;
          sku: string | null;
          price: number;
          return_period_days: number;
          url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          brand_id: string;
          title: string;
          description?: string | null;
          sku?: string | null;
          price: number;
          return_period_days?: number;
          url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          brand_id?: string;
          title?: string;
          description?: string | null;
          sku?: string | null;
          price?: number;
          return_period_days?: number;
          url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      referral_links: {
        Row: {
          id: string;
          campaign_id: string;
          creator_id: string;
          code: string;
          tracking_url: string;
          clicks_count: number;
          sales_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          creator_id: string;
          code: string;
          tracking_url: string;
          clicks_count?: number;
          sales_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          creator_id?: string;
          code?: string;
          tracking_url?: string;
          clicks_count?: number;
          sales_count?: number;
          created_at?: string;
        };
      };
      clicks: {
        Row: {
          id: string;
          link_id: string;
          ip_hash: string | null;
          user_agent: string | null;
          referrer: string | null;
          clicked_at: string;
        };
        Insert: {
          id?: string;
          link_id: string;
          ip_hash?: string | null;
          user_agent?: string | null;
          referrer?: string | null;
          clicked_at?: string;
        };
        Update: {
          id?: string;
          link_id?: string;
          ip_hash?: string | null;
          user_agent?: string | null;
          referrer?: string | null;
          clicked_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          link_id: string | null;
          campaign_id: string;
          brand_id: string;
          creator_id: string | null;
          order_number: string;
          order_amount: number;
          commission_amount: number;
          status: OrderStatus;
          delivered_at: string | null;
          return_cleared_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          link_id?: string | null;
          campaign_id: string;
          brand_id: string;
          creator_id?: string | null;
          order_number: string;
          order_amount: number;
          commission_amount: number;
          status?: OrderStatus;
          delivered_at?: string | null;
          return_cleared_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          link_id?: string | null;
          campaign_id?: string;
          brand_id?: string;
          creator_id?: string | null;
          order_number?: string;
          order_amount?: number;
          commission_amount?: number;
          status?: OrderStatus;
          delivered_at?: string | null;
          return_cleared_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      rewards: {
        Row: {
          id: string;
          order_id: string;
          creator_id: string;
          amount: number;
          status: RewardStatus;
          eligible_at: string | null;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          creator_id: string;
          amount: number;
          status?: RewardStatus;
          eligible_at?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          creator_id?: string;
          amount?: number;
          status?: RewardStatus;
          eligible_at?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          type: TransactionType;
          reference_id: string | null;
          status: TransactionStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          type: TransactionType;
          reference_id?: string | null;
          status?: TransactionStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          type?: TransactionType;
          reference_id?: string | null;
          status?: TransactionStatus;
          created_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string;
          metadata: Json | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          entity_type: string;
          entity_id: string;
          metadata?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string;
          metadata?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
      };
      risk_flags: {
        Row: {
          id: string;
          entity_type: string;
          entity_id: string;
          severity: RiskSeverity;
          reason: string;
          resolved: boolean;
          created_at: string;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          entity_type: string;
          entity_id: string;
          severity?: RiskSeverity;
          reason: string;
          resolved?: boolean;
          created_at?: string;
          resolved_at?: string | null;
        };
        Update: {
          id?: string;
          entity_type?: string;
          entity_id?: string;
          severity?: RiskSeverity;
          reason?: string;
          resolved?: boolean;
          created_at?: string;
          resolved_at?: string | null;
        };
      };
    };
  };
}
