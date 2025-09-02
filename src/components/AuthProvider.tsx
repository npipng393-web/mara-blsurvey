'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'supervisor' | 'enumerator' | 'viewer';
  active: boolean;
  organization?: string;
  assigned_locations?: string[];
  assigned_clans?: string[];
  survey_count: number;
  last_login?: string;
}

interface UserPermissions {
  can_create_surveys: boolean;
  can_edit_surveys: boolean;
  can_delete_surveys: boolean;
  can_export_data: boolean;
  can_manage_users: boolean;
  can_view_analytics: boolean;
  location_restrictions?: string[];
  clan_restrictions?: string[];
  own_surveys_only: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  permissions: UserPermissions | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, fullName: string, role?: string) => Promise<any>;
  signOut: () => Promise<any>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<any>;
  hasPermission: (permission: keyof UserPermissions) => boolean;
  canAccessSurvey: (survey: any) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClientComponentClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await loadUserProfile(session.user.id);
        // Log login activity
        if (event === 'SIGNED_IN') {
          await logActivity('login');
        }
      } else {
        setProfile(null);
        setPermissions(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      // Load user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error loading profile:', profileError);
        setLoading(false);
        return;
      }

      setProfile(profileData);

      // Load user permissions
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('data_permissions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (permissionsError) {
        console.error('Error loading permissions:', permissionsError);
      } else {
        setPermissions(permissionsData);
      }

      // Update last login
      await supabase
        .from('user_profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId);

    } catch (error) {
      console.error('Error in loadUserProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string, fullName: string, role = 'enumerator') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });
    return { data, error };
  };

  const signOut = async () => {
    await logActivity('logout');
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: 'No user logged in' };

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (!error && data) {
      setProfile(data);
    }

    return { data, error };
  };

  const logActivity = async (action: string, resourceType?: string, resourceId?: string, details?: any) => {
    if (!user) return;

    try {
      await supabase
        .from('activity_log')
        .insert({
          user_id: user.id,
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          details,
        });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const hasPermission = (permission: keyof UserPermissions): boolean => {
    if (!permissions) return false;
    if (profile?.role === 'admin') return true;
    return permissions[permission] === true;
  };

  const canAccessSurvey = (survey: any): boolean => {
    if (!permissions || !profile) return false;
    if (profile.role === 'admin') return true;

    // Check if user can only access own surveys
    if (permissions.own_surveys_only && survey.created_by !== profile.id) {
      return false;
    }

    // Check location restrictions
    if (permissions.location_restrictions && permissions.location_restrictions.length > 0) {
      if (!permissions.location_restrictions.includes(survey.current_location)) {
        return false;
      }
    }

    // Check clan restrictions
    if (permissions.clan_restrictions && permissions.clan_restrictions.length > 0) {
      if (!permissions.clan_restrictions.includes(survey.clan_name)) {
        return false;
      }
    }

    return true;
  };

  const value = {
    user,
    session,
    profile,
    permissions,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    hasPermission,
    canAccessSurvey,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
