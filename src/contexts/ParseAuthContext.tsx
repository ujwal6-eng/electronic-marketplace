import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import Parse from '@/integrations/parse/client';
import { useNavigate } from 'react-router-dom';
import type { AppRole, Profile } from '@/integrations/parse/types';

interface ParseUser {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  roles: AppRole[];
}

interface ParseAuthContextType {
  user: ParseUser | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  getCurrentUserId: () => string | null;
  hasRole: (role: AppRole) => boolean;
  refreshUser: () => Promise<void>;
}

const ParseAuthContext = createContext<ParseAuthContextType | undefined>(undefined);

export function ParseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ParseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserRoles = async (userId: string): Promise<AppRole[]> => {
    try {
      const UserRole = Parse.Object.extend('UserRole');
      const query = new Parse.Query(UserRole);
      query.equalTo('userId', userId);
      const results = await query.find();
      return results.map(r => r.get('role') as AppRole);
    } catch (error) {
      console.error('Error fetching roles:', error);
      return ['buyer']; // Default role
    }
  };

  const buildUserObject = async (parseUser: Parse.User): Promise<ParseUser> => {
    const roles = await fetchUserRoles(parseUser.id);
    return {
      id: parseUser.id,
      email: parseUser.getEmail() || '',
      username: parseUser.getUsername() || '',
      firstName: parseUser.get('firstName'),
      lastName: parseUser.get('lastName'),
      roles
    };
  };

  const refreshUser = useCallback(async () => {
    const currentUser = Parse.User.current();
    if (currentUser) {
      try {
        await currentUser.fetch();
        const userObj = await buildUserObject(currentUser);
        setUser(userObj);
      } catch (error) {
        console.error('Error refreshing user:', error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const currentUser = Parse.User.current();
      if (currentUser) {
        try {
          // Validate session is still valid
          await currentUser.fetch();
          const userObj = await buildUserObject(currentUser);
          setUser(userObj);
        } catch (error) {
          // Session expired or invalid
          console.error('Session invalid:', error);
          await Parse.User.logOut();
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const user = new Parse.User();
      user.set('username', email);
      user.set('email', email);
      user.set('password', password);
      
      if (metadata) {
        if (metadata.firstName) user.set('firstName', metadata.firstName);
        if (metadata.lastName) user.set('lastName', metadata.lastName);
        if (metadata.phone) user.set('phone', metadata.phone);
      }

      const newUser = await user.signUp();

      // Create profile
      const Profile = Parse.Object.extend('Profile');
      const profile = new Profile();
      profile.set('userId', newUser.id);
      profile.set('firstName', metadata?.firstName || '');
      profile.set('lastName', metadata?.lastName || '');
      profile.set('phone', metadata?.phone || '');
      await profile.save();

      // Create default role (buyer)
      const role = metadata?.role || 'buyer';
      const UserRole = Parse.Object.extend('UserRole');
      const userRole = new UserRole();
      userRole.set('userId', newUser.id);
      userRole.set('role', role);
      await userRole.save();

      // Create user statistics
      const UserStatistics = Parse.Object.extend('UserStatistics');
      const stats = new UserStatistics();
      stats.set('userId', newUser.id);
      stats.set('totalOrders', 0);
      stats.set('totalReviews', 0);
      stats.set('totalForumPosts', 0);
      stats.set('totalServicesBooked', 0);
      stats.set('rating', 0);
      await stats.save();

      // If technician, create technician profile
      if (role === 'technician') {
        const TechnicianProfile = Parse.Object.extend('TechnicianProfile');
        const techProfile = new TechnicianProfile();
        techProfile.set('userId', newUser.id);
        techProfile.set('experienceYears', metadata?.experienceYears || 0);
        techProfile.set('specializations', metadata?.specializations || []);
        techProfile.set('certifications', metadata?.certifications || []);
        techProfile.set('hourlyRate', metadata?.hourlyRate || 0);
        techProfile.set('rating', 0);
        techProfile.set('totalReviews', 0);
        techProfile.set('totalJobs', 0);
        techProfile.set('verified', 'pending');
        techProfile.set('available', true);
        await techProfile.save();
      }

      // If seller, create store placeholder
      if (role === 'seller' && metadata?.storeName) {
        const Store = Parse.Object.extend('Store');
        const store = new Store();
        store.set('ownerId', newUser.id);
        store.set('name', metadata.storeName);
        store.set('slug', metadata.storeName.toLowerCase().replace(/\s+/g, '-'));
        store.set('rating', 0);
        store.set('totalReviews', 0);
        store.set('verified', false);
        await store.save();
      }

      const userObj = await buildUserObject(newUser);
      setUser(userObj);
      
      return { error: null };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { error: new Error(error.message || 'Failed to sign up') };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const loggedInUser = await Parse.User.logIn(email, password);
      const userObj = await buildUserObject(loggedInUser);
      setUser(userObj);
      return { error: null };
    } catch (error: any) {
      console.error('Login error:', error);
      return { error: new Error(error.message || 'Invalid email or password') };
    }
  };

  const signOut = async () => {
    try {
      await Parse.User.logOut();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await Parse.User.requestPasswordReset(email);
      return { error: null };
    } catch (error: any) {
      console.error('Password reset error:', error);
      return { error: new Error(error.message || 'Failed to send reset email') };
    }
  };

  const getCurrentUserId = () => {
    return user?.id || null;
  };

  const hasRole = (role: AppRole) => {
    return user?.roles.includes(role) || false;
  };

  return (
    <ParseAuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      signOut,
      resetPassword,
      getCurrentUserId,
      hasRole,
      refreshUser
    }}>
      {children}
    </ParseAuthContext.Provider>
  );
}

export function useParseAuth() {
  const context = useContext(ParseAuthContext);
  if (context === undefined) {
    throw new Error('useParseAuth must be used within a ParseAuthProvider');
  }
  return context;
}

// Alias for compatibility
export const useAuth = useParseAuth;
