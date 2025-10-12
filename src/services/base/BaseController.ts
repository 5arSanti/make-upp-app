import { BaseController } from "./interfaces";
import { BaseService } from "./interfaces";

export abstract class BaseControllerImpl<T> implements BaseController<T> {
  protected service: BaseService<T>;

  constructor(service: BaseService<T>) {
    this.service = service;
  }

  async getById(id: string): Promise<T | null> {
    try {
      return await this.service.getById(id);
    } catch (error) {
      console.error(`Controller error getting by id:`, error);
      throw error;
    }
  }

  async getAll(): Promise<T[]> {
    try {
      return await this.service.getAll();
    } catch (error) {
      console.error(`Controller error getting all:`, error);
      throw error;
    }
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      return await this.service.create(data);
    } catch (error) {
      console.error(`Controller error creating:`, error);
      throw error;
    }
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    try {
      return await this.service.update(id, data);
    } catch (error) {
      console.error(`Controller error updating:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.service.delete(id);
    } catch (error) {
      console.error(`Controller error deleting:`, error);
      throw error;
    }
  }
}
