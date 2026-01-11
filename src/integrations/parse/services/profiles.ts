// Profile Service - Parse Operations
import Parse from '../client';
import type { Profile, UserStatistics, UserRole, AppRole } from '../types';

const parseObjectToProfile = (obj: Parse.Object): Profile => ({
  id: obj.id,
  firstName: obj.get('firstName'),
  lastName: obj.get('lastName'),
  phone: obj.get('phone'),
  bio: obj.get('bio'),
  avatarUrl: obj.get('avatarUrl'),
  location: obj.get('location'),
  createdAt: obj.get('createdAt'),
  updatedAt: obj.get('updatedAt'),
});

export const profileService = {
  // Get profile by user ID
  async getProfileByUserId(userId: string): Promise<Profile | null> {
    const Profile = Parse.Object.extend('Profile');
    const query = new Parse.Query(Profile);
    query.equalTo('userId', userId);
    
    const result = await query.first();
    return result ? { ...parseObjectToProfile(result), id: userId } : null;
  },

  // Get profile by ID
  async getProfileById(profileId: string): Promise<Profile | null> {
    const Profile = Parse.Object.extend('Profile');
    const query = new Parse.Query(Profile);
    query.equalTo('userId', profileId);
    
    const result = await query.first();
    return result ? parseObjectToProfile(result) : null;
  },

  // Update profile
  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const Profile = Parse.Object.extend('Profile');
    const query = new Parse.Query(Profile);
    query.equalTo('userId', userId);
    
    let profile = await query.first();
    
    if (!profile) {
      profile = new Profile();
      profile.set('userId', userId);
    }
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id') {
        profile!.set(key, value);
      }
    });
    
    const saved = await profile.save();
    return parseObjectToProfile(saved);
  },

  // Get user roles
  async getUserRoles(userId: string): Promise<AppRole[]> {
    const UserRole = Parse.Object.extend('UserRole');
    const query = new Parse.Query(UserRole);
    query.equalTo('userId', userId);
    
    const results = await query.find();
    return results.map(r => r.get('role') as AppRole);
  },

  // Add user role
  async addUserRole(userId: string, role: AppRole): Promise<void> {
    const UserRole = Parse.Object.extend('UserRole');
    
    // Check if role already exists
    const query = new Parse.Query(UserRole);
    query.equalTo('userId', userId);
    query.equalTo('role', role);
    const existing = await query.first();
    
    if (!existing) {
      const userRole = new UserRole();
      userRole.set('userId', userId);
      userRole.set('role', role);
      await userRole.save();
    }
  },

  // Remove user role
  async removeUserRole(userId: string, role: AppRole): Promise<void> {
    const UserRole = Parse.Object.extend('UserRole');
    const query = new Parse.Query(UserRole);
    query.equalTo('userId', userId);
    query.equalTo('role', role);
    
    const existing = await query.first();
    if (existing) {
      await existing.destroy();
    }
  },

  // Get user statistics
  async getUserStatistics(userId: string): Promise<UserStatistics | null> {
    const UserStatistics = Parse.Object.extend('UserStatistics');
    const query = new Parse.Query(UserStatistics);
    query.equalTo('userId', userId);
    
    const result = await query.first();
    if (!result) return null;
    
    return {
      id: result.id,
      userId: result.get('userId'),
      totalOrders: result.get('totalOrders') || 0,
      totalReviews: result.get('totalReviews') || 0,
      totalForumPosts: result.get('totalForumPosts') || 0,
      totalServicesBooked: result.get('totalServicesBooked') || 0,
      rating: result.get('rating') || 0,
      createdAt: result.get('createdAt'),
      updatedAt: result.get('updatedAt'),
    };
  },

  // Get all profiles (admin)
  async getAllProfiles(): Promise<Profile[]> {
    const Profile = Parse.Object.extend('Profile');
    const query = new Parse.Query(Profile);
    query.limit(1000);
    
    const results = await query.find();
    return results.map(parseObjectToProfile);
  },

  // Check if user has role
  async hasRole(userId: string, role: AppRole): Promise<boolean> {
    const roles = await this.getUserRoles(userId);
    return roles.includes(role);
  },

  // Get all users with roles (admin)
  async getAllUsersWithRoles(): Promise<{ userId: string; email: string; roles: AppRole[]; profile: Profile | null }[]> {
    // Get all Parse Users
    const userQuery = new Parse.Query(Parse.User);
    userQuery.limit(1000);
    const users = await userQuery.find();
    
    const result = await Promise.all(users.map(async (user) => {
      const profile = await this.getProfileByUserId(user.id);
      const roles = await this.getUserRoles(user.id);
      
      return {
        userId: user.id,
        email: user.getEmail() || user.getUsername() || '',
        roles,
        profile,
      };
    }));
    
    return result;
  },
};
