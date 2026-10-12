import React from 'react';
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
  CheckCircle2
} from 'lucide-react';

export function Dashboard({ 
  currentUser, 
  events, 
  onNavigate, 
  onSelectEvent,
  onOpenNotifications,
  pendingApprovalsCount
}) {
  const isFaculty = currentUser.role === 'Faculty Coordinator';
  const isActivityCoord = currentUser.role === 'Activity Coordinator';
  const isAdmin = currentUser.role === 'Admin';

  const myEvents = isFaculty 
    ? events.filter(e => e.facultyCoordinator.includes(currentUser.name.split(' ')[1] || 'Kulkarni'))
    : events;

  const overdueEvents = events.filter(e => 
    e.status === 'Documents Overdue' || e.documents?.activityReport?.status?.includes('Overdue')
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Welcome Hero Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #131c2e 0%, #1a253c 50%, #0f172a 100%)',
        border: '1px solid var(--border-subtle)',
        position: 'relative',
        overflow: 'hidden',
        padding: '2rem'
      }}>
        <div style={{
          position: 'absolute',
          right: '-50px',
          top: '-50px',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span className={`badge ${
                isAdmin ? 'badge-warning' : isActivityCoord ? 'badge-info' : 'badge-primary'
              }`}>
                {currentUser.role} Portal
              </span>
              <span style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>
                Academic Year 2026-2027 • Computer Engineering Department
              </span>
            </div>
            <h1 style={{ fontSize: '1.85rem', color: '#ffffff' }}>
              Welcome back, {currentUser.name}
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.35rem', maxWidth: '680px' }}>
              {isAdmin && "Department Admin Portal: Oversee departmental activities, sign off on accredited reports, and verify document completeness."}
              {isActivityCoord && "Activity Coordination Portal: Track all academic event lifecycles, monitor pending submissions, and ensure timely documentation."}
              {isFaculty && "Faculty Coordinator Portal: Create events with a single form and auto-generate official flyers, letters, attendance sheets, and reports."}
            </p>
          </div>

          {/* Quick Primary Actions Tailored to Role */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {isFaculty && (
              <>
                <button 
                  onClick={() => onNavigate('create-event')}
                  className="btn btn-primary btn-lg"
                >
                  <PlusCircle size={18} />
                  Create New Event
                </button>
                <button 
                  onClick={() => onNavigate('documents')}
                  className="btn btn-secondary btn-lg"
                >
                  <FileText size={18} />
                  My Documents
                </button>
              </>
            )}

            {isActivityCoord && (
              <>
                <button 
                  onClick={() => onNavigate('tracker')}
                  className="btn btn-primary btn-lg"
                  style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)' }}
                >
                  <CheckSquare size={18} />
                  Open Event Tracker
                </button>
                <button 
                  onClick={() => onNavigate('documents')}
                  className="btn btn-secondary btn-lg"
                >
                  <FileText size={18} />
                  Inspect Documents
                </button>
              </>
            )}

            {isAdmin && (
              <>
                <button 
                  onClick={() => onNavigate('admin')}
                  className="btn btn-primary btn-lg"
                  style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
                >
                  <ShieldCheck size={18} />
                  Admin Approvals ({pendingApprovalsCount})
                </button>
                <button 
                  onClick={() => onNavigate('tracker')}
                  className="btn btn-secondary btn-lg"
                >
                  <CheckSquare size={18} />
                  Department Tracker
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Role-Specific Metric Cards */}
      <div className="grid-4">
        {/* Card 1 */}
        <div 
          className="card card-hover" 
          onClick={() => isActivityCoord || isAdmin ? onNavigate('tracker') : onNavigate('documents')} 
          style={{ cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {isFaculty ? 'My Activities' : 'Department Events'}
            </span>
            <Calendar size={18} color="#818cf8" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.4rem', color: '#ffffff' }}>
            {myEvents.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#818cf8', marginTop: '0.25rem' }}>
            {isFaculty ? 'View my documents →' : 'View full tracker →'}
          </div>
        </div>

        {/* Card 2 */}
        {isAdmin ? (
          <div className="card card-hover" onClick={() => onNavigate('admin')} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending Approvals</span>
              <Clock size={18} color="#f59e0b" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.4rem', color: '#f59e0b' }}>{pendingApprovalsCount}</div>
            <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '0.25rem' }}>Review & Sign off →</div>
          </div>
        ) : isActivityCoord ? (
          <div className="card card-hover" onClick={() => onNavigate('tracker')} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending Submissions</span>
              <Clock size={18} color="#06b6d4" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.4rem', color: '#06b6d4' }}>
              {events.filter(e => Object.values(e.documents || {}).some(d => !d.generated || d.status.includes('Draft'))).length}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#67e8f9', marginTop: '0.25rem' }}>Track checklist status →</div>
          </div>
        ) : (
          <div className="card card-hover" onClick={() => onNavigate('create-event')} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Quick Action</span>
              <PlusCircle size={18} color="#10b981" />
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.6rem', color: '#10b981' }}>New Activity</div>
            <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '0.25rem' }}>Auto-generate 5 docs →</div>
          </div>
        )}

        {/* Card 3 */}
        <div 
          className="card card-hover" 
          onClick={() => isActivityCoord || isAdmin ? onNavigate('tracker') : onNavigate('documents')} 
          style={{ cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Overdue Documents</span>
            <AlertTriangle size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.4rem', color: '#ef4444' }}>{overdueEvents.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '0.25rem' }}>
            {isActivityCoord ? 'Dispatch reminders →' : 'Action required →'}
          </div>
        </div>

        {/* Card 4 */}
        <div className="card card-hover" onClick={() => onNavigate('archive')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Department Archive</span>
            <Award size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.4rem', color: '#10b981' }}>
            {events.filter(e => e.status === 'Completed').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '0.25rem' }}>Open digital archive →</div>
        </div>
      </div>

      {/* Main Content Area: Recent Events & Workflows */}
      <div className="grid-3" style={{ gridTemplateColumns: '2fr 1fr' }}>
        {/* Left Column: Events & Document Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.15rem' }}>
              {isFaculty ? 'Your Coordinated Activities' : 'Department Events & Documentation Status'}
            </h3>
            <button onClick={() => onNavigate('tracker')} className="btn btn-secondary btn-sm">
              View All ({events.length})
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {myEvents.map(evt => (
              <div 
                key={evt.id}
                className="card card-hover"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>{evt.id}</span>
                    <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{evt.category}</span>
                    <span className={`badge ${
                      evt.status === 'Completed' ? 'badge-success' :
                      evt.status === 'Documents Overdue' ? 'badge-danger' : 'badge-warning'
                    }`} style={{ fontSize: '0.7rem' }}>
                      {evt.status}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1rem', color: '#ffffff', fontWeight: 600 }}>
                    {evt.title}
                  </h4>
                  <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Date: {evt.date} • Speaker: <strong>{evt.speaker.name}</strong> ({evt.speaker.organization})
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button 
                    onClick={() => onSelectEvent(evt.id)}
                    className="btn btn-secondary btn-sm"
                  >
                    Open Documents
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Workflow Steps & Quick Guides */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card" style={{ background: '#131c2e' }}>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} /> Automation Workflow
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.825rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#4f46e5',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  flexShrink: 0
                }}>1</div>
                <div>
                  <strong>Enter Event Details Once:</strong> Faculty enters speaker, dates, and student group.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#06b6d4',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  flexShrink: 0
                }}>2</div>
                <div>
                  <strong>Instant 5-Doc Generation:</strong> Flyer, Invitation Letter, Attendance Sheet, Report & Thank-You.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#10b981',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  flexShrink: 0
                }}>3</div>
                <div>
                  <strong>Coordination & Review:</strong> Activity Coordinator tracks checklists; Admin signs off.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#f59e0b',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  flexShrink: 0
                }}>4</div>
                <div>
                  <strong>Centralized Archive:</strong> Permanently stored for NBA, NAAC, and departmental records.
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ background: '#131c2e', borderLeft: '4px solid #10b981' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 600, fontSize: '0.85rem' }}>
              <CheckCircle2 size={16} /> Real Event Pre-loaded
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem', lineHeight: 1.4 }}>
              "Product Development Life Cycle (PDLC)" by <strong>Ms. Rohini More (Deloitte Pune)</strong> is loaded with full documents and attendance!
            </p>
            <button 
              onClick={() => onSelectEvent('EVT-2026-001')}
              className="btn btn-outline-primary btn-sm"
              style={{ marginTop: '0.75rem', width: '100%' }}
            >
              Inspect PDLC Event Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
