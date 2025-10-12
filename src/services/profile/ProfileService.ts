import { BaseServiceImpl } from "../base/BaseService";
import { ProfileRepository } from "./ProfileRepository";
import { Profile, CreateProfileDto, UpdateProfileDto } from "./types";

export class ProfileService extends BaseServiceImpl<Profile> {
  private profileRepository: ProfileRepository;

  constructor() {
    const repository = new ProfileRepository();
    super(repository);
    this.profileRepository = repository;
  }

  async getProfileByUserId(userId: string): Promise<Profile | null> {
    try {
      return await this.profileRepository.findByUserId(userId);
    } catch (error) {
      console.error("Error getting profile by user id:", error);
      throw error;
    }
  }

  async getProfileByUsername(username: string): Promise<Profile | null> {
    try {
      return await this.profileRepository.findByUsername(username);
    } catch (error) {
      console.error("Error getting profile by username:", error);
      throw error;
    }
  }

  async createProfile(data: CreateProfileDto): Promise<Profile> {
    try {
      // Validate username uniqueness
      const existingProfile = await this.getProfileByUsername(data.username);
      if (existingProfile) {
        throw new Error("Username already exists");
      }

      return await this.profileRepository.create(data);
    } catch (error) {
      console.error("Error creating profile:", error);
      throw error;
    }
  }

  async updateProfile(userId: string, data: UpdateProfileDto): Promise<Profile> {
    try {
      // If username is being updated, check uniqueness
      if (data.username) {
        const existingProfile = await this.getProfileByUsername(data.username);
        if (existingProfile && existingProfile.id !== userId) {
          throw new Error("Username already exists");
        }
      }

      const updateData = {
        ...data,
        updated_at: new Date().toISOString(),
      };

      return await this.profileRepository.upsert({
        id: userId,
        ...updateData,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  async checkProfileExists(userId: string): Promise<boolean> {
    try {
      const profile = await this.getProfileByUserId(userId);
      return profile !== null && profile.username && profile.username.trim().length >= 3;
    } catch (error) {
      console.error("Error checking profile existence:", error);
      return false;
    }
  }
}
