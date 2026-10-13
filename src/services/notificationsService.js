import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { INITIAL_NOTIFICATIONS } from '../data/mockData';
import { uiRoleToDbRole } from './authService';

export const notificationsService = {
  isConfigured: isSupabaseConfigured,

  async fetchNotifications(userId, userRole) {
    if (!isSupabaseConfigured || !supabase) {
      const saved = localStorage.getItem('eventra_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    }

    try {
      const dbRole = uiRoleToDbRole(userRole);
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId && userId.length === 36) {
        query = query.or(`recipient_id.eq.${userId},target_role.eq.${dbRole}`);
      } else {
        query = query.eq('target_role', dbRole);
      }

      const { data, error } = await query;
      if (error) throw error;

      if (!data || data.length === 0) {
        return [];
      }

      return data.map(n => ({
        id: n.id,
        targetRole: n.target_role === 'admin' ? 'Admin' : n.target_role === 'activity_coordinator' ? 'Activity Coordinator' : 'Faculty Coordinator',
        recipient: n.recipient_id || 'All',
        title: n.title || 'Notification',
        message: n.message,
        type: n.notification_type || 'info',
        timestamp: n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
        unread: !n.is_read,
        eventId: n.event_id
      }));
    } catch (err) {
      console.warn('Error fetching notifications from Supabase:', err);
      const saved = localStorage.getItem('eventra_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    }
  },

  async markAllRead(userId, userRole) {
    if (!isSupabaseConfigured || !supabase) return;

    try {
      const dbRole = uiRoleToDbRole(userRole);
      if (userId && userId.length === 36) {
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .or(`recipient_id.eq.${userId},target_role.eq.${dbRole}`);
      } else {
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('target_role', dbRole);
      }
    } catch (err) {
      console.error('Error marking notifications as read:', err);
    }
  },

  async createNotification(notif) {
    if (!isSupabaseConfigured || !supabase) return;

    try {
      await supabase.from('notifications').insert({
        title: notif.title,
        message: notif.message,
        notification_type: notif.type || 'info',
        target_role: uiRoleToDbRole(notif.targetRole),
        event_id: notif.eventId && notif.eventId.length === 36 ? notif.eventId : null,
        is_read: false
      });
    } catch (err) {
      console.error('Error creating notification in Supabase:', err);
    }
  }
};
