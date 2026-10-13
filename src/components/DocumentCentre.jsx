import React, { useState, useRef } from 'react';
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
  Printer,
  Upload,
  ExternalLink,
  ShieldCheck,
  Check,
  GraduationCap
} from 'lucide-react';
import { FlyerDocument } from './documents/FlyerDocument';
import { InvitationLetter } from './documents/InvitationLetter';
import { AttendanceSheet } from './documents/AttendanceSheet';
import { ActivityReport } from './documents/ActivityReport';
import { ThankYouLetter } from './documents/ThankYouLetter';
import { documentsService } from '../services/documentsService';

export function DocumentCentre({ 
  events, 
  selectedEventId, 
  setSelectedEventId, 
  currentUser,
  onUpdateEventDocStatus
}) {
  const [activeDocType, setActiveDocType] = useState('flyer'); // flyer, invitation, attendance, report, thankyou
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null);
  const fileInputRef = useRef(null);

  const currentEvent = events.find(e => e.id === selectedEventId) || events[0];

  if (!currentEvent) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h3>No event found.</h3>
      </div>
    );
  }

  const docTabs = [
    { id: 'flyer', label: '1. Event Flyer', icon: ImageIcon, docKey: 'flyer', bucket: 'event-flyers', ext: 'pdf' },
    { id: 'invitation', label: '2. Invitation Letter', icon: Mail, docKey: 'invitationLetter', bucket: 'event-documents', ext: 'pdf' },
    { id: 'attendance', label: '3. Attendance Sheet', icon: ClipboardList, docKey: 'attendanceSheet', bucket: 'event-documents', ext: 'pdf' },
    { id: 'report', label: '4. Activity Report', icon: Award, docKey: 'activityReport', bucket: 'event-documents', ext: 'pdf' },
    { id: 'thankyou', label: '5. Thank-You Letter', icon: HeartHandshake, docKey: 'thankYouLetter', bucket: 'event-documents', ext: 'pdf' },
  ];

  const currentTabConfig = docTabs.find(t => t.id === activeDocType) || docTabs[0];
  const activeDocData = currentEvent.documents?.[currentTabConfig.docKey];

  const handlePrint = () => {
    window.print();
  };

  const getDocStatus = (key) => {
    return currentEvent.documents?.[key]?.status || 'Not Generated';
  };

  const isDocGenerated = (key) => {
    return !!currentEvent.documents?.[key]?.generated;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadMessage(null);

    try {
      const bucket = currentTabConfig.bucket;
      const filePath = `${currentEvent.id}/${currentTabConfig.id}_${Date.now()}_${file.name}`;
      
      await documentsService.uploadFile(bucket, filePath, file);
      await documentsService.recordDocumentUpload(
        currentEvent.id, 
        currentTabConfig.id === 'invitation' ? 'invitation_letter' :
        currentTabConfig.id === 'attendance' ? 'attendance_sheet' :
        currentTabConfig.id === 'report' ? 'activity_report' :
        currentTabConfig.id === 'thankyou' ? 'thank_you_letter' : 'flyer',
        file.name,
        filePath,
        { size: file.size, type: file.type }
      );

      // Transition document status to submitted/pending review
      onUpdateEventDocStatus(currentEvent.id, currentTabConfig.docKey, 'Submitted');
      setUploadMessage(`Uploaded "${file.name}" to Supabase Storage (${bucket})!`);
      setTimeout(() => setUploadMessage(null), 4000);
    } catch (err) {
      console.error('File upload failed:', err);
      setUploadMessage('Upload failed: ' + (err.message || 'Check storage permissions'));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Event Selection & Context Header (Reference Institutional Banner) */}
      <div className="card no-print" style={{
        background: '#ffffff',
        border: '1px solid var(--border-subtle)',
        borderLeft: '5px solid var(--brand-maroon)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '1.5rem 1.75rem'
      }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-info">{currentEvent.category}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>ID: {currentEvent.id}</span>
            <span className={`badge ${
              currentEvent.status === 'Completed' ? 'badge-success' : 'badge-warning'
            }`}>
              {currentEvent.status}
            </span>
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827' }}>
            {currentEvent.title}
          </h2>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            fontSize: '0.8125rem',
            color: 'var(--text-muted)',
            marginTop: '0.4rem',
            flexWrap: 'wrap'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Calendar size={14} color="var(--brand-maroon)" /> {currentEvent.date} ({currentEvent.startTime})
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <User size={14} color="var(--brand-maroon)" /> Resource Person: <strong>{currentEvent.speaker.name}</strong> ({currentEvent.speaker.organization})
            </span>
            <span>
              Coordinator: <strong>{currentEvent.facultyCoordinator}</strong>
            </span>
          </div>
        </div>

        {/* Event Switcher Dropdown */}
        <div style={{ minWidth: '240px' }}>
          <label className="form-label" style={{ fontWeight: 600 }}>Switch Active Event:</label>
          <select 
            className="form-select"
            value={currentEvent.id}
            onChange={(e) => setSelectedEventId(e.target.value)}
            style={{ height: '38px' }}
          >
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>
                {ev.id}: {ev.title.substring(0, 32)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Document Tab Selector (Styled like reference tabs) */}
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
                background: isActive ? '#ffffff' : '#f9fafb',
                border: `1.5px solid ${isActive ? 'var(--brand-maroon)' : 'var(--border-subtle)'}`,
                borderBottom: isActive ? '3px solid var(--brand-maroon)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'var(--brand-maroon)' : 'var(--text-muted)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                boxShadow: isActive ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: isActive ? 700 : 600, fontSize: '0.875rem' }}>
                  <Icon size={16} color={isActive ? 'var(--brand-maroon)' : 'var(--text-subtle)'} />
                  {tab.label}
                </div>
                {isDone ? (
                  <CheckCircle2 size={15} color="#059669" />
                ) : (
                  <Clock size={15} color="#d97706" />
                )}
              </div>
              <div style={{ fontSize: '0.72rem', color: isDone ? '#059669' : '#d97706', fontWeight: 600 }}>
                Status: {status}
              </div>
            </button>
          );
        })}
      </div>

      {/* Supabase Storage & Review Status Bar */}
      <div className="card no-print" style={{
        padding: '0.85rem 1.25rem',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Active Document: <strong style={{ color: '#111827' }}>{currentTabConfig.label}</strong>
          </span>
          <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
            Supabase Bucket: {currentTabConfig.bucket}
          </span>
          {activeDocData?.storagePath && (
            <span style={{ fontSize: '0.75rem', color: '#0284c7', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <ExternalLink size={12} /> {activeDocData.storagePath.split('/').pop()}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            onChange={handleFileUpload} 
          />

          <button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={isUploading}
            className="btn btn-secondary btn-sm"
          >
            <Upload size={14} />
            {isUploading ? 'Uploading to Storage...' : 'Upload Signed Copy'}
          </button>

          {(currentUser.role === 'Faculty Coordinator' || currentUser.role === 'Admin') && (
            <button 
              onClick={() => onUpdateEventDocStatus(currentEvent.id, currentTabConfig.docKey, 'Pending Review')}
              className="btn btn-primary btn-sm"
            >
              Submit for HOD Sign-off
            </button>
          )}

          {uploadMessage && (
            <span style={{ fontSize: '0.785rem', color: '#059669', fontWeight: 600 }}>
              {uploadMessage}
            </span>
          )}
        </div>
      </div>

      {/* Active Document Viewer */}
      <div style={{ marginTop: '0.25rem' }}>
        {activeDocType === 'flyer' && (
          <FlyerDocument event={currentEvent} onPrint={handlePrint} />
        )}
        {activeDocType === 'invitation' && (
          <InvitationLetter event={currentEvent} onPrint={handlePrint} />
        )}
        {activeDocType === 'attendance' && (
          <AttendanceSheet 
            event={currentEvent} 
            events={events}
            onSelectEvent={setSelectedEventId}
            currentUser={currentUser}
            onUpdateEventDocStatus={onUpdateEventDocStatus}
            onPrint={handlePrint} 
          />
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

export default DocumentCentre;
