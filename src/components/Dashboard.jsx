import React, { useState } from 'react';
import { 
  Calendar, 
  FileText, 
  PlusCircle, 
  CheckSquare, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  Users, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  Award, 
  CheckCircle2,
  Search,
  Filter,
  Eye,
  Camera,
  Layers,
  GraduationCap
} from 'lucide-react';

export function Dashboard({ 
  currentUser, 
  events, 
  onNavigate, 
  onSelectEvent,
  onOpenNotifications,
  pendingApprovalsCount
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const isFaculty = currentUser.role === 'Faculty Coordinator';
  const isActivityCoord = currentUser.role === 'Activity Coordinator';
  const isAdmin = currentUser.role === 'Admin';

  // Real Database Data Calculations
  const myEvents = isFaculty 
    ? events.filter(e => e.facultyCoordinator.toLowerCase().includes((currentUser.name || '').toLowerCase().split(' ').pop() || ''))
    : events;

  const totalEventsCount = events.length;
  const completedEvents = events.filter(e => e.status === 'Completed');
  const upcomingEvents = events.filter(e => e.status === 'Scheduled' || new Date(e.date) >= new Date());
  
  const overdueEvents = events.filter(e => 
    e.status === 'Documents Overdue' || e.documents?.activityReport?.status?.includes('Overdue')
  );

  const pendingDocsCount = events.filter(e => 
    Object.values(e.documents || {}).some(d => !d.generated || d.status?.includes('Draft') || d.status?.includes('Pending'))
  ).length;

  // Filtered Events for the Table
  const displayEvents = (isFaculty ? (myEvents.length > 0 ? myEvents : events) : events).filter(e => {
    const matchSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        e.speaker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        e.facultyCoordinator.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        e.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === 'ALL' || e.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Welcome Hero Banner (Reference Maroon Institutional Accent) */}
      <div className="card" style={{
        background: '#ffffff',
        border: '1px solid var(--border-subtle)',
        borderLeft: '5px solid var(--brand-maroon)',
        padding: '1.75rem 2rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <span className={`badge ${
                isAdmin ? 'badge-mustard' : isActivityCoord ? 'badge-info' : 'badge-maroon'
              }`} style={{ fontWeight: 700 }}>
                {currentUser.role} Workspace
              </span>
              <span style={{ fontSize: '0.785rem', color: 'var(--text-subtle)' }}>
                Academic Year 2026-2027 • Department of Computer Engineering
              </span>
            </div>

            <h1 style={{ fontSize: '1.75rem', color: '#111827', fontWeight: 800 }}>
              Welcome back, {currentUser.name}
            </h1>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.35rem', maxWidth: '720px', lineHeight: 1.5 }}>
              {isAdmin && "Department Administrative Portal: Real-time oversight of college activities, documentation completion rates, faculty compliance, and NAAC/NBA accreditation dossier verification."}
              {isActivityCoord && "Activity Coordination Portal: Monitor departmental event lifecycles, attendance sheet verification, document checklist completion, and automated reminder tracking."}
              {isFaculty && "Faculty Coordinator Workspace: Create accredited activities with single-point data entry, auto-generate official flyers, letters, reports, and process attendance sheets into multi-page PDFs."}
            </p>
          </div>

          {/* Role-Specific Primary Quick Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {isFaculty && (
              <>
                <button 
                  onClick={() => onNavigate('create-event')}
                  className="btn btn-primary"
                >
                  <PlusCircle size={17} />
                  Create New Event
                </button>
                <button 
                  onClick={() => onNavigate('documents')}
                  className="btn btn-secondary"
                >
                  <FileText size={17} />
                  Document Centre
                </button>
              </>
            )}

            {isActivityCoord && (
              <>
                <button 
                  onClick={() => onNavigate('tracker')}
                  className="btn btn-primary"
                >
                  <CheckSquare size={17} />
                  Open Lifecycle Tracker
                </button>
                <button 
                  onClick={() => onNavigate('documents')}
                  className="btn btn-secondary"
                >
                  <FileText size={17} />
                  Inspect Documents
                </button>
              </>
            )}

            {isAdmin && (
              <>
                <button 
                  onClick={() => onNavigate('admin')}
                  className="btn btn-primary"
                >
                  <ShieldCheck size={17} />
                  Approvals Queue ({pendingApprovalsCount})
                </button>
                <button 
                  onClick={() => onNavigate('tracker')}
                  className="btn btn-secondary"
                >
                  <CheckSquare size={17} />
                  Department Tracker
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* KPI Metric Cards Grid with Left Colored Borders (Reference Design Pattern) */}
      <div className="grid-4">
        {/* Metric Card 1: Total Events */}
        <div 
          className="stat-card border-l-maroon" 
          onClick={() => isActivityCoord || isAdmin ? onNavigate('tracker') : onNavigate('documents')}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {isFaculty ? 'My Activities' : 'Total Events'}
            </span>
            <div style={{ padding: '0.4rem', borderRadius: '6px', background: 'var(--brand-maroon-light)' }}>
              <Calendar size={18} color="var(--brand-maroon)" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.4rem', color: '#111827' }}>
            {isFaculty ? (myEvents.length > 0 ? myEvents.length : totalEventsCount) : totalEventsCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--brand-maroon)', marginTop: '0.35rem', fontWeight: 600 }}>
            {completedEvents.length} Completed • {upcomingEvents.length} Scheduled
          </div>
        </div>

        {/* Metric Card 2: Approvals or Pending Docs */}
        <div 
          className="stat-card border-l-amber"
          onClick={() => isAdmin ? onNavigate('admin') : onNavigate('tracker')}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {isAdmin ? 'Pending Approvals' : isActivityCoord ? 'Pending Submissions' : 'Documentation In Progress'}
            </span>
            <div style={{ padding: '0.4rem', borderRadius: '6px', background: 'var(--warning-bg)' }}>
              <Clock size={18} color="var(--warning)" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.4rem', color: '#b45309' }}>
            {isAdmin ? pendingApprovalsCount : pendingDocsCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#b45309', marginTop: '0.35rem', fontWeight: 600 }}>
            {isAdmin ? 'Awaiting Department Head sign-off' : 'Awaiting complete 5-doc dossier'}
          </div>
        </div>

        {/* Metric Card 3: Overdue Documentation */}
        <div 
          className="stat-card border-l-red"
          onClick={() => onNavigate('tracker')}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Overdue Documentation
            </span>
            <div style={{ padding: '0.4rem', borderRadius: '6px', background: 'var(--danger-bg)' }}>
              <AlertTriangle size={18} color="var(--danger)" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.4rem', color: '#dc2626' }}>
            {overdueEvents.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '0.35rem', fontWeight: 600 }}>
            {overdueEvents.length > 0 ? 'Follow-up reminders required' : 'All submissions on track'}
          </div>
        </div>

        {/* Metric Card 4: Completed & Accredited */}
        <div 
          className="stat-card border-l-emerald"
          onClick={() => onNavigate('archive')}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              NAAC / NBA Archived
            </span>
            <div style={{ padding: '0.4rem', borderRadius: '6px', background: 'var(--success-bg)' }}>
              <Award size={18} color="var(--success)" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.4rem', color: '#059669' }}>
            {completedEvents.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '0.35rem', fontWeight: 600 }}>
            100% Verified Digital Dossiers
          </div>
        </div>
      </div>

      {/* Main Content Layout: Event List & Documentation Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '1.5rem' }}>
        {/* Left Column: Events Table & Search */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Filter & Search Bar (Reference Styled Card) */}
          <div className="card" style={{ padding: '1rem 1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
                <Search size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search events by title, speaker, ID or coordinator..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '38px', height: '38px' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Filter size={15} color="var(--text-subtle)" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="form-select"
                  style={{ width: 'auto', height: '38px', padding: '0.35rem 0.75rem' }}
                >
                  <option value="ALL">All Categories</option>
                  <option value="Expert Session">Expert Session</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Internship">Internship</option>
                  <option value="Seminar">Seminar</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '38%' }}>Event & Activity Details</th>
                  <th style={{ width: '18%' }}>Coordinator</th>
                  <th style={{ width: '16%' }}>Date & Time</th>
                  <th style={{ width: '14%', textAlign: 'center' }}>Status</th>
                  <th style={{ width: '14%', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayEvents.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-subtle)' }}>
                      No events matching your search or filters.
                    </td>
                  </tr>
                ) : (
                  displayEvents.map(evt => {
                    const isOverdue = evt.status === 'Documents Overdue';
                    return (
                      <tr key={evt.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                            <span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>{evt.id}</span>
                            <span className="badge badge-info" style={{ fontSize: '0.6875rem' }}>{evt.category}</span>
                          </div>
                          <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.9rem' }}>
                            {evt.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                            Speaker: <strong>{evt.speaker.name}</strong> ({evt.speaker.organization})
                          </div>
                        </td>

                        <td>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1f2937' }}>
                            {evt.facultyCoordinator}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                            {evt.organizingBody}
                          </div>
                        </td>

                        <td>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827' }}>
                            {evt.date}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                            {evt.startTime}
                          </div>
                        </td>

                        <td style={{ textAlign: 'center' }}>
                          <span className={`badge ${
                            evt.status === 'Completed' ? 'badge-success' :
                            isOverdue ? 'badge-danger' :
                            evt.status === 'In Review' ? 'badge-warning' : 'badge-neutral'
                          }`}>
                            {evt.status}
                          </span>
                        </td>

                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => onSelectEvent(evt.id)}
                            className="btn btn-secondary btn-sm"
                            style={{ gap: '0.35rem' }}
                            title="Open Document Centre"
                          >
                            <FileText size={13} />
                            Documents
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Workflow Steps & Quick Access */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Institutional Compliance Card */}
          <div className="card" style={{ borderLeft: '4px solid var(--brand-maroon)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--brand-maroon)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap size={18} />
              NAAC / NBA Accreditation
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              All generated flyers, letters, attendance records, and reports adhere to SPPU and NBA Criterion guidelines with automated Program Outcome (PO) mapping.
            </p>
            <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#065f46' }}>
                <CheckCircle2 size={14} /> Instant 5-Document Suite
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#065f46' }}>
                <CheckCircle2 size={14} /> Attendance Photo-to-PDF Scanner
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#065f46' }}>
                <CheckCircle2 size={14} /> Tamper-proof Supabase Storage
              </div>
            </div>
          </div>

          {/* Quick Photo-to-PDF Banner */}
          <div className="card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <div style={{ padding: '0.35rem', borderRadius: '6px', background: 'var(--brand-maroon-light)' }}>
                <Camera size={18} color="var(--brand-maroon)" />
              </div>
              <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: '#111827' }}>
                Attendance Photo Scanner
              </h4>
            </div>
            <p style={{ fontSize: '0.785rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
              Upload signed attendance sheet photos directly. Contrast-enhance, rotate, crop, and convert into official multipage PDFs.
            </p>
            <button
              onClick={() => onNavigate('documents')}
              className="btn btn-outline-primary btn-sm"
              style={{ width: '100%' }}
            >
              Launch Attendance Scanner
            </button>
          </div>

          {/* 5-Step Documentation Workflow Indicator */}
          <div className="card">
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>
              Event Lifecycle Progress
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.785rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--brand-maroon)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>1</div>
                <span>Create Activity Proposal</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--brand-maroon)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>2</div>
                <span>Generate Flyer & Invitation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--brand-maroon)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>3</div>
                <span>Conduct Event & Scan Attendance</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--brand-maroon)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>4</div>
                <span>Generate Report & Thank You Letter</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#059669', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>5</div>
                <span>Admin Approval & Dossier Archive</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
