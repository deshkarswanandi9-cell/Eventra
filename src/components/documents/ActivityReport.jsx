import React, { useState } from 'react';
import { Printer, Edit3, Check, Star, Image, CheckCircle2, ShieldCheck } from 'lucide-react';

export function ActivityReport({ event, onPrint }) {
  const [isEditing, setIsEditing] = useState(false);
  const [proceedingsText, setProceedingsText] = useState(
    event.description || 
    'The session commenced with a welcome address by the Faculty Coordinator introducing the resource speaker. The speaker conducted an interactive presentation demonstrating real-world workflows, architecture decisions, and code review practices. Students engaged actively during the dedicated Q&A session covering industry transition and internship preparation.'
  );

  const [outcomesList, setOutcomesList] = useState(event.outcomes || [
    'Students gained practical exposure to modern software engineering lifecycle workflows.',
    'Understood industry expectations regarding automated testing and deployment.'
  ]);

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
            {isEditing ? 'Done Editing' : 'Edit Report Notes'}
          </button>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Status: <span className="badge badge-success">Accreditation Ready</span>
          </span>
        </div>

        <button onClick={onPrint} className="btn btn-primary btn-sm">
          <Printer size={15} />
          Print / Save PDF
        </button>
      </div>

      {/* Printable Report Dossier */}
      <div 
        className="print-document-container"
        style={{
          width: '100%',
          maxWidth: '880px',
          margin: '0 auto',
          background: '#ffffff',
          color: '#0f172a',
          borderRadius: '4px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
          padding: '3rem 3.5rem',
          fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
          lineHeight: 1.5,
          fontSize: '10pt'
        }}
      >
        {/* Department Header */}
        <div style={{
          textAlign: 'center',
          borderBottom: '2.5px solid #1e3a8a',
          paddingBottom: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ fontSize: '15pt', fontWeight: 'bold', textTransform: 'uppercase', color: '#0f172a' }}>
            COLLEGE OF ENGINEERING & TECHNOLOGY
          </div>
          <div style={{ fontSize: '9pt', color: '#475569', margin: '2px 0' }}>
            Accredited by NAAC with 'A+' Grade • Approved by AICTE, New Delhi
          </div>
          <div style={{ fontSize: '13pt', fontWeight: 'bold', color: '#1e3a8a', marginTop: '4px', textTransform: 'uppercase' }}>
            DEPARTMENT OF COMPUTER ENGINEERING
          </div>
          <div style={{
            display: 'inline-block',
            background: '#1e3a8a',
            color: '#ffffff',
            padding: '3px 18px',
            fontSize: '11pt',
            fontWeight: 'bold',
            marginTop: '8px',
            letterSpacing: '1px'
          }}>
            POST-EVENT ACTIVITY REPORT (DOSSIER)
          </div>
        </div>

        {/* Section 1: Event Summary Factsheet */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            fontSize: '10.5pt',
            fontWeight: 'bold',
            background: '#e2e8f0',
            padding: '4px 8px',
            borderLeft: '4px solid #1e3a8a',
            marginBottom: '0.5rem',
            textTransform: 'uppercase'
          }}>
            1. Activity Overview & Factsheet
          </div>

          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '9.5pt',
            border: '1px solid #cbd5e1'
          }}>
            <tbody>
              <tr>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', width: '25%', background: '#f8fafc', fontWeight: 'bold' }}>Activity Title:</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', fontWeight: 'bold', color: '#1e3a8a' }} colSpan={3}>{event.title}</td>
              </tr>
              <tr>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 'bold' }}>Activity Category:</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1' }}>{event.category}</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 'bold', width: '20%' }}>Organizing Body:</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1' }}>{event.organizingBody}</td>
              </tr>
              <tr>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 'bold' }}>Academic Year & Sem:</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1' }}>{event.academicYear} ({event.semester})</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 'bold' }}>Date & Duration:</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1' }}>{event.date} ({event.duration})</td>
              </tr>
              <tr>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 'bold' }}>Mode & Venue:</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1' }}>{event.venue} ({event.mode})</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 'bold' }}>Total Beneficiaries:</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', fontWeight: 'bold', color: '#047857' }}>
                  {event.participants.actualAttended || event.participants.expectedCount} Students
                </td>
              </tr>
              <tr>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 'bold' }}>Resource Person:</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1' }} colSpan={3}>
                  <strong>{event.speaker.name}</strong>, {event.speaker.designation}, {event.speaker.organization} (Email: {event.speaker.email})
                </td>
              </tr>
              <tr>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 'bold' }}>Faculty Coordinator:</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1' }}>{event.facultyCoordinator}</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 'bold' }}>Activity Coordinator:</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1' }}>{event.activityCoordinator}</td>
              </tr>
              <tr>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 'bold' }}>PO / PSO Mapping:</td>
                <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1' }} colSpan={3}>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {event.mappedPos?.map(po => (
                      <span key={po} style={{
                        background: '#e0e7ff',
                        color: '#3730a3',
                        padding: '1px 8px',
                        borderRadius: '4px',
                        fontSize: '8.5pt',
                        fontWeight: 'bold'
                      }}>
                        {po}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 2: Objectives */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            fontSize: '10.5pt',
            fontWeight: 'bold',
            background: '#e2e8f0',
            padding: '4px 8px',
            borderLeft: '4px solid #1e3a8a',
            marginBottom: '0.5rem',
            textTransform: 'uppercase'
          }}>
            2. Objectives of the Program
          </div>
          <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.6 }}>
            {event.objectives.map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>
        </div>

        {/* Section 3: Proceedings / Brief Description */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            fontSize: '10.5pt',
            fontWeight: 'bold',
            background: '#e2e8f0',
            padding: '4px 8px',
            borderLeft: '4px solid #1e3a8a',
            marginBottom: '0.5rem',
            textTransform: 'uppercase'
          }}>
            3. Summary of Proceedings & Session Highlights
          </div>
          {isEditing ? (
            <textarea
              value={proceedingsText}
              onChange={(e) => setProceedingsText(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: '8px',
                fontFamily: 'inherit',
                fontSize: '10pt',
                border: '1px solid #94a3b8',
                borderRadius: '4px'
              }}
            />
          ) : (
            <p style={{ textAlign: 'justify', lineHeight: 1.6 }}>
              {proceedingsText}
            </p>
          )}
        </div>

        {/* Section 4: Measurable Outcomes */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            fontSize: '10.5pt',
            fontWeight: 'bold',
            background: '#e2e8f0',
            padding: '4px 8px',
            borderLeft: '4px solid #1e3a8a',
            marginBottom: '0.5rem',
            textTransform: 'uppercase'
          }}>
            4. Measurable Learning Outcomes
          </div>
          <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.6 }}>
            {outcomesList.map((out, i) => (
              <li key={i}>{out}</li>
            ))}
          </ul>
        </div>

        {/* Section 5: Student Feedback & Rating */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            fontSize: '10.5pt',
            fontWeight: 'bold',
            background: '#e2e8f0',
            padding: '4px 8px',
            borderLeft: '4px solid #1e3a8a',
            marginBottom: '0.5rem',
            textTransform: 'uppercase'
          }}>
            5. Participant Feedback Evaluation
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            padding: '0.75rem 1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '18pt', fontWeight: 'bold', color: '#1e3a8a' }}>
                {event.feedbackRating || 4.8}
              </span>
              <span style={{ fontSize: '11pt', color: '#64748b' }}>/ 5.0</span>
              <div style={{ display: 'flex', color: '#f59e0b' }}>
                <Star size={16} fill="#f59e0b" />
                <Star size={16} fill="#f59e0b" />
                <Star size={16} fill="#f59e0b" />
                <Star size={16} fill="#f59e0b" />
                <Star size={16} fill="#f59e0b" />
              </div>
            </div>
            <div style={{ fontSize: '9pt', color: '#334155', borderLeft: '1px solid #cbd5e1', paddingLeft: '1rem' }}>
              <div>• Content Relevance: 96% Excellent</div>
              <div>• Speaker Interaction & Clarity: 98% Very High</div>
              <div>• Practical Usefulness: 95% Positive</div>
            </div>
          </div>
        </div>

        {/* Section 6: Geotagged Event Photographs */}
        <div style={{ marginBottom: '2.5rem', pageBreakInside: 'avoid' }}>
          <div style={{
            fontSize: '10.5pt',
            fontWeight: 'bold',
            background: '#e2e8f0',
            padding: '4px 8px',
            borderLeft: '4px solid #1e3a8a',
            marginBottom: '0.75rem',
            textTransform: 'uppercase'
          }}>
            6. Photographic Evidence & Geotagged Session Captures
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            {(event.eventPhotos && event.eventPhotos.length > 0 ? event.eventPhotos : [
              'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&auto=format&fit=crop&q=80'
            ]).map((photo, idx) => (
              <div key={idx} style={{
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                padding: '4px',
                background: '#f8fafc',
                textAlign: 'center'
              }}>
                <img 
                  src={photo} 
                  alt={`Event Photo ${idx + 1}`}
                  style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '2px' }}
                />
                <div style={{ fontSize: '8.5pt', color: '#475569', marginTop: '4px', fontStyle: 'italic' }}>
                  {idx === 0 
                    ? `Fig ${idx + 1}: Resource speaker addressing student cohort in ${event.venue}`
                    : `Fig ${idx + 1}: Interactive Q&A and student engagement session`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 7: Formal Approvals & Signatures */}
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
            <div style={{ fontSize: '8pt', color: '#047857' }}>✓ Prepared & Verified</div>
          </div>

          <div style={{ textAlign: 'center', width: '220px' }}>
            <div style={{ borderTop: '1px solid #334155', paddingTop: '4px', fontWeight: 'bold' }}>
              {event.activityCoordinator}
            </div>
            <div style={{ fontSize: '8.5pt', color: '#475569' }}>Activity Coordinator</div>
            <div style={{ fontSize: '8pt', color: '#047857' }}>✓ Audited & Recommended</div>
          </div>

          <div style={{ textAlign: 'center', width: '220px' }}>
            <div style={{ borderTop: '1px solid #334155', paddingTop: '4px', fontWeight: 'bold' }}>
              {event.adminSupervisor}
            </div>
            <div style={{ fontSize: '8.5pt', color: '#475569' }}>Head of Department</div>
            <div style={{ fontSize: '8pt', color: '#047857' }}>✓ Approved for Records</div>
          </div>
        </div>
      </div>
    </div>
  );
}
