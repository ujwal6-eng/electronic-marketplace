import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

export function useAdminAuth() {
  const { user, loading: authLoading } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoles() {
      if (!user) {
        setRoles([]);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .rpc('get_user_roles', { _user_id: user.id });

        if (error) {
          console.error('Error fetching roles:', error);
          setRoles([]);
          setIsAdmin(false);
        } else {
          const userRoles = data || [];
          setRoles(userRoles);
          setIsAdmin(userRoles.includes('admin'));
        }
      } catch (err) {
        console.error('Error:', err);
        setRoles([]);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchRoles();
    }
  }, [user, authLoading]);

  return { 
    user, 
    roles, 
    isAdmin, 
    loading: authLoading || loading,
    hasRole: (role: AppRole) => roles.includes(role)
  };
}
