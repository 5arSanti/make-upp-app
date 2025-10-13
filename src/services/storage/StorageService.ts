import { supabase } from "../../config/supabase-client";

export interface UploadResult {
  path: string;
  url: string;
}

export class StorageService {
  private bucketName = "product-images";

  async uploadImage(file: File, fileName?: string): Promise<UploadResult> {
    try {
      // Generate unique filename if not provided
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = file.name.split('.').pop();
      const finalFileName = fileName || `product_${timestamp}_${randomString}.${fileExtension}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(finalFileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw new Error(`Error uploading image: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(finalFileName);

      return {
        path: data.path,
        url: urlData.publicUrl
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }

  async deleteImage(imagePath: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([imagePath]);

      if (error) {
        throw new Error(`Error deleting image: ${error.message}`);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  }

  async getImageUrl(imagePath: string): Promise<string> {
    try {
      const { data } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(imagePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Error getting image URL:", error);
      throw error;
    }
  }
}
