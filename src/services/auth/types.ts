import { Session } from "@supabase/supabase-js";

// Supabase's Session type has token_type as "bearer", but onAuthStateChange
// sometimes returns a generic string. This type is for compatibility.
export interface AuthSession extends Omit<Session, "token_type"> {
  token_type: string;
}
