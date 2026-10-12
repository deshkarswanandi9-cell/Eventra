import React, { useState } from 'react';
import { Printer, Edit3, Check } from 'lucide-react';

export function ThankYouLetter({ event, onPrint }) {
  const [isEditing, setIsEditing] = useState(false);
  const [refNo, setRefNo] = useState(event.documents.thankYouLetter?.refNo || 'CO/TY/2026/042');
  const [letterDate, setLetterDate] = useState('2026-09-20');
  const [customGratitude, setCustomGratitude] = useState(
    'Your lucid explanations, real-world case scenarios from industry, and patient interaction during the student Q&A received unanimous praise and elevated the academic ambiance of our department.'
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Controls Bar */}
      <div className="no-print" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#151e30',
        padding: '0.75rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`btn btn-sm ${isEditing ? 'btn-success' : 'btn-secondary'}`}
          >
            {isEditing ? <Check size={15} /> : <Edit3 size={15} />}
            {isEditing ? 'Done Editing' : 'Customize Appreciation'}
          </button>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Status: <span className="badge badge-success">Official Template</span>
          </span>
        </div>

        <button onClick={onPrint} className="btn btn-primary btn-sm">
          <Printer size={15} />
          Print / Save PDF
        </button>
      </div>

      {/* Official Academic Letter Sheet */}
      <div 
        className="print-document-container"
        style={{
          width: '100%',
          maxWidth: '850px',
          margin: '0 auto',
          background: '#ffffff',
          color: '#1a202c',
          borderRadius: '4px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
          padding: '3rem 3.5rem',
          fontFamily: "'Times New Roman', Times, serif",
          lineHeight: 1.6,
          fontSize: '11pt',
          position: 'relative'
        }}
      >
        {/* Letterhead Header */}
        <div style={{
          textAlign: 'center',
          borderBottom: '2px solid #0f172a',
          paddingBottom: '1.25rem',
          marginBottom: '1.75rem'
        }}>
          <div style={{
            fontSize: '15pt',
            fontWeight: 'bold',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: '#0f172a'
          }}>
            COLLEGE OF ENGINEERING & TECHNOLOGY
          </div>
          <div style={{
            fontSize: '10pt',
            color: '#475569',
            margin: '2px 0'
          }}>
            (Approved by AICTE, New Delhi & Affiliated to State Technological University | NAAC 'A+' Accredited)
          </div>
          <div style={{
            fontSize: '13pt',
            fontWeight: 'bold',
            color: '#1e3a8a',
            marginTop: '4px',
            textTransform: 'uppercase'
          }}>
            DEPARTMENT OF COMPUTER ENGINEERING
          </div>
          <div style={{
            fontSize: '9pt',
            color: '#64748b'
          }}>
            Campus Knowledge City, Sector 4, Tech Park Road • Email: hod.comp@engg.edu • Web: www.engg.edu
          </div>
        </div>

        {/* Reference & Date Line */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          fontSize: '10.5pt',
          fontWeight: 600
        }}>
          <div>
            Ref. No.: {isEditing ? (
              <input 
                type="text" 
                value={refNo} 
                onChange={(e) => setRefNo(e.target.value)}
                style={{ padding: '2px 6px', fontSize: '10.5pt', border: '1px solid #94a3b8' }}
              />
            ) : (
              <span>{refNo}</span>
            )}
          </div>
          <div>
            Date: {isEditing ? (
              <input 
                type="date" 
                value={letterDate} 
                onChange={(e) => setLetterDate(e.target.value)}
                style={{ padding: '2px 6px', fontSize: '10.5pt', border: '1px solid #94a3b8' }}
              />
            ) : (
              <span>{letterDate}</span>
            )}
          </div>
        </div>

        {/* Recipient Address */}
        <div style={{ marginBottom: '1.5rem', lineHeight: 1.4 }}>
          <div><strong>To,</strong></div>
          <div style={{ fontWeight: 'bold' }}>{event.speaker.name}</div>
          <div>{event.speaker.designation}</div>
          <div>{event.speaker.organization}</div>
          {event.speaker.email && <div>Email: {event.speaker.email}</div>}
        </div>

        {/* Subject Line */}
        <div style={{
          fontWeight: 'bold',
          marginBottom: '1.25rem',
          textDecoration: 'underline'
        }}>
          Subject: Letter of Heartfelt Appreciation & Gratitude for conducting {event.category} on "{event.title}"
        </div>

        {/* Salutation */}
        <div style={{ marginBottom: '1rem' }}>
          Dear {event.speaker.name.startsWith('Dr.') ? 'Dr. ' + event.speaker.name.replace('Dr. ', '') : 'Respected Sir/Madam'},
        </div>

        {/* Body Paragraphs */}
        <div style={{ textAlign: 'justify', marginBottom: '1rem' }}>
          On behalf of the faculty members and students of the Department of Computer Engineering, College of Engineering & Technology, we express our deepest sense of gratitude for gracing our department as the expert resource speaker on <strong>{event.date}</strong>.
        </div>

        <div style={{ textAlign: 'justify', marginBottom: '1rem' }}>
          Your insightful session on <strong>"{event.title}"</strong> provided our {event.participants.targetYears.join(', ')} undergraduate students with invaluable perspectives on industry workflows, architectural principles, and current enterprise standards.
        </div>

        <div style={{ textAlign: 'justify', marginBottom: '1.25rem' }}>
          {isEditing ? (
            <textarea
              value={customGratitude}
              onChange={(e) => setCustomGratitude(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '8px',
                fontFamily: 'inherit',
                fontSize: '11pt',
                border: '1px solid #94a3b8',
                borderRadius: '4px'
              }}
            />
          ) : (
            customGratitude
          )}
        </div>

        <div style={{ textAlign: 'justify', marginBottom: '1.5rem' }}>
          The feedback gathered from {event.participants.actualAttended || event.participants.expectedCount} participating students reflects high enthusiasm and a profound appreciation for your time and willingness to mentor aspiring engineers.
        </div>

        <div style={{ textAlign: 'justify', marginBottom: '2.5rem' }}>
          We look forward to sustained collaboration and inviting you to future departmental symposia and academic panels.
        </div>

        <div style={{ marginBottom: '2rem' }}>
          Warm regards and best wishes.
        </div>

        {/* Signatures */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginTop: '3.5rem',
          pageBreakInside: 'avoid'
        }}>
          <div style={{ textAlign: 'center', width: '220px' }}>
            <div style={{ height: '40px' }}></div>
            <div style={{ borderTop: '1px solid #334155', paddingTop: '4px', fontWeight: 'bold' }}>
              {event.facultyCoordinator}
            </div>
            <div style={{ fontSize: '9.5pt', color: '#475569' }}>
              Faculty Coordinator
            </div>
            <div style={{ fontSize: '9pt', color: '#64748b' }}>
              Dept. of Computer Engg.
            </div>
          </div>

          <div style={{ textAlign: 'center', width: '220px' }}>
            <div style={{ height: '40px' }}></div>
            <div style={{ borderTop: '1px solid #334155', paddingTop: '4px', fontWeight: 'bold' }}>
              {event.adminSupervisor}
            </div>
            <div style={{ fontSize: '9.5pt', color: '#475569' }}>
              Head of Department
            </div>
            <div style={{ fontSize: '9pt', color: '#64748b' }}>
              Dept. of Computer Engg.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
