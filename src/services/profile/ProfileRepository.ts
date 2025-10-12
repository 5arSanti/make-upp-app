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
      .select("*")
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
    const { data: result, error } = await supabase
      .from(this.tableName)
      .upsert(data)
      .select()
      .single();

    if (error) {
      throw new Error(`Error upserting profile: ${error.message}`);
    }

    return result;
  }
}
