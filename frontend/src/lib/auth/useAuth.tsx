'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '../supabase/client';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole;
  effectiveRole: UserRole;
  impersonatedRole: UserRole | null;
  setImpersonatedRole: (role: UserRole | null) => void;
  loading: boolean;
  signInWithGoogle: (redirectTo?: string) => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<{ error: any }>;
  signUpWithPassword: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [impersonatedRole, setImpersonatedRoleState] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => createClient(), []);

  // Fetch or construct profile
  const fetchProfile = useCallback(async (currentUser: User | null) => {
    if (!currentUser) {
      setProfile(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (data && !error) {
        setProfile(data as UserProfile);
      } else {
        // Fallback profile if DB trigger not completed yet
        const fallbackProfile: UserProfile = {
          id: currentUser.id,
          email: currentUser.email || '',
          full_name: currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || 'Campus Student',
          role: (currentUser.user_metadata?.role as UserRole) || 'student',
          is_active: true,
          created_at: new Date().toISOString(),
        };
        setProfile(fallbackProfile);
      }
    } catch {
      // Fallback
      setProfile({
        id: currentUser.id,
        email: currentUser.email || '',
        full_name: currentUser.user_metadata?.full_name || 'Campus Student',
        role: 'student',
        is_active: true,
      });
    }
  }, [supabase]);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          const currentUser = session?.user ?? null;
          setUser(currentUser);
          await fetchProfile(currentUser);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    // Check local storage for impersonated role (dev/founder convenience)
    if (typeof window !== 'undefined') {
      const savedImpersonation = localStorage.getItem('foodline_impersonate_role') as UserRole | null;
      if (savedImpersonation) setImpersonatedRoleState(savedImpersonation);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (mounted) {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        await fetchProfile(currentUser);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  const setImpersonatedRole = useCallback((role: UserRole | null) => {
    setImpersonatedRoleState(role);
    if (typeof window !== 'undefined') {
      if (role) {
        localStorage.setItem('foodline_impersonate_role', role);
      } else {
        localStorage.removeItem('foodline_impersonate_role');
      }
    }
  }, []);

  const signInWithGoogle = useCallback(async (redirectTo = '/menu') => {
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${siteUrl}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
        queryParams: {
          hd: 'sanjivani.edu.in', // Restrict to Sanjivani University domain when applicable
        },
      },
    });
  }, [supabase]);

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data.user) {
      setUser(data.user);
      await fetchProfile(data.user);
    }
    return { error };
  }, [supabase, fetchProfile]);

  const signUpWithPassword = useCallback(async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'student',
        },
      },
    });
    if (!error && data.user) {
      setUser(data.user);
      await fetchProfile(data.user);
    }
    return { error };
  }, [supabase, fetchProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setImpersonatedRole(null);
  }, [supabase, setImpersonatedRole]);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user);
    }
  }, [user, fetchProfile]);

  const role: UserRole = profile?.role || 'student';
  // Allow Admins to preview any role via impersonation
  const effectiveRole: UserRole = (role === 'admin' && impersonatedRole) ? impersonatedRole : role;

  const value = useMemo(() => ({
    user,
    profile,
    role,
    effectiveRole,
    impersonatedRole,
    setImpersonatedRole,
    loading,
    signInWithGoogle,
    signInWithPassword,
    signUpWithPassword,
    signOut,
    refreshProfile,
  }), [
    user,
    profile,
    role,
    effectiveRole,
    impersonatedRole,
    setImpersonatedRole,
    loading,
    signInWithGoogle,
    signInWithPassword,
    signUpWithPassword,
    signOut,
    refreshProfile,
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
