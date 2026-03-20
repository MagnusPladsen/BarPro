export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type PackageType = "basis" | "premium" | "eksklusiv";
export type EventType = "wedding" | "corporate" | "private" | "other";
export type MessageStatus = "unread" | "read" | "replied";

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
          created_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          reason?: string | null;
          created_at?: string;
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
          google_event_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
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
          google_event_id?: string | null;
          created_at?: string;
          updated_at?: string;
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
          admin_notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          event_type?: string | null;
          guests?: string | null;
          date?: string | null;
          message?: string;
          status?: MessageStatus;
          admin_notes?: string | null;
          created_at?: string;
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
    };
    CompositeTypes: Record<string, never>;
  };
}
