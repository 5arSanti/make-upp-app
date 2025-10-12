import { BaseService } from "./interfaces";
import { BaseRepository } from "./interfaces";

export abstract class BaseServiceImpl<T> implements BaseService<T> {
  protected repository: BaseRepository<T>;

  constructor(repository: BaseRepository<T>) {
    this.repository = repository;
  }

  async getById(id: string): Promise<T | null> {
    try {
      return await this.repository.findById(id);
    } catch (error) {
      console.error(`Error getting ${this.constructor.name} by id:`, error);
      throw error;
    }
  }

  async getAll(): Promise<T[]> {
    try {
      return await this.repository.findAll();
    } catch (error) {
      console.error(`Error getting all ${this.constructor.name}:`, error);
      throw error;
    }
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      return await this.repository.create(data);
    } catch (error) {
      console.error(`Error creating ${this.constructor.name}:`, error);
      throw error;
    }
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    try {
      return await this.repository.update(id, data);
    } catch (error) {
      console.error(`Error updating ${this.constructor.name}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (error) {
      console.error(`Error deleting ${this.constructor.name}:`, error);
      throw error;
    }
  }
}
