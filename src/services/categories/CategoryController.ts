import { BaseControllerImpl } from "../base/BaseController";
import { Category } from "./types";
import { CategoryService } from "./CategoryService";
import { CategoryRepository } from "./CategoryRepository";

export class CategoryController extends BaseControllerImpl<Category> {
  protected service: CategoryService;

  constructor() {
    const repository = new CategoryRepository();
    const service = new CategoryService(repository);
    super(service);
    this.service = service;
  }

  async getCategoryByName(name: string): Promise<Category | null> {
    return this.service.getCategoryByName(name);
  }

  async getAllCategories(): Promise<Category[]> {
    return this.service.getAllCategories();
  }

  async getCategoryById(id: number): Promise<Category | null> {
    return this.service.getCategoryById(id);
  }
}
