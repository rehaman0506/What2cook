import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string) => Promise<{ error?: string }>;
  signUp: (email: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check local guest session or Supabase session
    const initAuth = async () => {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || 'chef@what2cook.ai',
              created_at: session.user.created_at,
              isGuest: false,
            });
            setLoading(false);
            return;
          }

          // Listen for Supabase auth state changes
          supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
              setUser({
                id: session.user.id,
                email: session.user.email || 'chef@what2cook.ai',
                created_at: session.user.created_at,
                isGuest: false,
              });
            } else {
              checkLocalSession();
            }
          });
        }

        checkLocalSession();
      } catch (err) {
        console.error('Auth initialization error:', err);
        checkLocalSession();
      } finally {
        setLoading(false);
      }
    };

    const checkLocalSession = () => {
      const stored = localStorage.getItem('recipemate_user_session');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          setDefaultGuest();
        }
      } else {
        setDefaultGuest();
      }
    };

    const setDefaultGuest = () => {
      const guestUser: UserProfile = {
        id: 'guest-' + Math.random().toString(36).substring(2, 9),
        email: 'student.chef@what2cook.ai',
        created_at: new Date().toISOString(),
        isGuest: true,
      };
      setUser(guestUser);
      localStorage.setItem('recipemate_user_session', JSON.stringify(guestUser));
    };

    initAuth();
  }, []);

  const signIn = async (email: string) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) return { error: error.message };
        return {};
      } catch (e: any) {
        return { error: e.message || 'Authentication error' };
      }
    } else {
      // Local demo mode sign in
      const demoUser: UserProfile = {
        id: 'user-' + btoa(email).substring(0, 10),
        email,
        created_at: new Date().toISOString(),
        isGuest: false
      };
      setUser(demoUser);
      localStorage.setItem('recipemate_user_session', JSON.stringify(demoUser));
      return {};
    }
  };

  const signUp = async (email: string) => {
    return signIn(email);
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    const guestUser: UserProfile = {
      id: 'guest-' + Math.random().toString(36).substring(2, 9),
      email: 'student.chef@what2cook.ai',
      created_at: new Date().toISOString(),
      isGuest: true,
    };
    setUser(guestUser);
    localStorage.setItem('recipemate_user_session', JSON.stringify(guestUser));
  };

  const continueAsGuest = () => {
    const guestUser: UserProfile = {
      id: 'guest-' + Math.random().toString(36).substring(2, 9),
      email: 'student.chef@what2cook.ai',
      created_at: new Date().toISOString(),
      isGuest: true,
    };
    setUser(guestUser);
    localStorage.setItem('recipemate_user_session', JSON.stringify(guestUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, continueAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
