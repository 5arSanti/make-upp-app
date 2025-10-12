import { createClient } from "@supabase/supabase-js";

// Function to get environment variables that works in both browser and Node.js
function getEnvVar(key: string): string {
  // In Node.js environment (for scripts)
  if (typeof process !== "undefined" && process.env) {
    return process.env[key] || "";
  }
  
  // In browser environment (for Vite)
  if (typeof import.meta !== "undefined" && import.meta.env) {
    return import.meta.env[key] || "";
  }
  
  return "";
}

const supabaseUrl = getEnvVar("VITE_SUPABASE_URL");
const supabasePublishableKey = getEnvVar("VITE_SUPABASE_PUBLISHABLE_KEY");

if (!supabaseUrl || !supabasePublishableKey) {
  console.error("❌ Missing Supabase environment variables!");
  console.error("Please check your .env file contains:");
  console.error("VITE_SUPABASE_URL=your_supabase_url");
  console.error("VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key");
  console.error("");
  console.error("Current environment variables:");
  console.error("VITE_SUPABASE_URL:", supabaseUrl ? "✅ Found" : "❌ Missing");
  console.error("VITE_SUPABASE_PUBLISHABLE_KEY:", supabasePublishableKey ? "✅ Found" : "❌ Missing");
  process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey);