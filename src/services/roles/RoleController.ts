import { BaseControllerImpl } from "../base/BaseController";
import { Role } from "./types";
import { RoleService } from "./RoleService";
import { RoleRepository } from "./RoleRepository";

export class RoleController extends BaseControllerImpl<Role> {
  protected service: RoleService;

  constructor() {
    const repository = new RoleRepository();
    const service = new RoleService(repository);
    super(service);
    this.service = service;
  }

  async getRoleByName(name: string): Promise<Role | null> {
    return this.service.getRoleByName(name);
  }

  async getAllRoles(): Promise<Role[]> {
    return this.service.getAllRoles();
  }

  async getRoleById(id: number): Promise<Role | null> {
    return this.service.getRoleById(id);
  }
}
