import { supabase } from "../../config/supabase-client";
import { BaseRepositoryImpl } from "../base/BaseRepository";
import { Role } from "./types";

export class RoleRepository extends BaseRepositoryImpl<Role> {
  constructor() {
    super("roles");
  }

  async findByName(name: string): Promise<Role | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("name", name)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data as Role | null;
  }

  async getAllRoles(): Promise<Role[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .order("name");
    if (error) throw error;
    return data as Role[];
  }
}
