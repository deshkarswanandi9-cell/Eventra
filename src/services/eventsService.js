import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { INITIAL_EVENTS } from '../data/mockData';

// Map database document types to UI document keys
export const DOC_TYPE_TO_KEY = {
  'flyer': 'flyer',
  'invitation_letter': 'invitationLetter',
  'attendance_sheet': 'attendanceSheet',
  'activity_report': 'activityReport',
  'thank_you_letter': 'thankYouLetter'
};

export const DOC_KEY_TO_TYPE = {
  'flyer': 'flyer',
  'invitationLetter': 'invitation_letter',
  'attendanceSheet': 'attendance_sheet',
  'activityReport': 'activity_report',
  'thankYouLetter': 'thank_you_letter'
};

const mapDbEventToUI = (dbEvent, dbDocs = []) => {
  const documents = {
    flyer: { generated: false, status: 'Draft Ready', generatedAt: null },
    invitationLetter: { generated: false, status: 'Draft Ready', generatedAt: null, refNo: null },
    attendanceSheet: { generated: false, status: 'Ready (Empty)', generatedAt: null, totalPresent: 0 },
    activityReport: { generated: false, status: 'Draft', generatedAt: null },
    thankYouLetter: { generated: false, status: 'Draft', generatedAt: null, refNo: null }
  };

  dbDocs.forEach(d => {
    const key = DOC_TYPE_TO_KEY[d.document_type];
    if (key) {
      let uiStatus = 'Draft';
      const s = (d.status || '').toLowerCase();
      if (s === 'approved') uiStatus = 'Approved';
      else if (s === 'pending_review' || s === 'in_review') uiStatus = 'Pending Review';
      else if (s === 'needs_revision') uiStatus = 'Revision Requested';
      else if (s === 'submitted') uiStatus = 'Submitted';
      else if (s === 'draft_ready') uiStatus = 'Draft Ready';
      else uiStatus = d.status;

      documents[key] = {
        id: d.id,
        generated: true,
        status: uiStatus,
        generatedAt: d.created_at ? d.created_at.split('T')[0] : null,
        refNo: d.ref_no,
        storagePath: d.storage_path,
        fileName: d.file_name,
        reviewComments: d.review_comments,
        totalPresent: d.metadata?.totalPresent || 0
      };
    }
  });

  // UI Status formatting
  let uiEventStatus = 'Scheduled';
  const st = (dbEvent.status || '').toLowerCase();
  if (st === 'completed') uiEventStatus = 'Completed';
  else if (st === 'in_review') uiEventStatus = 'In Review';
  else if (st === 'documents_overdue') uiEventStatus = 'Documents Overdue';
  else if (st === 'scheduled' || st === 'upcoming') uiEventStatus = 'Scheduled';
  else uiEventStatus = dbEvent.status;

  return {
    id: dbEvent.event_code || dbEvent.id,
    dbId: dbEvent.id,
    title: dbEvent.title,
    category: dbEvent.category,
    academicYear: dbEvent.academic_year,
    semester: dbEvent.semester,
    date: dbEvent.event_date,
    endDate: dbEvent.end_date,
    startTime: dbEvent.start_time || '10:00 AM',
    duration: dbEvent.duration || '2 Hours',
    venue: dbEvent.venue,
    mode: dbEvent.mode ? dbEvent.mode.charAt(0).toUpperCase() + dbEvent.mode.slice(1) : 'Offline',
    status: uiEventStatus,
    organizingBody: dbEvent.organizing_body,
    facultyCoordinator: dbEvent.faculty_coordinator_name || 'Prof. Sneha Kulkarni',
    facultyCoordinatorId: dbEvent.faculty_coordinator_id,
    activityCoordinator: dbEvent.activity_coordinator_name || 'Prof. Rajesh Verma',
    adminSupervisor: 'Prof. Vaishnavi Chitragar',
    speaker: {
      name: dbEvent.speaker_name,
      designation: dbEvent.speaker_designation || 'Industry Specialist',
      organization: dbEvent.speaker_organization || 'Enterprise Partner',
      email: dbEvent.speaker_email || '',
      phone: dbEvent.speaker_phone || '',
      profile: dbEvent.speaker_bio || '',
      photo: dbEvent.speaker_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    },
    participants: {
      targetYears: Array.isArray(dbEvent.participant_years) ? dbEvent.participant_years : ['TE', 'BE'],
      divisions: Array.isArray(dbEvent.participant_divisions) ? dbEvent.participant_divisions : ['Div A', 'Div B'],
      expectedCount: dbEvent.expected_participants || 60,
      actualAttended: dbEvent.actual_participants || 0
    },
    description: dbEvent.description || '',
    objectives: Array.isArray(dbEvent.objectives) ? dbEvent.objectives : [],
    outcomes: Array.isArray(dbEvent.outcomes) ? dbEvent.outcomes : [],
    mappedPos: Array.isArray(dbEvent.mapped_pos) ? dbEvent.mapped_pos : ['PO1', 'PO3'],
    documents,
    feedbackRating: dbEvent.feedback_rating ? Number(dbEvent.feedback_rating) : null,
    eventPhotos: Array.isArray(dbEvent.event_photos) ? dbEvent.event_photos : []
  };
};

