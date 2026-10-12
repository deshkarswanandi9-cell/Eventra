import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock, 
  FileText, 
  Download, 
  UserCheck, 
  History, 
  BarChart3, 
  TrendingUp, 
  CheckCheck,
  Building2,
  Users
} from 'lucide-react';

export function AdminMonitoring({ 
  events, 
  auditLogs, 
  users, 
  onApproveDocument, 
  currentUser 
}) {
  const [activeTab, setActiveTab] = useState('approvals'); // approvals, statistics, audit, users

  // Documents awaiting Admin Approval
  const pendingApprovals = [];
  events.forEach(evt => {
    Object.entries(evt.documents || {}).forEach(([docKey, docVal]) => {
      if (docVal.status === 'Pending Review' || docVal.status === 'In Review') {
        pendingApprovals.push({
          eventId: evt.id,
          eventTitle: evt.title,
          category: evt.category,
          coordinator: evt.facultyCoordinator,
          docKey,
          docName: docKey === 'activityReport' ? 'Activity Report' : 
                   docKey === 'thankYouLetter' ? 'Thank-You Letter' : 
                   docKey === 'attendanceSheet' ? 'Attendance Sheet' : docKey,
          generatedAt: docVal.generatedAt || 'Recently'
        });
      }
    });
  });

  // Calculate Department Analytics
  const totalEvents = events.length;
  const totalBeneficiaries = events.reduce((acc, e) => acc + (e.participants.actualAttended || e.participants.expectedCount || 0), 0);
  const categoriesCount = {};
  events.forEach(e => {
    categoriesCount[e.category] = (categoriesCount[e.category] || 0) + 1;
  });

  const exportConsolidatedReport = () => {
    let csv = "Event ID,Title,Category,Date,Resource Person,Organization,Coordinator,Beneficiaries,Status\n";
    events.forEach(e => {
      csv += `"${e.id}","${e.title}","${e.category}","${e.date}","${e.speaker.name}","${e.speaker.organization}","${e.facultyCoordinator}",${e.participants.actualAttended || e.participants.expectedCount},"${e.status}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Consolidated_Activity_Dossier_CE_Dept_2026.csv`;
    a.click();
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={24} color="#f59e0b" />
            <h2 style={{ fontSize: '1.5rem' }}>Department Administration & Governance</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Prof. Vaishnavi Chitragar (HOD & Department Admin) • Computer Engineering Department
          </p>
        </div>

        <button onClick={exportConsolidatedReport} className="btn btn-primary">
          <Download size={16} />
          Export Consolidated Department Dossier (CSV)
        </button>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid-4">
        <div className="card" style={{ background: '#131c2e', borderTop: '3px solid #f59e0b' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Approvals Queue</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.25rem', color: '#f59e0b' }}>
            {pendingApprovals.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>Awaiting HOD sign-off</div>
        </div>

        <div className="card" style={{ background: '#131c2e', borderTop: '3px solid #10b981' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Students Reached</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.25rem', color: '#10b981' }}>
            {totalBeneficiaries}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '0.35rem' }}>Verified attendance records</div>
        </div>

        <div className="card" style={{ background: '#131c2e', borderTop: '3px solid #6366f1' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Academic Programs</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.25rem', color: '#6366f1' }}>
            {totalEvents}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#818cf8', marginTop: '0.35rem' }}>Expert sessions & workshops</div>
        </div>

        <div className="card" style={{ background: '#131c2e', borderTop: '3px solid #06b6d4' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Faculty Compliance</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.25rem', color: '#06b6d4' }}>
            88%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#67e8f9', marginTop: '0.35rem' }}>Documentation on-time</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '0.5rem'
      }}>
        <button
          onClick={() => setActiveTab('approvals')}
          className={`btn btn-sm ${activeTab === 'approvals' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <CheckCheck size={15} />
          Pending Approvals ({pendingApprovals.length})
        </button>

        <button
          onClick={() => setActiveTab('statistics')}
          className={`btn btn-sm ${activeTab === 'statistics' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <BarChart3 size={15} />
          Department Analytics
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`btn btn-sm ${activeTab === 'audit' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <History size={15} />
          Audit Trail & Activity Logs
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`btn btn-sm ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Users size={15} />
          User Permissions & Roles
        </button>
      </div>

      {/* Tab 1: Approvals Queue */}
      {activeTab === 'approvals' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {pendingApprovals.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <CheckCircle size={36} color="#10b981" style={{ margin: '0 auto 0.75rem auto' }} />
              <h3 style={{ fontSize: '1.1rem' }}>Approvals Queue is Clear!</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                All submitted activity reports and letters have been reviewed and approved.
              </p>
            </div>
          ) : (
            pendingApprovals.map((appr, idx) => (
              <div 
                key={idx}
                className="card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  borderLeft: '4px solid #f59e0b'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span className="badge badge-warning">Awaiting Approval</span>
                    <span className="badge badge-info">{appr.category}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{appr.eventId}</span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', color: '#ffffff' }}>
                    {appr.docName}: {appr.eventTitle}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                    Submitted by: <strong>{appr.coordinator}</strong> • Generated on: {appr.generatedAt}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button 
                    onClick={() => onApproveDocument(appr.eventId, appr.docKey, 'Revision Requested')}
                    className="btn btn-secondary btn-sm"
                  >
                    Request Revision
                  </button>

                  <button 
                    onClick={() => onApproveDocument(appr.eventId, appr.docKey, 'Approved')}
                    className="btn btn-success btn-sm"
                  >
                    <CheckCircle size={15} />
                    Approve & Sign Document
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Department Statistics */}
      {activeTab === 'statistics' && (
        <div className="animate-fade-in grid-2">
          <div className="card">
            <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem', color: '#818cf8' }}>
              Activities by Category
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {Object.entries(categoriesCount).map(([cat, count]) => {
                const pct = Math.round((count / totalEvents) * 100);
                return (
                  <div key={cat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                      <span style={{ fontWeight: 600 }}>{cat}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #4f46e5, #06b6d4)' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem', color: '#06b6d4' }}>
              Accreditation Compliance Checklist (NBA / NAAC)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981' }}>
                <CheckCircle size={16} /> All events mapped to Program Outcomes (POs/PSOs)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981' }}>
                <CheckCircle size={16} /> Official attendance rosters signed and archived
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981' }}>
                <CheckCircle size={16} /> Geotagged photographic records attached to activity reports
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981' }}>
                <CheckCircle size={16} /> Resource person profiles & feedback ratings documented
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Audit Trail */}
      {activeTab === 'audit' && (
        <div className="animate-fade-in card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
            System Audit Trail & Modification History
          </h3>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Faculty / Admin</th>
                  <th>Role</th>
                  <th>Action</th>
                  <th>Event & Detail</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log.id}>
                    <td style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>{log.timestamp}</td>
                    <td style={{ fontWeight: 600 }}>{log.user}</td>
                    <td>
                      <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>{log.role}</span>
                    </td>
                    <td>
                      <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{log.action}</span>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: User Roles & Permissions */}
      {activeTab === 'users' && (
        <div className="animate-fade-in card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
            Department Users & Role Access Matrix
          </h3>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Designation</th>
                  <th>Email</th>
                  <th>Permissions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <img src={u.avatar} alt={u.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                        <span style={{ fontWeight: 600 }}>{u.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        u.role === 'Admin' ? 'badge-warning' :
                        u.role === 'Activity Coordinator' ? 'badge-info' : 'badge-neutral'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{u.designation}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{u.email}</td>
                    <td style={{ fontSize: '0.785rem' }}>
                      {u.role === 'Admin' ? 'Full Access, Approvals, User Mgmt' :
                       u.role === 'Activity Coordinator' ? 'Track Events, Reminders, Audit Reports' :
                       'Create Events, Generate Documents, Submit'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
