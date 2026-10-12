import React, { useState } from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  Mail, 
  ClipboardList, 
  Award, 
  HeartHandshake, 
  Calendar, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Printer
} from 'lucide-react';
import { FlyerDocument } from './documents/FlyerDocument';
import { InvitationLetter } from './documents/InvitationLetter';
import { AttendanceSheet } from './documents/AttendanceSheet';
import { ActivityReport } from './documents/ActivityReport';
import { ThankYouLetter } from './documents/ThankYouLetter';

export function DocumentCentre({ 
  events, 
  selectedEventId, 
  setSelectedEventId, 
  currentUser,
  onUpdateEventDocStatus
}) {
  const [activeDocType, setActiveDocType] = useState('flyer'); // flyer, invitation, attendance, report, thankyou

  const currentEvent = events.find(e => e.id === selectedEventId) || events[0];

  if (!currentEvent) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h3>No event found.</h3>
      </div>
    );
  }

  const docTabs = [
    { id: 'flyer', label: '1. Event Flyer', icon: ImageIcon, docKey: 'flyer' },
    { id: 'invitation', label: '2. Invitation Letter', icon: Mail, docKey: 'invitationLetter' },
    { id: 'attendance', label: '3. Attendance Sheet', icon: ClipboardList, docKey: 'attendanceSheet' },
    { id: 'report', label: '4. Activity Report', icon: Award, docKey: 'activityReport' },
    { id: 'thankyou', label: '5. Thank-You Letter', icon: HeartHandshake, docKey: 'thankYouLetter' },
  ];

  const handlePrint = () => {
    window.print();
  };

  const getDocStatus = (key) => {
    return currentEvent.documents?.[key]?.status || 'Not Generated';
  };

  const isDocGenerated = (key) => {
    return !!currentEvent.documents?.[key]?.generated;
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Event Selection & Context Header */}
      <div className="card no-print" style={{
        background: 'linear-gradient(135deg, #151e30 0%, #1a253c 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-info">{currentEvent.category}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {currentEvent.id}</span>
            <span className="badge badge-success">{currentEvent.status}</span>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
            {currentEvent.title}
          </h2>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            marginTop: '0.4rem',
            flexWrap: 'wrap'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Calendar size={14} /> {currentEvent.date} ({currentEvent.startTime})
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <User size={14} /> Resource Person: <strong>{currentEvent.speaker.name}</strong> ({currentEvent.speaker.organization})
            </span>
            <span>
              Coord: <strong>{currentEvent.facultyCoordinator}</strong>
            </span>
          </div>
        </div>

        {/* Event Switcher Dropdown */}
        <div style={{ minWidth: '240px' }}>
          <label className="form-label">Active Event Workspace:</label>
          <select 
            className="form-select"
            value={currentEvent.id}
            onChange={(e) => setSelectedEventId(e.target.value)}
          >
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>
                {ev.id}: {ev.title.substring(0, 32)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Document Tab Selector */}
      <div className="no-print" style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.25rem'
      }}>
        {docTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeDocType === tab.id;
          const status = getDocStatus(tab.docKey);
          const isDone = isDocGenerated(tab.docKey);

          return (
            <button
              key={tab.id}
              onClick={() => setActiveDocType(tab.id)}
              style={{
                flex: '1 1 auto',
                minWidth: '170px',
                padding: '0.85rem 1rem',
                background: isActive ? '#1e293b' : '#111827',
                border: `1px solid ${isActive ? 'var(--primary-light)' : 'var(--border-subtle)'}`,
                borderBottom: isActive ? '3px solid var(--primary)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: isActive ? '#ffffff' : 'var(--text-muted)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
                  <Icon size={16} color={isActive ? '#818cf8' : 'var(--text-subtle)'} />
                  {tab.label}
                </div>
                {isDone ? (
                  <CheckCircle2 size={15} color="#10b981" />
                ) : (
                  <Clock size={15} color="#f59e0b" />
                )}
              </div>
              <div style={{ fontSize: '0.72rem', color: isDone ? '#34d399' : '#f59e0b' }}>
                Status: {status}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Document Viewer */}
      <div style={{ marginTop: '0.5rem' }}>
        {activeDocType === 'flyer' && (
          <FlyerDocument event={currentEvent} onPrint={handlePrint} />
        )}
        {activeDocType === 'invitation' && (
          <InvitationLetter event={currentEvent} onPrint={handlePrint} />
        )}
        {activeDocType === 'attendance' && (
          <AttendanceSheet event={currentEvent} onPrint={handlePrint} />
        )}
        {activeDocType === 'report' && (
          <ActivityReport event={currentEvent} onPrint={handlePrint} />
        )}
        {activeDocType === 'thankyou' && (
          <ThankYouLetter event={currentEvent} onPrint={handlePrint} />
        )}
      </div>
    </div>
  );
}