export const eventsService = {
  isConfigured: isSupabaseConfigured,

  async fetchEvents() {
    if (!isSupabaseConfigured || !supabase) {
      const saved = localStorage.getItem('eventra_events');
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    }

    try {
      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });

      if (eventsError) throw eventsError;
      if (!eventsData || eventsData.length === 0) {
        return [];
      }

      // Fetch documents for all events
      const eventIds = eventsData.map(e => e.id);
      const { data: docsData, error: docsError } = await supabase
        .from('documents')
        .select('*')
        .in('event_id', eventIds);

      if (docsError) console.warn('Could not fetch documents:', docsError);

      const docsByEvent = {};
      (docsData || []).forEach(doc => {
        if (!docsByEvent[doc.event_id]) docsByEvent[doc.event_id] = [];
        docsByEvent[doc.event_id].push(doc);
      });

      return eventsData.map(e => mapDbEventToUI(e, docsByEvent[e.id] || []));
    } catch (err) {
      console.error('Error fetching events from Supabase:', err);
      const saved = localStorage.getItem('eventra_events');
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    }
  },

  async createEvent(eventData, currentUser) {
    if (!isSupabaseConfigured || !supabase) {
      return eventData;
    }

    const modeNormalized = (eventData.mode || 'offline').toLowerCase();
    const eventRow = {
      event_code: eventData.id,
      title: eventData.title,
      category: eventData.category,
      academic_year: eventData.academicYear,
      semester: eventData.semester,
      event_date: eventData.date,
      end_date: eventData.endDate || null,
      start_time: eventData.startTime,
      duration: eventData.duration,
      venue: eventData.venue,
      mode: ['offline', 'online', 'hybrid'].includes(modeNormalized) ? modeNormalized : 'offline',
      status: 'scheduled',
      organizing_body: eventData.organizingBody,
      faculty_coordinator_name: eventData.facultyCoordinator,
      faculty_coordinator_id: currentUser?.id && currentUser.id.length === 36 ? currentUser.id : null,
      activity_coordinator_name: eventData.activityCoordinator || 'Prof. Rajesh Verma',
      speaker_name: eventData.speaker?.name,
      speaker_designation: eventData.speaker?.designation,
      speaker_organization: eventData.speaker?.organization,
      speaker_email: eventData.speaker?.email,
      speaker_phone: eventData.speaker?.phone,
      speaker_bio: eventData.speaker?.profile,
      speaker_photo: eventData.speaker?.photo,
      participant_years: eventData.participants?.targetYears || ['TE', 'BE'],
      participant_divisions: eventData.participants?.divisions || ['Div A', 'Div B'],
      expected_participants: eventData.participants?.expectedCount || 60,
      actual_participants: 0,
      description: eventData.description,
      objectives: eventData.objectives || [],
      outcomes: eventData.outcomes || [],
      mapped_pos: eventData.mappedPos || []
    };

    const { data: insertedEvent, error: insertError } = await supabase
      .from('events')
      .insert(eventRow)
      .select()
      .single();

    if (insertError) throw insertError;

    // Create 5 document entries in documents table
    const documentRows = [
      { event_id: insertedEvent.id, document_type: 'flyer', status: 'draft_ready', file_name: `${eventData.id}_Flyer.pdf` },
      { event_id: insertedEvent.id, document_type: 'invitation_letter', status: 'draft_ready', ref_no: `CO/INV/${eventData.id.replace('EVT-','')}`, file_name: `${eventData.id}_Invitation.pdf` },
      { event_id: insertedEvent.id, document_type: 'attendance_sheet', status: 'draft_ready', file_name: `${eventData.id}_Attendance.csv` },
      { event_id: insertedEvent.id, document_type: 'activity_report', status: 'draft', file_name: null },
      { event_id: insertedEvent.id, document_type: 'thank_you_letter', status: 'draft', ref_no: `CO/TY/${eventData.id.replace('EVT-','')}`, file_name: null },
    ];

    await supabase.from('documents').insert(documentRows);

    // Create default event checklist tasks
    const checklistRows = [
      { event_id: insertedEvent.id, checklist_item: 'Send Resource Person Invitation & Receive Acceptance', status: 'completed' },
      { event_id: insertedEvent.id, checklist_item: 'Distribute Official Event Flyer to Students', status: 'in_progress' },
      { event_id: insertedEvent.id, checklist_item: 'Prepare & Print Student Attendance Sheet', status: 'pending' },
      { event_id: insertedEvent.id, checklist_item: 'Execute Event and Capture Geotagged Photos', status: 'pending' },
      { event_id: insertedEvent.id, checklist_item: 'Draft Post-Event Activity Report & Collect Feedback', status: 'pending' }
    ];

    await supabase.from('event_checklist').insert(checklistRows);

    return {
      ...eventData,
      dbId: insertedEvent.id
    };
  },

  async updateDocumentStatus(eventId, docKey, statusDecision) {
    if (!isSupabaseConfigured || !supabase) {
      return;
    }

    const docType = DOC_KEY_TO_TYPE[docKey];
    if (!docType) return;

    let dbStatus = 'draft';
    if (statusDecision === 'Approved') dbStatus = 'approved';
    else if (statusDecision === 'Revision Requested') dbStatus = 'needs_revision';
    else if (statusDecision === 'Pending Review') dbStatus = 'pending_review';
    else if (statusDecision === 'Submitted') dbStatus = 'submitted';

    // Find event dbId
    const { data: eventRow } = await supabase
      .from('events')
      .select('id')
      .or(`id.eq.${eventId.length === 36 ? eventId : '00000000-0000-0000-0000-000000000000'},event_code.eq.${eventId}`)
      .single();

    if (!eventRow) return;

    await supabase
      .from('documents')
      .update({ status: dbStatus })
      .match({ event_id: eventRow.id, document_type: docType });

    // Check if all 5 docs are approved
    const { data: allDocs } = await supabase
      .from('documents')
      .select('status')
      .eq('event_id', eventRow.id);

    if (allDocs && allDocs.length >= 5 && allDocs.every(d => d.status === 'approved')) {
      await supabase
        .from('events')
        .update({ status: 'completed' })
        .eq('id', eventRow.id);
    }
  },

  async fetchEventChecklist(eventId) {
    if (!isSupabaseConfigured || !supabase) return [];

    try {
      const { data, error } = await supabase
        .from('event_checklist')
        .select('*')
        .eq('event_id', eventId);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('Error fetching checklist:', err);
      return [];
    }
  },

  async updateChecklistItem(itemId, status) {
    if (!isSupabaseConfigured || !supabase) return;
    await supabase
      .from('event_checklist')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', itemId);
  }
};
