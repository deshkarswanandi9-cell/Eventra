import React, { useState } from 'react';
import { 
  CheckSquare, 
  Search, 
  Filter, 
  BellRing, 
  FileCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  Send,
  Eye,
  Award,
  Calendar
} from 'lucide-react';

export function Tracker({ 
  events, 
  onSelectEvent, 
  onSendReminder,
  currentUser 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [coordinatorFilter, setCoordinatorFilter] = useState('ALL');

  // Filtered Events
  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.speaker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || e.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    const matchesCoord = coordinatorFilter === 'ALL' || e.facultyCoordinator.includes(coordinatorFilter);
    return matchesSearch && matchesCat && matchesStatus && matchesCoord;
  });

  // Calculate Real Database Metrics
  const totalEvents = events.length;
  const completedEvents = events.filter(e => e.status === 'Completed').length;
  const overdueReports = events.filter(e => 
    e.documents?.activityReport?.status?.toLowerCase().includes('overdue') ||
    (e.status === 'Documents Overdue')
  ).length;
  const pendingReview = events.filter(e => 
    Object.values(e.documents || {}).some(d => d.status === 'Pending Review' || d.status === 'In Review')
  ).length;

  const getDocStatusBadge = (doc) => {
    if (!doc || !doc.generated) {
      return <span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>Draft Pending</span>;
    }
    const s = doc.status?.toLowerCase() || '';
    if (s.includes('approved')) {
      return <span className="badge badge-success" style={{ fontSize: '0.6875rem' }}>✓ Approved</span>;
    }
    if (s.includes('pending') || s.includes('review') || s.includes('submitted')) {
      return <span className="badge badge-warning" style={{ fontSize: '0.6875rem' }}>In Review</span>;
    }
    if (s.includes('overdue')) {
      return <span className="badge badge-danger" style={{ fontSize: '0.6875rem' }}>⚠ Overdue</span>;
    }
    return <span className="badge badge-info" style={{ fontSize: '0.6875rem' }}>{doc.status}</span>;
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header & Role Indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckSquare size={24} color="var(--brand-maroon)" />
            <h2 style={{ fontSize: '1.5rem', color: '#111827' }}>Activity Coordinator Lifecycle Tracker</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Monitor event documentation checklists, verify attendance submissions, and dispatch automated follow-up reminders.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge badge-maroon" style={{ fontWeight: 600 }}>
            Logged in as: {currentUser.name} ({currentUser.role})
          </span>
        </div>
      </div>

      {/* Metric Cards Banner with Reference Left-Border Pattern */}
      <div className="grid-4">
        <div className="stat-card border-l-maroon">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
            Department Events
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.25rem', color: '#111827' }}>
            {totalEvents}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--brand-maroon)', marginTop: '0.35rem', fontWeight: 600 }}>
            Academic Year 2026-2027
          </div>
        </div>

        <div className="stat-card border-l-emerald">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
            Fully Complete & Archived
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.25rem', color: '#059669' }}>
            {completedEvents}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '0.35rem', fontWeight: 600 }}>
            All 5 documents verified & signed
          </div>
        </div>

        <div className="stat-card border-l-amber">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
            Documents In Review
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.25rem', color: '#b45309' }}>
            {pendingReview}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#b45309', marginTop: '0.35rem', fontWeight: 600 }}>
            Awaiting HOD verification
          </div>
        </div>

        <div className="stat-card border-l-red">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
            Overdue Submissions
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.25rem', color: '#dc2626' }}>
            {overdueReports}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '0.35rem', fontWeight: 600 }}>
            Actionable reminder required
          </div>
        </div>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search by event title, speaker or ID..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="form-input" 
              style={{ paddingLeft: '38px', height: '38px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Category:</span>
            <select className="form-select" style={{ width: 'auto', height: '38px', padding: '0.35rem 0.75rem' }} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="ALL">All Categories</option>
              <option value="Expert Session">Expert Session</option>
              <option value="Workshop">Workshop</option>
              <option value="Internship">Internship</option>
              <option value="Seminar">Seminar</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status:</span>
            <select className="form-select" style={{ width: 'auto', height: '38px', padding: '0.35rem 0.75rem' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="ALL">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="In Review">In Review</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Documents Overdue">Overdue</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Coordinator:</span>
            <select className="form-select" style={{ width: 'auto', height: '38px', padding: '0.35rem 0.75rem' }} value={coordinatorFilter} onChange={(e) => setCoordinatorFilter(e.target.value)}>
              <option value="ALL">All Faculty</option>
              <option value="Sneha Kulkarni">Prof. Sneha Kulkarni</option>
              <option value="Arvind Patil">Prof. Arvind Patil</option>
              <option value="Rahul Shinde">Prof. Rahul Shinde</option>
            </select>
          </div>
        </div>
      </div>

      {/* Event Tracking Checklist Table */}
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: '24%' }}>Event Details</th>
              <th style={{ width: '14%' }}>Coordinator</th>
              <th style={{ textAlign: 'center', width: '10%' }}>Flyer</th>
              <th style={{ textAlign: 'center', width: '10%' }}>Invitation</th>
              <th style={{ textAlign: 'center', width: '12%' }}>Attendance</th>
              <th style={{ textAlign: 'center', width: '12%' }}>Report</th>
              <th style={{ textAlign: 'center', width: '10%' }}>Thank You</th>
              <th style={{ textAlign: 'center', width: '14%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map(evt => {
              const isOverdue = evt.status === 'Documents Overdue' || evt.documents?.activityReport?.status?.includes('Overdue');

              return (
                <tr key={evt.id} style={{ background: isOverdue ? '#fff5f5' : undefined }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                      <span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>{evt.id}</span>
                      <span className="badge badge-info" style={{ fontSize: '0.6875rem' }}>{evt.category}</span>
                    </div>
                    <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>
                      {evt.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Date: {evt.date} • Speaker: <strong>{evt.speaker.name}</strong>
                    </div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1f2937' }}>{evt.facultyCoordinator}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{evt.organizingBody}</div>
                  </td>

                  {/* Document Checklist Items */}
                  <td style={{ textAlign: 'center' }}>
                    {getDocStatusBadge(evt.documents?.flyer)}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {getDocStatusBadge(evt.documents?.invitationLetter)}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {getDocStatusBadge(evt.documents?.attendanceSheet)}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {getDocStatusBadge(evt.documents?.activityReport)}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {getDocStatusBadge(evt.documents?.thankYouLetter)}
                  </td>

                  {/* Action Buttons */}
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem' }}>
                      <button 
                        onClick={() => onSelectEvent(evt.id)}
                        className="btn btn-secondary btn-sm"
                        title="Open Document Centre"
                      >
                        <Eye size={13} />
                        Inspect
                      </button>

                      {isOverdue && (
                        <button 
                          onClick={() => onSendReminder(evt)}
                          className="btn btn-danger btn-sm"
                          title="Dispatch Urgent Documentation Follow-up"
                        >
                          <Send size={13} />
                          Remind
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Tracker;
