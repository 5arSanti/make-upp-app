import { ProductService } from "./ProductService";
import { Product, CreateProductDto, UpdateProductDto } from "./types";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  async findById(id: number): Promise<Product | null> {
    return await this.productService.findById(id);
  }

  async findAll(): Promise<Product[]> {
    return await this.productService.findAll();
  }

  async create(data: CreateProductDto): Promise<Product> {
    return await this.productService.create(data);
  }

  async update(id: number, data: UpdateProductDto): Promise<Product> {
    return await this.productService.update(id, data);
  }

  async delete(id: number): Promise<void> {
    return await this.productService.delete(id);
  }

  async createProductWithImage(
    productData: CreateProductDto,
    imageFile?: File
  ): Promise<Product> {
    return await this.productService.createProductWithImage(productData, imageFile);
  }

  async updateProductWithImage(
    id: number,
    productData: UpdateProductDto,
    imageFile?: File
  ): Promise<Product> {
    return await this.productService.updateProductWithImage(id, productData, imageFile);
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return await this.productService.getProductsByCategory(categoryId);
  }

  async getAvailableProducts(): Promise<Product[]> {
    return await this.productService.getAvailableProducts();
  }

  async searchProducts(searchTerm: string): Promise<Product[]> {
    return await this.productService.searchProducts(searchTerm);
  }

  async deleteProduct(id: number): Promise<void> {
    return await this.productService.deleteProduct(id);
  }
}
