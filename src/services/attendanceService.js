import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { INITIAL_STUDENTS } from '../data/mockData';

export const attendanceService = {
  isConfigured: isSupabaseConfigured,

  async fetchAttendanceForEvent(eventId) {
    if (!isSupabaseConfigured || !supabase) {
      return null;
    }

    try {
      // Find event id
      const { data: evt } = await supabase
        .from('events')
        .select('id')
        .or(`id.eq.${eventId.length === 36 ? eventId : '00000000-0000-0000-0000-000000000000'},event_code.eq.${eventId}`)
        .single();

      if (!evt) return null;

      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('event_id', evt.id);

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Error fetching attendance:', err);
      return null;
    }
  },

  async saveAttendance(eventId, records) {
    if (!isSupabaseConfigured || !supabase) {
      console.info('[AttendanceService Mock] Saved attendance locally');
      return true;
    }

    try {
      const { data: evt } = await supabase
        .from('events')
        .select('id')
        .or(`id.eq.${eventId.length === 36 ? eventId : '00000000-0000-0000-0000-000000000000'},event_code.eq.${eventId}`)
        .single();

      if (!evt) return false;

      // Upsert attendance rows
      const rows = records.map(r => ({
        event_id: evt.id,
        student_roll_number: r.rollNo,
        student_name: r.name,
        class_year: r.year,
        division: r.division,
        attendance_status: Boolean(r.status),
      }));

      const { error } = await supabase
        .from('attendance')
        .upsert(rows, { onConflict: 'event_id,student_roll_number' });

      if (error) throw error;

      // Update actual participants count in event record
      const presentCount = rows.filter(r => r.attendance_status).length;
      await supabase
        .from('events')
        .update({ actual_participants: presentCount })
        .eq('id', evt.id);

      return true;
    } catch (err) {
      console.error('Error saving attendance in Supabase:', err);
      return false;
    }
  }
};
