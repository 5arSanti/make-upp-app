import { supabase } from "../../config/supabase-client";
import { Product, CreateProductDto, UpdateProductDto } from "./types";

export class ProductRepository {
  private tableName = "products";

  async findById(id: number): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(`Error finding product by id: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("Error finding product by id:", error);
      throw error;
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`Error finding all products: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error("Error finding all products:", error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq("id", id);

      if (error) {
        throw new Error(`Error deleting product: ${error.message}`);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }

  async create(data: CreateProductDto): Promise<Product> {
    try {
      const { data: product, error } = await supabase
        .from(this.tableName)
        .insert(data)
        .select()
        .single();

      if (error) {
        throw new Error(`Error creating product: ${error.message}`);
      }

      return product;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  async update(id: number, data: UpdateProductDto): Promise<Product> {
    try {
      const { data: product, error } = await supabase
        .from(this.tableName)
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(`Error updating product: ${error.message}`);
      }

      return product;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    try {
      const { data: products, error } = await supabase
        .from(this.tableName)
        .select("*")
        .eq("category_id", categoryId)
        .eq("available", true)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`Error getting products by category: ${error.message}`);
      }

      return products || [];
    } catch (error) {
      console.error("Error getting products by category:", error);
      throw error;
    }
  }

  async getAvailableProducts(): Promise<Product[]> {
    try {
      const { data: products, error } = await supabase
        .from(this.tableName)
        .select("*")
        .eq("available", true)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`Error getting available products: ${error.message}`);
      }

      return products || [];
    } catch (error) {
      console.error("Error getting available products:", error);
      throw error;
    }
  }

  async searchProducts(searchTerm: string): Promise<Product[]> {
    try {
      const { data: products, error } = await supabase
        .from(this.tableName)
        .select("*")
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .eq("available", true)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`Error searching products: ${error.message}`);
      }

      return products || [];
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  }
}
