import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { INITIAL_USERS } from '../data/mockData';

export const dbRoleToUIRole = (dbRole) => {
  if (dbRole === 'admin') return 'Admin';
  if (dbRole === 'activity_coordinator') return 'Activity Coordinator';
  return 'Faculty Coordinator';
};

export const uiRoleToDbRole = (uiRole) => {
  if (uiRole === 'Admin') return 'admin';
  if (uiRole === 'Activity Coordinator') return 'activity_coordinator';
  return 'faculty_coordinator';
};

export const authService = {
  isConfigured: isSupabaseConfigured,

  async signIn(email, password) {
    if (!isSupabaseConfigured) {
      // Demo / offline fallback
      const found = INITIAL_USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!found) {
        throw new Error('No coordinator found with this institutional email address.');
      }
      if (found.password && password !== found.password && password !== 'eventra123') {
        throw new Error(`Incorrect password. (Tip: Demo password for ${found.name} is "${found.password}")`);
      }
      return { user: found, profile: found };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) {
      throw error;
    }

    // Fetch profile
    const profile = await this.fetchProfile(data.user.id);
    return {
      user: data.user,
      profile: profile || {
        id: data.user.id,
        name: data.user.user_metadata?.full_name || email.split('@')[0],
        email: data.user.email,
        role: dbRoleToUIRole(data.user.user_metadata?.role || 'faculty_coordinator'),
        department: data.user.user_metadata?.department || 'Computer Engineering',
        avatar: data.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      }
    };
  },

  async signUp(email, password, { fullName, role = 'Faculty Coordinator', department = 'Computer Engineering', designation = 'Assistant Professor' }) {
    if (!isSupabaseConfigured || !supabase) {
      // Demo / offline fallback
      const newUser = {
        id: `usr_${Date.now()}`,
        name: fullName || email.split('@')[0],
        email: email.trim(),
        role: role,
        department,
        designation,
        password,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      };
      return { user: newUser, profile: newUser };
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
      options: {
        data: {
          full_name: fullName,
          role: uiRoleToDbRole(role),
          department,
          designation,
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        }
      }
    });

    if (error) {
      throw error;
    }

    let profile = null;
    if (data.user?.id) {
      profile = await this.fetchProfile(data.user.id);
    }

    return {
      user: data.user,
      profile: profile || {
        id: data.user?.id,
        name: fullName,
        email: data.user?.email || email,
        role: role,
        department,
        designation,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      }
    };
  },

  async signOut() {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('eventra_auth');
    localStorage.removeItem('eventra_user_id');
  },

  async fetchProfile(userId) {
    if (!isSupabaseConfigured || !supabase) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        name: data.full_name,
        email: data.email,
        role: dbRoleToUIRole(data.role),
        department: data.department,
        designation: data.designation,
        avatar: data.avatar_url,
        phone: data.phone,
      };
    } catch {
      return null;
    }
  },

  async getCurrentSession() {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  onAuthStateChange(callback) {
    if (!isSupabaseConfigured || !supabase) return () => {};
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await this.fetchProfile(session.user.id);
        callback(event, session, profile);
      } else {
        callback(event, null, null);
      }
    });
    return () => subscription.unsubscribe();
  }
};
