import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { INITIAL_AUDIT_LOGS } from '../data/mockData';

export const auditService = {
  isConfigured: isSupabaseConfigured,

  async fetchAuditLogs() {
    if (!isSupabaseConfigured || !supabase) {
      const saved = localStorage.getItem('eventra_audit');
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    }

    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      if (!data || data.length === 0) return [];

      return data.map(log => ({
        id: log.id,
        user: log.user_name || 'System User',
        role: log.user_role || 'Coordinator',
        action: log.action,
        details: log.details,
        timestamp: log.created_at ? log.created_at.replace('T', ' ').substring(0, 16) : 'Recently'
      }));
    } catch (err) {
      console.warn('Error fetching audit logs from Supabase:', err);
      const saved = localStorage.getItem('eventra_audit');
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    }
  },

  async logAction({ user, role, action, entityType = 'general', entityId = null, details }) {
    if (!isSupabaseConfigured || !supabase) {
      return;
    }

    try {
      await supabase.from('audit_logs').insert({
        user_name: user?.name || user || 'System',
        user_role: role || 'Faculty Coordinator',
        action,
        entity_type: entityType,
        entity_id: entityId ? String(entityId) : null,
        details
      });
    } catch (err) {
      console.error('Error logging audit action:', err);
    }
  }
};
