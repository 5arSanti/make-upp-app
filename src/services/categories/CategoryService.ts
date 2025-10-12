import { BaseServiceImpl } from "../base/BaseService";
import { Category } from "./types";
import { CategoryRepository } from "./CategoryRepository";

export class CategoryService extends BaseServiceImpl<Category> {
  protected repository: CategoryRepository;

  constructor(repository: CategoryRepository) {
    super(repository);
    this.repository = repository;
  }

  async getCategoryByName(name: string): Promise<Category | null> {
    return this.repository.findByName(name);
  }

  async getAllCategories(): Promise<Category[]> {
    return this.repository.getAllCategories();
  }

  async getCategoryById(id: number): Promise<Category | null> {
    return this.repository.findById(id.toString());
  }
}
