export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = "brand" | "creator" | "admin";
export type CampaignStatus = "draft" | "active" | "paused" | "completed" | "archived" | "cancelled";
export type ApplicationStatus =
  "pending" | "under_review" | "approved" | "rejected" | "withdrawn" | "completed";
export type CollaborationStatus =
  | "accepted"
  | "onboarding"
  | "active"
  | "content_pending"
  | "content_submitted"
  | "revision_requested"
  | "approved"
  | "completed"
  | "cancelled";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "delivered"
  | "return_cleared"
  | "refunded"
  | "partially_refunded"
  | "cancelled";
export type RewardStatus =
  "pending" | "approved" | "eligible" | "payable" | "paid" | "forfeited" | "cancelled" | "disputed";
export type TransactionType = "credit" | "debit" | "payout" | "adjustment" | "reversal";
export type TransactionStatus = "pending" | "completed" | "failed" | "cancelled";
export type RiskSeverity = "low" | "medium" | "high" | "critical";
export type CompensationModel = "fixed" | "commission" | "hybrid" | "gifting";
export type CampaignObjective =
  "sales" | "awareness" | "traffic" | "promotion" | "leads" | "community";
export type CampaignType = "performance" | "affiliate" | "sponsored" | "gifting" | "paid_collab";

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
          onboarding_completed: boolean;
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
          onboarding_completed?: boolean;
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
          onboarding_completed?: boolean;
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
          logo_url: string | null;
          company_size: string | null;
          location: string | null;
          country: string | null;
          social_links: Record<string, string>;
          business_contact: Record<string, string>;
          onboarding_completed: boolean;
          onboarding_step: number;
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
          logo_url?: string | null;
          company_size?: string | null;
          location?: string | null;
          country?: string | null;
          social_links?: Record<string, string>;
          business_contact?: Record<string, string>;
          onboarding_completed?: boolean;
          onboarding_step?: number;
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
          logo_url?: string | null;
          company_size?: string | null;
          location?: string | null;
          country?: string | null;
          social_links?: Record<string, string>;
          business_contact?: Record<string, string>;
          onboarding_completed?: boolean;
          onboarding_step?: number;
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
          display_name: string | null;
          profile_photo_url: string | null;
          primary_niche: string;
          categories: string[];
          bio: string | null;
          location: string | null;
          primary_platform: string;
          platforms: Record<string, unknown>;
          portfolio_items: Array<{ title: string; url: string; description?: string }>;
          collaboration_preferences: Record<string, unknown>;
          languages: string[];
          audience_size: number;
          engagement_rate: number;
          onboarding_completed: boolean;
          onboarding_step: number;
          verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          handle: string;
          display_name?: string | null;
          profile_photo_url?: string | null;
          primary_niche: string;
          categories?: string[];
          bio?: string | null;
          location?: string | null;
          primary_platform: string;
          platforms?: Record<string, unknown>;
          portfolio_items?: Array<{ title: string; url: string; description?: string }>;
          collaboration_preferences?: Record<string, unknown>;
          languages?: string[];
          audience_size?: number;
          engagement_rate?: number;
          onboarding_completed?: boolean;
          onboarding_step?: number;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          handle?: string;
          display_name?: string | null;
          profile_photo_url?: string | null;
          primary_niche?: string;
          categories?: string[];
          bio?: string | null;
          location?: string | null;
          primary_platform?: string;
          platforms?: Record<string, unknown>;
          portfolio_items?: Array<{ title: string; url: string; description?: string }>;
          collaboration_preferences?: Record<string, unknown>;
          languages?: string[];
          audience_size?: number;
          engagement_rate?: number;
          onboarding_completed?: boolean;
          onboarding_step?: number;
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
          objective: string;
          campaign_type: string;
          category: string;
          cover_image_url: string | null;
          target_platforms: string[];
          min_followers: number;
          max_followers: number | null;
          required_deliverables: string[];
          deliverable_guidelines: string | null;
          application_deadline: string | null;
          content_deadline: string | null;
          product_id: string | null;
          requirements: string | null;
          budget: number;
          allocated_budget: number;
          remaining_budget: number;
          compensation_model: CompensationModel;
          fixed_amount: number;
          commission_rate: number;
          commission_type: "percentage" | "fixed";
          return_window_days: number;
          status: CampaignStatus;
          starts_at: string | null;
          ends_at: string | null;
          terms_and_conditions: string | null;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          brand_id: string;
          title: string;
          slug: string;
          description: string;
          objective?: string;
          campaign_type?: string;
          category?: string;
          cover_image_url?: string | null;
          target_platforms?: string[];
          min_followers?: number;
          max_followers?: number | null;
          required_deliverables?: string[];
          deliverable_guidelines?: string | null;
          application_deadline?: string | null;
          content_deadline?: string | null;
          product_id?: string | null;
          requirements?: string | null;
          budget?: number;
          allocated_budget?: number;
          remaining_budget?: number;
          compensation_model?: CompensationModel;
          fixed_amount?: number;
          commission_rate: number;
          commission_type?: "percentage" | "fixed";
          return_window_days?: number;
          status?: CampaignStatus;
          starts_at?: string | null;
          ends_at?: string | null;
          terms_and_conditions?: string | null;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          brand_id?: string;
          title?: string;
          slug?: string;
          description?: string;
          objective?: string;
          campaign_type?: string;
          category?: string;
          cover_image_url?: string | null;
          target_platforms?: string[];
          min_followers?: number;
          max_followers?: number | null;
          required_deliverables?: string[];
          deliverable_guidelines?: string | null;
          application_deadline?: string | null;
          content_deadline?: string | null;
          product_id?: string | null;
          requirements?: string | null;
          budget?: number;
          allocated_budget?: number;
          remaining_budget?: number;
          compensation_model?: CompensationModel;
          fixed_amount?: number;
          commission_rate?: number;
          commission_type?: "percentage" | "fixed";
          return_window_days?: number;
          status?: CampaignStatus;
          starts_at?: string | null;
          ends_at?: string | null;
          terms_and_conditions?: string | null;
          tags?: string[];
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
          proposed_content_plan: string | null;
          portfolio_links: string[];
          social_links: Record<string, string>;
          reviewed_by: string | null;
          review_notes: string | null;
          applied_at: string;
          reviewed_at: string | null;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          creator_id: string;
          status?: ApplicationStatus;
          pitch?: string | null;
          proposed_content_plan?: string | null;
          portfolio_links?: string[];
          social_links?: Record<string, string>;
          reviewed_by?: string | null;
          review_notes?: string | null;
          applied_at?: string;
          reviewed_at?: string | null;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          creator_id?: string;
          status?: ApplicationStatus;
          pitch?: string | null;
          proposed_content_plan?: string | null;
          portfolio_links?: string[];
          social_links?: Record<string, string>;
          reviewed_by?: string | null;
          review_notes?: string | null;
          applied_at?: string;
          reviewed_at?: string | null;
        };
      };
      collaborations: {
        Row: {
          id: string;
          campaign_id: string;
          brand_id: string;
          creator_id: string;
          application_id: string | null;
          status: CollaborationStatus;
          deliverables_status: Record<string, unknown>;
          content_url: string | null;
          content_caption: string | null;
          content_platform: string | null;
          submission_notes: string | null;
          revision_feedback: string | null;
          submitted_at: string | null;
          approved_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          brand_id: string;
          creator_id: string;
          application_id?: string | null;
          status?: CollaborationStatus;
          deliverables_status?: Record<string, unknown>;
          content_url?: string | null;
          content_caption?: string | null;
          content_platform?: string | null;
          submission_notes?: string | null;
          revision_feedback?: string | null;
          submitted_at?: string | null;
          approved_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          brand_id?: string;
          creator_id?: string;
          application_id?: string | null;
          status?: CollaborationStatus;
          deliverables_status?: Record<string, unknown>;
          content_url?: string | null;
          content_caption?: string | null;
          content_platform?: string | null;
          submission_notes?: string | null;
          revision_feedback?: string | null;
          submitted_at?: string | null;
          approved_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
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
          collaboration_id: string | null;
          code: string;
          tracking_url: string;
          destination_url: string;
          is_active: boolean;
          clicks_count: number;
          sales_count: number;
          revenue_generated: number;
          commissions_earned: number;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          creator_id: string;
          collaboration_id?: string | null;
          code: string;
          tracking_url: string;
          destination_url?: string;
          is_active?: boolean;
          clicks_count?: number;
          sales_count?: number;
          revenue_generated?: number;
          commissions_earned?: number;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          creator_id?: string;
          collaboration_id?: string | null;
          code?: string;
          tracking_url?: string;
          destination_url?: string;
          is_active?: boolean;
          clicks_count?: number;
          sales_count?: number;
          revenue_generated?: number;
          commissions_earned?: number;
          expires_at?: string | null;
          created_at?: string;
        };
      };
      clicks: {
        Row: {
          id: string;
          link_id: string;
          campaign_id: string | null;
          creator_id: string | null;
          device_category: string | null;
          browser: string | null;
          country: string | null;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          is_bot: boolean;
          visitor_id: string | null;
          ip_hash: string | null;
          user_agent: string | null;
          referrer: string | null;
          clicked_at: string;
        };
        Insert: {
          id?: string;
          link_id: string;
          campaign_id?: string | null;
          creator_id?: string | null;
          device_category?: string | null;
          browser?: string | null;
          country?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          is_bot?: boolean;
          visitor_id?: string | null;
          ip_hash?: string | null;
          user_agent?: string | null;
          referrer?: string | null;
          clicked_at?: string;
        };
        Update: {
          id?: string;
          link_id?: string;
          campaign_id?: string | null;
          creator_id?: string | null;
          device_category?: string | null;
          browser?: string | null;
          country?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          is_bot?: boolean;
          visitor_id?: string | null;
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
          currency: string;
          customer_email_hash: string | null;
          click_id: string | null;
          attribution_model: string;
          attributed_at: string;
          refunded_amount: number;
          notes: string | null;
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
          commission_amount?: number;
          currency?: string;
          customer_email_hash?: string | null;
          click_id?: string | null;
          attribution_model?: string;
          attributed_at?: string;
          refunded_amount?: number;
          notes?: string | null;
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
          currency?: string;
          customer_email_hash?: string | null;
          click_id?: string | null;
          attribution_model?: string;
          attributed_at?: string;
          refunded_amount?: number;
          notes?: string | null;
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
          campaign_id: string;
          brand_id: string;
          amount: number;
          currency: string;
          reward_type: string;
          status: RewardStatus;
          disputed_reason: string | null;
          eligible_at: string | null;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          creator_id: string;
          campaign_id: string;
          brand_id: string;
          amount: number;
          currency?: string;
          reward_type?: string;
          status?: RewardStatus;
          disputed_reason?: string | null;
          eligible_at?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          creator_id?: string;
          campaign_id?: string;
          brand_id?: string;
          amount?: number;
          currency?: string;
          reward_type?: string;
          status?: RewardStatus;
          disputed_reason?: string | null;
          eligible_at?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          action_url: string | null;
          is_read: boolean;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          action_url?: string | null;
          is_read?: boolean;
          metadata?: Record<string, unknown>;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          message?: string;
          action_url?: string | null;
          is_read?: boolean;
          metadata?: Record<string, unknown>;
          created_at?: string;
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
