import React, { useState } from 'react';
import { Printer, CheckCircle, XCircle, Users, Download, Filter } from 'lucide-react';
import { INITIAL_STUDENTS } from '../../data/mockData';

export function AttendanceSheet({ event, onPrint }) {
  // Filter students based on event's target years or allow full roster
  const [selectedDiv, setSelectedDiv] = useState('ALL');
  const [attendance, setAttendance] = useState(() => {
    const init = {};
    INITIAL_STUDENTS.forEach((s, idx) => {
      // By default mark present for realistic preloaded data or event attendees
      init[s.id] = idx < 13;
    });
    return init;
  });

  const toggleStudent = (id) => {
    setAttendance(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const markAll = (status) => {
    const updated = {};
    INITIAL_STUDENTS.forEach(s => {
      updated[s.id] = status;
    });
    setAttendance(updated);
  };

  const filteredStudents = INITIAL_STUDENTS.filter(s => {
    if (selectedDiv === 'ALL') return true;
    return `${s.year}-${s.division}` === selectedDiv;
  });

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const totalCount = INITIAL_STUDENTS.length;
  const percentage = Math.round((presentCount / totalCount) * 100);

  const exportCSV = () => {
    let csv = "Sr No,Roll Number,Student Name,Year,Division,Status\n";
    filteredStudents.forEach((s, i) => {
      csv += `${i + 1},"${s.rollNo}","${s.name}","${s.year}","${s.division}","${attendance[s.id] ? 'Present' : 'Absent'}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Attendance_${event.id}_${event.title.substring(0, 15)}.csv`;
    a.click();
  };

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Filter size={15} color="var(--text-muted)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Class:</span>
            <select
              value={selectedDiv}
              onChange={(e) => setSelectedDiv(e.target.value)}
              className="form-select"
              style={{ width: 'auto', padding: '0.3rem 0.6rem', fontSize: '0.785rem' }}
            >
              <option value="ALL">All Divisions (TE & BE)</option>
              <option value="TE-A">TE - Division A</option>
              <option value="TE-B">TE - Division B</option>
              <option value="BE-A">BE - Division A</option>
              <option value="BE-B">BE - Division B</option>
            </select>
          </div>

          <button onClick={() => markAll(true)} className="btn btn-secondary btn-sm">
            <CheckCircle size={14} color="#10b981" />
            Mark All Present
          </button>

          <button onClick={() => markAll(false)} className="btn btn-secondary btn-sm">
            <XCircle size={14} color="#ef4444" />
            Clear
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={exportCSV} className="btn btn-secondary btn-sm">
            <Download size={14} />
            Export CSV
          </button>
          <button onClick={onPrint} className="btn btn-primary btn-sm">
            <Printer size={15} />
            Print Official Sheet
          </button>
        </div>
      </div>

      {/* Printable Sheet */}
      <div 
        className="print-document-container"
        style={{
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto',
          background: '#ffffff',
          color: '#0f172a',
          borderRadius: '4px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
          padding: '2.5rem 3rem',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}
      >
        {/* Header */}
        <div style={{
          textAlign: 'center',
          borderBottom: '2px solid #1e293b',
          paddingBottom: '1rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ fontSize: '14pt', fontWeight: 'bold', textTransform: 'uppercase' }}>
            COLLEGE OF ENGINEERING & TECHNOLOGY
          </div>
          <div style={{ fontSize: '11pt', fontWeight: 'bold', color: '#1e3a8a', margin: '2px 0' }}>
            DEPARTMENT OF COMPUTER ENGINEERING
          </div>
          <div style={{ fontSize: '12pt', fontWeight: 'bold', textDecoration: 'underline', marginTop: '4px' }}>
            OFFICIAL STUDENT ATTENDANCE RECORD
          </div>
        </div>

        {/* Event Meta Box */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #cbd5e1',
          padding: '0.75rem 1rem',
          marginBottom: '1.25rem',
          fontSize: '9.5pt',
          lineHeight: 1.5
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
            <div><strong>Activity / Event Title:</strong> {event.title}</div>
            <div><strong>Category:</strong> {event.category}</div>
            <div><strong>Resource Person:</strong> {event.speaker.name} ({event.speaker.organization})</div>
            <div><strong>Academic Year / Sem:</strong> {event.academicYear} / {event.semester}</div>
            <div><strong>Date & Time:</strong> {event.date} at {event.startTime}</div>
            <div><strong>Venue / Mode:</strong> {event.venue} ({event.mode})</div>
            <div><strong>Faculty Coordinator:</strong> {event.facultyCoordinator}</div>
            <div><strong>Organizing Body:</strong> {event.organizingBody}</div>
          </div>
        </div>

        {/* Live Metrics Summary Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.4rem 0.75rem',
          background: '#f1f5f9',
          border: '1px solid #e2e8f0',
          marginBottom: '1rem',
          fontSize: '9pt',
          fontWeight: 600
        }}>
          <span>Showing: {filteredStudents.length} Students</span>
          <span style={{ color: '#047857' }}>Present: {presentCount} Students</span>
          <span style={{ color: '#b91c1c' }}>Absent: {totalCount - presentCount} Students</span>
          <span style={{ color: '#1e40af' }}>Attendance Rate: {percentage}%</span>
        </div>

        {/* Roster Table */}
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '9.5pt',
          textAlign: 'left'
        }}>
          <thead>
            <tr style={{ background: '#e2e8f0', borderTop: '1px solid #94a3b8', borderBottom: '2px solid #64748b' }}>
              <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', width: '6%', textAlign: 'center' }}>Sr No</th>
              <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', width: '16%' }}>Roll No</th>
              <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1' }}>Student Name</th>
              <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', width: '12%', textAlign: 'center' }}>Class/Div</th>
              <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', width: '14%', textAlign: 'center' }}>Status</th>
              <th style={{ padding: '6px 8px', border: '1px solid #cbd5e1', width: '22%', textAlign: 'center' }}>Student Signature</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s, idx) => {
              const isPresent = attendance[s.id];
              return (
                <tr key={s.id} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                  <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{idx + 1}</td>
                  <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontFamily: 'monospace', fontWeight: 600 }}>{s.rollNo}</td>
                  <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', fontWeight: 500 }}>{s.name}</td>
                  <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{s.year} - {s.division}</td>
                  <td style={{ padding: '4px 8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>
                    <button
                      onClick={() => toggleStudent(s.id)}
                      className="no-print"
                      style={{
                        padding: '2px 8px',
                        fontSize: '8pt',
                        fontWeight: 'bold',
                        borderRadius: '4px',
                        border: 'none',
                        cursor: 'pointer',
                        background: isPresent ? '#d1fae5' : '#fee2e2',
                        color: isPresent ? '#065f46' : '#991b1b'
                      }}
                    >
                      {isPresent ? '✓ Present' : '✗ Absent'}
                    </button>
                    <span className="only-print" style={{ fontWeight: 'bold', color: isPresent ? '#047857' : '#b91c1c' }}>
                      {isPresent ? 'P' : 'A'}
                    </span>
                  </td>
                  <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center', color: '#64748b', fontStyle: 'italic', fontSize: '8.5pt' }}>
                    {isPresent ? 'Verified (Signed)' : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Signatures */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '3.5rem',
          fontSize: '9.5pt',
          pageBreakInside: 'avoid'
        }}>
          <div style={{ textAlign: 'center', width: '220px' }}>
            <div style={{ borderTop: '1px solid #334155', paddingTop: '4px', fontWeight: 'bold' }}>
              {event.facultyCoordinator}
            </div>
            <div style={{ fontSize: '8.5pt', color: '#475569' }}>Faculty Coordinator</div>
          </div>

          <div style={{ textAlign: 'center', width: '220px' }}>
            <div style={{ borderTop: '1px solid #334155', paddingTop: '4px', fontWeight: 'bold' }}>
              {event.activityCoordinator}
            </div>
            <div style={{ fontSize: '8.5pt', color: '#475569' }}>Activity Coordinator</div>
          </div>

          <div style={{ textAlign: 'center', width: '220px' }}>
            <div style={{ borderTop: '1px solid #334155', paddingTop: '4px', fontWeight: 'bold' }}>
              {event.adminSupervisor}
            </div>
            <div style={{ fontSize: '8.5pt', color: '#475569' }}>Head of Department</div>
          </div>
        </div>
      </div>
    </div>
  );
}
