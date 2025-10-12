import { BaseServiceImpl } from "../base/BaseService";
import { Role } from "./types";
import { RoleRepository } from "./RoleRepository";

export class RoleService extends BaseServiceImpl<Role> {
  protected repository: RoleRepository;

  constructor(repository: RoleRepository) {
    super(repository);
    this.repository = repository;
  }

  async getRoleByName(name: string): Promise<Role | null> {
    return this.repository.findByName(name);
  }

  async getAllRoles(): Promise<Role[]> {
    return this.repository.getAllRoles();
  }

  async getRoleById(id: number): Promise<Role | null> {
    return this.repository.findById(id.toString());
  }
}
