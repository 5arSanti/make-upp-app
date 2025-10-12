import { supabase } from "../../config/supabase-client";
import { BaseRepositoryImpl } from "../base/BaseRepository";
import { Category } from "./types";

export class CategoryRepository extends BaseRepositoryImpl<Category> {
  constructor() {
    super("categories");
  }

  async findByName(name: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("name", name)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data as Category | null;
  }

  async getAllCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .order("name");
    if (error) throw error;
    return data as Category[];
  }
}
