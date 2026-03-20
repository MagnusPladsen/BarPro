export type BookingStatus = "pending" | "offer_sent" | "confirmed" | "cancelled" | "completed";
export type PackageType = "basis" | "premium" | "eksklusiv";
export type EventType = "wedding" | "corporate" | "private" | "other";
export type MessageStatus = "unread" | "read" | "replied";
export type OfferStatus = "draft" | "sent" | "accepted" | "declined" | "expired";
export type AgreementStatus = "active" | "completed" | "cancelled";

export interface Database {
  public: {
    Tables: {
      blocked_dates: {
        Row: {
          id: string;
          date: string;
          reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          reason?: string | null;
        };
        Update: {
          date?: string;
          reason?: string | null;
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          id: string;
          date: string;
          status: BookingStatus;
          package: PackageType;
          guest_count: string;
          event_type: EventType;
          customer_name: string;
          customer_email: string;
          customer_phone: string | null;
          wants_callback: boolean;
          message: string | null;
          admin_notes: string | null;
          google_event_id: string | null;
          start_time: string | null;
          end_time: string | null;
          estimated_hours: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          status?: BookingStatus;
          package: PackageType;
          guest_count: string;
          event_type: EventType;
          customer_name: string;
          customer_email: string;
          customer_phone?: string | null;
          wants_callback?: boolean;
          message?: string | null;
          admin_notes?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          estimated_hours?: number | null;
        };
        Update: {
          date?: string;
          status?: BookingStatus;
          package?: PackageType;
          guest_count?: string;
          event_type?: EventType;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string | null;
          wants_callback?: boolean;
          message?: string | null;
          admin_notes?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          estimated_hours?: number | null;
        };
        Relationships: [];
      };
      employees: {
        Row: {
          id: string;
          auth_user_id: string | null;
          name: string;
          email: string;
          phone: string | null;
          role: string;
          photo_url: string | null;
          hourly_rate: number;
          is_owner: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_user_id?: string | null;
          name: string;
          email: string;
          phone?: string | null;
          role?: string;
          photo_url?: string | null;
          hourly_rate?: number;
          is_owner?: boolean;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          email?: string;
          phone?: string | null;
          role?: string;
          photo_url?: string | null;
          hourly_rate?: number;
          is_owner?: boolean;
          is_active?: boolean;
        };
        Relationships: [];
      };
      booking_assignments: {
        Row: {
          id: string;
          booking_id: string;
          employee_id: string;
          hours_worked: number | null;
          extra_pay: number;
          approved: boolean;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          employee_id: string;
          hours_worked?: number | null;
          extra_pay?: number;
          approved?: boolean;
          notes?: string | null;
        };
        Update: {
          hours_worked?: number | null;
          extra_pay?: number;
          approved?: boolean;
          notes?: string | null;
        };
        Relationships: [];
      };
      booking_costs: {
        Row: {
          id: string;
          booking_id: string;
          description: string;
          amount: number;
          is_billable: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          description: string;
          amount: number;
          is_billable?: boolean;
        };
        Update: {
          description?: string;
          amount?: number;
          is_billable?: boolean;
        };
        Relationships: [];
      };
      offers: {
        Row: {
          id: string;
          booking_id: string;
          estimated_cost: number;
          offered_price: number;
          markup_percent: number | null;
          status: OfferStatus;
          notes: string | null;
          sent_at: string | null;
          responded_at: string | null;
          rejection_reason: string | null;
          wants_new_offer: boolean;
          customer_token: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          estimated_cost: number;
          offered_price: number;
          markup_percent?: number | null;
          status?: OfferStatus;
          notes?: string | null;
          sent_at?: string | null;
          rejection_reason?: string | null;
          wants_new_offer?: boolean;
        };
        Update: {
          estimated_cost?: number;
          offered_price?: number;
          markup_percent?: number | null;
          status?: OfferStatus;
          notes?: string | null;
          sent_at?: string | null;
          responded_at?: string | null;
          rejection_reason?: string | null;
          wants_new_offer?: boolean;
        };
        Relationships: [];
      };
      agreements: {
        Row: {
          id: string;
          booking_id: string;
          offer_id: string | null;
          final_price: number;
          status: AgreementStatus;
          notes: string | null;
          signed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          offer_id?: string | null;
          final_price: number;
          status?: AgreementStatus;
          notes?: string | null;
          signed_at?: string | null;
        };
        Update: {
          final_price?: number;
          status?: AgreementStatus;
          notes?: string | null;
          signed_at?: string | null;
        };
        Relationships: [];
      };
      chat_messages: {
        Row: {
          id: string;
          booking_id: string;
          sender_type: "customer" | "admin";
          sender_name: string;
          message: string;
          message_type: "text" | "offer" | "agreement" | "system";
          reference_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          sender_type: "customer" | "admin";
          sender_name: string;
          message: string;
          message_type?: "text" | "offer" | "agreement" | "system";
          reference_id?: string | null;
        };
        Update: {
          message?: string;
        };
        Relationships: [];
      };
      time_entries: {
        Row: {
          id: string;
          employee_id: string;
          booking_id: string | null;
          date: string;
          hours: number;
          start_time: string | null;
          end_time: string | null;
          description: string | null;
          status: "pending" | "approved" | "rejected";
          approved_by: string | null;
          approved_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          booking_id?: string | null;
          date: string;
          hours: number;
          start_time?: string | null;
          end_time?: string | null;
          description?: string | null;
          status?: "pending" | "approved" | "rejected";
        };
        Update: {
          hours?: number;
          start_time?: string | null;
          end_time?: string | null;
          description?: string | null;
          status?: "pending" | "approved" | "rejected";
          approved_by?: string | null;
          approved_at?: string | null;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          event_type: string | null;
          guests: string | null;
          date: string | null;
          message: string;
          status: MessageStatus;
          admin_notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          event_type?: string | null;
          guests?: string | null;
          date?: string | null;
          message: string;
          status?: MessageStatus;
        };
        Update: {
          status?: MessageStatus;
          admin_notes?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      booking_status: BookingStatus;
      package_type: PackageType;
      event_type: EventType;
      message_status: MessageStatus;
      offer_status: OfferStatus;
      agreement_status: AgreementStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
