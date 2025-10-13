import { BaseRepositoryImpl } from "../base/BaseRepository";
import { Profile } from "./types";
import { supabase } from "../../config/supabase-client";

export class ProfileRepository extends BaseRepositoryImpl<Profile> {
  constructor() {
    super("profiles");
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(
        `
        *,
        role:roles(name, description)
      `
      )
      .eq("id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error(`Error finding profile by user id: ${error.message}`);
    }

    return data || null;
  }

  async findByUsername(username: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("username", username)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error(`Error finding profile by username: ${error.message}`);
    }

    return data || null;
  }

  async upsert(data: Partial<Profile>): Promise<Profile> {
    // Use maybeSingle to avoid PGRST116 when zero rows are returned
    const { data: result, error } = await supabase
      .from(this.tableName)
      .upsert(data)
      .select()
      .maybeSingle();

    if (error) {
      throw new Error(`Error upserting profile: ${error.message}`);
    }

    if (result) return result as Profile;

    // As a fallback (e.g., return=minimal due to RLS), fetch the row by id
    if (data.id) {
      const { data: fetched, error: fetchError } = await supabase
        .from(this.tableName)
        .select("*")
        .eq("id", data.id as string)
        .maybeSingle();
      if (fetchError) {
        throw new Error(
          `Error fetching upserted profile: ${fetchError.message}`
        );
      }
      if (fetched) return fetched as Profile;
    }

    throw new Error("Error upserting profile: empty result");
  }
}
