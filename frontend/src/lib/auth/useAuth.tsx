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
  signInWithPrn: (prn: string, phone: string) => Promise<void>;
  signInWithPrnPassword: (prn: string, password: string) => Promise<{ error: any }>;
  signUpWithPrnPassword: (prn: string, password: string, fullName: string) => Promise<{ error: any }>;
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
          if (currentUser) {
            setUser(currentUser);
            await fetchProfile(currentUser);
          } else if (typeof window !== 'undefined') {
            // Check student session from localStorage
            const savedStudent = localStorage.getItem('foodline_student_session');
            if (savedStudent) {
              try {
                const parsed = JSON.parse(savedStudent);
                if (parsed.prn) {
                  setUser({
                    id: parsed.id || `student_${parsed.prn}`,
                    email: parsed.email || `student_${parsed.prn}@sanjivani.edu.in`,
                    user_metadata: {
                      full_name: parsed.full_name,
                      prn: parsed.prn,
                      phone: parsed.phone,
                      role: 'student',
                    },
                  } as unknown as User);
                  setProfile(parsed);
                }
              } catch {}
            }
          }
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
        if (currentUser) {
          setUser(currentUser);
          await fetchProfile(currentUser);
        }
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

  const signInWithPrn = useCallback(async (prn: string, phone: string) => {
    const cleanPrn = prn.trim();
    const cleanPhone = phone.trim();
    const studentUser = {
      id: `student_${cleanPrn}`,
      email: `student_${cleanPrn}@sanjivani.edu.in`,
      user_metadata: {
        full_name: `Campus Student (${cleanPrn})`,
        prn: cleanPrn,
        phone: cleanPhone,
        role: 'student',
      },
    } as unknown as User;

    const studentProf: UserProfile = {
      id: `student_${cleanPrn}`,
      email: `student_${cleanPrn}@sanjivani.edu.in`,
      full_name: `Campus Student (${cleanPrn})`,
      role: 'student',
      prn: cleanPrn,
      phone: cleanPhone,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    const cookieVal = encodeURIComponent(JSON.stringify({
      prn: cleanPrn,
      phone: cleanPhone,
      role: 'student',
      full_name: `Campus Student (${cleanPrn})`,
    }));

    if (typeof document !== 'undefined') {
      document.cookie = `foodline_student_session=${cookieVal}; path=/; max-age=604800; SameSite=Lax`;
      localStorage.setItem('foodline_student_session', JSON.stringify(studentProf));
    }

    setUser(studentUser);
    setProfile(studentProf);
  }, []);

  const signInWithPrnPassword = useCallback(async (prn: string, password: string) => {
    const cleanPrn = prn.trim();
    const mappedEmail = `prn_${cleanPrn}@foodline.campus`;
    // Satisfy Supabase complexity policy while letting students use any password
    const securePassword = `FL#${password}@Campus2026!`;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: mappedEmail,
      password: securePassword,
    });

    if (!error && data.user) {
      const cookieVal = encodeURIComponent(JSON.stringify({
        prn: cleanPrn,
        role: 'student',
        full_name: data.user.user_metadata?.full_name || `Campus Student (${cleanPrn})`,
      }));
      if (typeof document !== 'undefined') {
        document.cookie = `foodline_student_session=${cookieVal}; path=/; max-age=604800; SameSite=Lax`;
      }
      setUser(data.user);
      await fetchProfile(data.user);
      return { error: null };
    }

    return { error };
  }, [supabase, fetchProfile]);

  const signUpWithPrnPassword = useCallback(async (prn: string, password: string, fullName: string) => {
    const cleanPrn = prn.trim();
    const mappedEmail = `prn_${cleanPrn}@foodline.campus`;
    // Satisfy Supabase complexity policy while letting students use any password
    const securePassword = `FL#${password}@Campus2026!`;

    const { data, error } = await supabase.auth.signUp({
      email: mappedEmail,
      password: securePassword,
      options: {
        data: {
          full_name: fullName,
          prn: cleanPrn,
          role: 'student',
        },
      },
    });

    if (!error && data.user) {
      try {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: mappedEmail,
          full_name: fullName,
          prn: cleanPrn,
          role: 'student',
          is_active: true,
        });
      } catch (e) {}

      const cookieVal = encodeURIComponent(JSON.stringify({
        prn: cleanPrn,
        role: 'student',
        full_name: fullName,
      }));
      if (typeof document !== 'undefined') {
        document.cookie = `foodline_student_session=${cookieVal}; path=/; max-age=604800; SameSite=Lax`;
      }

      setUser(data.user);
      await fetchProfile(data.user);
      return { error: null };
    }

    return { error };
  }, [supabase, fetchProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut().catch(() => {});
    if (typeof document !== 'undefined') {
      document.cookie = 'foodline_student_session=; path=/; max-age=0; SameSite=Lax';
      localStorage.removeItem('foodline_student_session');
    }
    setUser(null);
    setProfile(null);
    setImpersonatedRole(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
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
    signInWithPrn,
    signInWithPrnPassword,
    signUpWithPrnPassword,
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
    signInWithPrn,
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
