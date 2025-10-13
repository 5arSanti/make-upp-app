import { ProductRepository } from "./ProductRepository";
import { Product, CreateProductDto, UpdateProductDto } from "./types";
import { StorageService } from "../storage/StorageService";

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async findById(id: number): Promise<Product | null> {
    return await this.productRepository.findById(id);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }

  async create(data: CreateProductDto): Promise<Product> {
    return await this.productRepository.create(data);
  }

  async update(id: number, data: UpdateProductDto): Promise<Product> {
    return await this.productRepository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    return await this.productRepository.delete(id);
  }

  async createProductWithImage(
    productData: CreateProductDto,
    imageFile?: File
  ): Promise<Product> {
    try {
      let imageUrl: string | undefined;

      // Upload image if provided
      if (imageFile) {
        const storageService = new StorageService();
        const uploadResult = await storageService.uploadImage(imageFile);
        imageUrl = uploadResult.url;
      }

      // Create product with image URL
      const productWithImage = {
        ...productData,
        image_url: imageUrl,
      };

      return await this.productRepository.create(productWithImage);
    } catch (error) {
      console.error("Error creating product with image:", error);
      throw error;
    }
  }

  async updateProductWithImage(
    id: number,
    productData: UpdateProductDto,
    imageFile?: File
  ): Promise<Product> {
    try {
      let imageUrl: string | undefined;

      // Upload new image if provided
      if (imageFile) {
        const storageService = new StorageService();
        const uploadResult = await storageService.uploadImage(imageFile);
        imageUrl = uploadResult.url;
      }

      // Update product with new image URL
      const productWithImage = {
        ...productData,
        ...(imageUrl && { image_url: imageUrl }),
      };

      return await this.productRepository.update(id, productWithImage);
    } catch (error) {
      console.error("Error updating product with image:", error);
      throw error;
    }
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return await this.productRepository.getProductsByCategory(categoryId);
  }

  async getAvailableProducts(): Promise<Product[]> {
    return await this.productRepository.getAvailableProducts();
  }

  async searchProducts(searchTerm: string): Promise<Product[]> {
    return await this.productRepository.searchProducts(searchTerm);
  }

  async deleteProduct(id: number): Promise<void> {
    try {
      // Get product to delete image if exists
      const product = await this.productRepository.findById(id);
      
      if (product?.image_url) {
        const storageService = new StorageService();
        // Extract path from URL for deletion
        const imagePath = product.image_url.split('/').pop();
        if (imagePath) {
          await storageService.deleteImage(imagePath);
        }
      }

      // Delete product
      await this.productRepository.delete(id);
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }
}
