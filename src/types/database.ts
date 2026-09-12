// Ручная копия типов под supabase/migrations/*.sql (0001-0003).
// Заменить на `supabase gen types typescript --schema delivery`,
// когда появится supabase CLI под рукой — структура совпадает 1:1.

export type UserRole = "sender" | "carrier";
export type RequestStatus =
  | "open"
  | "matched"
  | "in_transit"
  | "delivered"
  | "cancelled";
export type TripStatus = "open" | "matched" | "completed" | "cancelled";
export type MatchStatus =
  | "pending"
  | "confirmed"
  | "in_transit"
  | "delivered"
  | "cancelled";

export interface Database {
  delivery: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          name: string | null;
          avatar_url: string | null;
          bio: string | null;
          contact: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          role: UserRole;
          name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          contact?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["delivery"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      requests: {
        Row: {
          id: string;
          sender_id: string;
          from_city: string;
          to_city: string;
          weight_kg: number | null;
          length_cm: number | null;
          width_cm: number | null;
          height_cm: number | null;
          ready_date: string | null;
          deadline_date: string | null;
          description: string | null;
          status: RequestStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          from_city: string;
          to_city: string;
          weight_kg?: number | null;
          length_cm?: number | null;
          width_cm?: number | null;
          height_cm?: number | null;
          ready_date?: string | null;
          deadline_date?: string | null;
          description?: string | null;
          status?: RequestStatus;
          created_at?: string;
        };
        Update: Partial<Database["delivery"]["Tables"]["requests"]["Insert"]>;
        Relationships: [];
      };
      trips: {
        Row: {
          id: string;
          carrier_id: string;
          from_city: string;
          to_city: string;
          departure_date: string;
          capacity_kg: number | null;
          capacity_note: string | null;
          status: TripStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          carrier_id: string;
          from_city: string;
          to_city: string;
          departure_date: string;
          capacity_kg?: number | null;
          capacity_note?: string | null;
          status?: TripStatus;
          created_at?: string;
        };
        Update: Partial<Database["delivery"]["Tables"]["trips"]["Insert"]>;
        Relationships: [];
      };
      matches: {
        Row: {
          id: string;
          request_id: string;
          trip_id: string;
          status: MatchStatus;
          confirmed_by_sender: boolean;
          confirmed_by_carrier: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          trip_id: string;
          status?: MatchStatus;
          confirmed_by_sender?: boolean;
          confirmed_by_carrier?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["delivery"]["Tables"]["matches"]["Insert"]>;
        Relationships: [];
      };
      ratings: {
        Row: {
          id: string;
          match_id: string;
          rater_id: string;
          ratee_id: string;
          score: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          match_id: string;
          rater_id: string;
          ratee_id: string;
          score: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["delivery"]["Tables"]["ratings"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_counterpart_contact: {
        Args: { p_match_id: string };
        Returns: string | null;
      };
      get_own_contact: {
        Args: Record<PropertyKey, never>;
        Returns: string | null;
      };
    };
    Enums: {
      user_role: UserRole;
      request_status: RequestStatus;
      trip_status: TripStatus;
      match_status: MatchStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
