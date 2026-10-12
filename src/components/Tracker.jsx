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
  Eye
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

  // Calculate Metrics
  const totalEvents = events.length;
  const completedEvents = events.filter(e => e.status === 'Completed').length;
  const overdueReports = events.filter(e => 
    e.documents?.activityReport?.status?.toLowerCase().includes('overdue') ||
    (e.status === 'Documents Overdue')
  ).length;
  const pendingReview = events.filter(e => 
    Object.values(e.documents || {}).some(d => d.status === 'Pending Review')
  ).length;

  const getDocStatusBadge = (doc) => {
    if (!doc || !doc.generated) {
      return <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>Pending</span>;
    }
    const s = doc.status?.toLowerCase() || '';
    if (s.includes('approved')) {
      return <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>✓ Approved</span>;
    }
    if (s.includes('pending')) {
      return <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>In Review</span>;
    }
    if (s.includes('overdue')) {
      return <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>⚠ Overdue</span>;
    }
    return <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{doc.status}</span>;
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header & Role Indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckSquare size={22} color="#06b6d4" />
            <h2 style={{ fontSize: '1.5rem' }}>Activity Coordinator Lifecycle Tracker</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Monitor event documentation checklists, identify missing files, and dispatch automated follow-up reminders.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge badge-info">Logged in as: {currentUser.name}</span>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid-4">
        <div className="card" style={{ background: '#131c2e', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Department Events</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.25rem', color: '#ffffff' }}>{totalEvents}</div>
          <div style={{ fontSize: '0.75rem', color: '#60a5fa', marginTop: '0.35rem' }}>Across Odd Sem 2026</div>
        </div>

        <div className="card" style={{ background: '#131c2e', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fully Archived & Complete</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.25rem', color: '#10b981' }}>{completedEvents}</div>
          <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '0.35rem' }}>All 5 documents approved</div>
        </div>

        <div className="card" style={{ background: '#131c2e', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Documents Pending Review</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.25rem', color: '#f59e0b' }}>{pendingReview}</div>
          <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '0.35rem' }}>Awaiting Admin signature</div>
        </div>

        <div className="card" style={{ background: '#131c2e', borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Overdue Submissions</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.25rem', color: '#ef4444' }}>{overdueReports}</div>
          <div style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '0.35rem' }}>Requires immediate follow-up</div>
        </div>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="card" style={{ padding: '1.25rem', background: '#111827' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search by event title, speaker or ID..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="form-input" 
              style={{ paddingLeft: '36px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Category:</span>
            <select className="form-select" style={{ width: 'auto' }} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="ALL">All Categories</option>
              <option value="Expert Session">Expert Session</option>
              <option value="Workshop">Workshop</option>
              <option value="Internship">Internship</option>
              <option value="Seminar">Seminar</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status:</span>
            <select className="form-select" style={{ width: 'auto' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="ALL">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="In Review">In Review</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Documents Overdue">Overdue</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Coordinator:</span>
            <select className="form-select" style={{ width: 'auto' }} value={coordinatorFilter} onChange={(e) => setCoordinatorFilter(e.target.value)}>
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
              <th style={{ width: '22%' }}>Event Details</th>
              <th style={{ width: '13%' }}>Coordinator</th>
              <th style={{ textAlign: 'center' }}>Flyer</th>
              <th style={{ textAlign: 'center' }}>Invitation</th>
              <th style={{ textAlign: 'center' }}>Attendance</th>
              <th style={{ textAlign: 'center' }}>Activity Report</th>
              <th style={{ textAlign: 'center' }}>Thank You</th>
              <th style={{ textAlign: 'center', width: '15%' }}>Action & Follow-up</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map(evt => {
              const isOverdue = evt.status === 'Documents Overdue' || evt.documents?.activityReport?.status?.includes('Overdue');

              return (
                <tr key={evt.id} style={{ background: isOverdue ? 'rgba(239, 68, 68, 0.04)' : undefined }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                      <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>{evt.id}</span>
                      <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>{evt.category}</span>
                    </div>
                    <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.9rem' }}>
                      {evt.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Date: {evt.date} • Speaker: {evt.speaker.name}
                    </div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 600 }}>{evt.facultyCoordinator}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{evt.organizingBody}</div>
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
                        Inspect Docs
                      </button>

                      {isOverdue && (
                        <button 
                          onClick={() => onSendReminder(evt)}
                          className="btn btn-danger btn-sm"
                          title="Send Urgent Reminder"
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
