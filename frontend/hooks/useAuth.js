"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

export default function useAuth(requireAuth = false) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // For the prototype: if no supabase url/key is provided, we simulate a logged in user 
    // to avoid breaking the app for the user during demo if they haven't set keys yet.
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_project_url_here') {
      console.warn("Supabase keys not found. Running in MOCK AUTH mode.");
      setUser({ id: 'mock-user-123', email: 'demo@hirevault.app' });
      setLoading(false);
      return;
    }

    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && requireAuth && !user) {
      router.push(`/login?redirectTo=${pathname}`);
    }
  }, [user, loading, requireAuth, pathname, router]);

  return { user, loading };
}
