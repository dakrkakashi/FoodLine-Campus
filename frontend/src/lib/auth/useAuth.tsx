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
            const savedStaff = localStorage.getItem('foodline_staff_session');

            if (savedStaff) {
              try {
                const parsedStaff = JSON.parse(savedStaff);
                if (parsedStaff.email && parsedStaff.role) {
                  setUser({
                    id: parsedStaff.id || `staff_${parsedStaff.email}`,
                    email: parsedStaff.email,
                    user_metadata: {
                      full_name: parsedStaff.full_name,
                      role: parsedStaff.role,
                      cafeteria_id: parsedStaff.cafeteria_id,
                    },
                  } as unknown as User);
                  setProfile(parsedStaff);
                }
              } catch {}
            } else if (savedStudent) {
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
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    try {
      // 1. Call robust server-side staff auth with an 8-second safety timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch('/api/auth/staff-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPass }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const json = await res.json();
      if (!res.ok || !json.success) {
        return { error: { message: json.error || 'Invalid staff credentials.' } };
      }

      const staffUserObj = {
        id: json.user.id,
        email: json.user.email,
        user_metadata: {
          full_name: json.user.full_name,
          role: json.user.role,
          cafeteria_id: json.user.cafeteria_id,
        },
      } as unknown as User;

      const staffProfile: UserProfile = {
        id: json.user.id,
        email: json.user.email,
        full_name: json.user.full_name,
        role: json.user.role,
        is_active: true,
        created_at: new Date().toISOString(),
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('foodline_staff_session', JSON.stringify(staffProfile));
      }

      setUser(staffUserObj);
      setProfile(staffProfile);

      return { error: null };
    } catch (err: any) {
      // 2. Client-side fallback if server route was unreachable
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password: cleanPass });
        if (!error && data.user) {
          setUser(data.user);
          await fetchProfile(data.user);
          return { error: null };
        }
        return { error: error || { message: 'Authentication timed out. Please check credentials.' } };
      } catch (fallbackErr: any) {
        return { error: { message: err.name === 'AbortError' ? 'Staff auth request timed out. Please retry.' : (err.message || 'Staff login error.') } };
      }
    }
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
    try {
      const res = await fetch('/api/auth/student-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prn: cleanPrn, password }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        return { error: { message: json.error || 'Invalid PRN or password.' } };
      }

      const studentUser = {
        id: json.student.id || `student_${cleanPrn}`,
        email: `student_${cleanPrn}@sanjivani.edu.in`,
        user_metadata: {
          full_name: json.student.full_name,
          prn: cleanPrn,
          role: 'student',
        },
      } as unknown as User;

      const studentProf: UserProfile = {
        id: json.student.id || `student_${cleanPrn}`,
        email: `student_${cleanPrn}@sanjivani.edu.in`,
        full_name: json.student.full_name,
        role: 'student',
        prn: cleanPrn,
        is_active: true,
        created_at: new Date().toISOString(),
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('foodline_student_session', JSON.stringify(studentProf));
      }

      setUser(studentUser);
      setProfile(studentProf);
      return { error: null };
    } catch (e: any) {
      return { error: { message: e.message || 'Connection error. Please retry.' } };
    }
  }, []);

  const signUpWithPrnPassword = useCallback(async (prn: string, password: string, fullName: string) => {
    const cleanPrn = prn.trim();
    try {
      const res = await fetch('/api/auth/student-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prn: cleanPrn, password, fullName }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        return { error: { message: json.error || 'Failed to create student account.' } };
      }

      const studentUser = {
        id: json.student.id || `student_${cleanPrn}`,
        email: `student_${cleanPrn}@sanjivani.edu.in`,
        user_metadata: {
          full_name: json.student.full_name,
          prn: cleanPrn,
          role: 'student',
        },
      } as unknown as User;

      const studentProf: UserProfile = {
        id: json.student.id || `student_${cleanPrn}`,
        email: `student_${cleanPrn}@sanjivani.edu.in`,
        full_name: json.student.full_name,
        role: 'student',
        prn: cleanPrn,
        is_active: true,
        created_at: new Date().toISOString(),
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('foodline_student_session', JSON.stringify(studentProf));
      }

      setUser(studentUser);
      setProfile(studentProf);
      return { error: null };
    } catch (e: any) {
      return { error: { message: e.message || 'Connection error. Please retry.' } };
    }
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut().catch(() => {});
    if (typeof document !== 'undefined') {
      document.cookie = 'foodline_student_session=; path=/; max-age=0; SameSite=Lax';
      document.cookie = 'foodline_staff_session=; path=/; max-age=0; SameSite=Lax';
      localStorage.removeItem('foodline_student_session');
      localStorage.removeItem('foodline_staff_session');
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
