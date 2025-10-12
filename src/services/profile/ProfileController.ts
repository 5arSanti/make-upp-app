import { BaseControllerImpl } from "../base/BaseController";
import { ProfileService } from "./ProfileService";
import { Profile, CreateProfileDto, UpdateProfileDto } from "./types";

export class ProfileController extends BaseControllerImpl<Profile> {
  private profileService: ProfileService;

  constructor() {
    const service = new ProfileService();
    super(service);
    this.profileService = service;
  }

  async getProfileByUserId(userId: string): Promise<Profile | null> {
    try {
      return await this.profileService.getProfileByUserId(userId);
    } catch (error) {
      console.error("Controller error getting profile by user id:", error);
      throw error;
    }
  }

  async getProfileByUsername(username: string): Promise<Profile | null> {
    try {
      return await this.profileService.getProfileByUsername(username);
    } catch (error) {
      console.error("Controller error getting profile by username:", error);
      throw error;
    }
  }

  async createProfile(data: CreateProfileDto): Promise<Profile> {
    try {
      return await this.profileService.createProfile(data);
    } catch (error) {
      console.error("Controller error creating profile:", error);
      throw error;
    }
  }

  async updateProfile(userId: string, data: UpdateProfileDto): Promise<Profile> {
    try {
      return await this.profileService.updateProfile(userId, data);
    } catch (error) {
      console.error("Controller error updating profile:", error);
      throw error;
    }
  }

  async checkProfileExists(userId: string): Promise<boolean> {
    try {
      return await this.profileService.checkProfileExists(userId);
    } catch (error) {
      console.error("Controller error checking profile existence:", error);
      throw error;
    }
  }
}
