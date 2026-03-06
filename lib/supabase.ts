import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type MonitoringSession = {
  id: string;
  email: string;
  name: string;
  phone: string;
  country_code: string;
  country_iso?: string;
  continents: string[];
  adults: number;
  children: number;
  days: string[];
  budget: string;
  airlines: string[];
  status: "pending_payment" | "active" | "cancelled";
  expires_at: string | null;
  stripe_session_id: string | null;
  created_at: string;
  updated_at: string;
};
