import { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthSession {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
}

export function useAuth(): AuthSession & {
  logout: () => Promise<void>;
} {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is already signed in
        const { data: session } = await supabase.auth.getSession();
        if (session?.session?.user) {
          setUser(session.session.user);
          // Store token in localStorage for API calls
          localStorage.setItem('sb-auth-token', session.session.access_token);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        localStorage.setItem('sb-auth-token', session.access_token);
      } else {
        setUser(null);
        localStorage.removeItem('sb-auth-token');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('sb-auth-token');
  };

  return {
    user,
    isLoading,
    isSignedIn: !!user,
    logout,
  };
}
