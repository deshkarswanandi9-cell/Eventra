import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Award, Sparkles, Printer, Palette, QrCode } from 'lucide-react';

export function FlyerDocument({ event, onPrint }) {
  const [theme, setTheme] = useState('indigo'); // indigo, emerald, ruby, dark

  const themeStyles = {
    indigo: {
      bg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #0f172a 100%)',
      accent: '#6366f1',
      accentLight: '#a5b4fc',
      badgeBg: 'rgba(99, 102, 241, 0.25)',
      cardBorder: 'rgba(165, 180, 252, 0.3)'
    },
    emerald: {
      bg: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #022c22 100%)',
      accent: '#10b981',
      accentLight: '#6ee7b7',
      badgeBg: 'rgba(16, 185, 129, 0.25)',
      cardBorder: 'rgba(110, 231, 183, 0.3)'
    },
    ruby: {
      bg: 'linear-gradient(135deg, #881337 0%, #9f1239 40%, #4c0519 100%)',
      accent: '#f43f5e',
      accentLight: '#fda4af',
      badgeBg: 'rgba(244, 63, 94, 0.25)',
      cardBorder: 'rgba(253, 164, 175, 0.3)'
    },
    dark: {
      bg: 'linear-gradient(135deg, #090d16 0%, #1e293b 50%, #0f172a 100%)',
      accent: '#38bdf8',
      accentLight: '#bae6fd',
      badgeBg: 'rgba(56, 189, 248, 0.2)',
      cardBorder: 'rgba(56, 189, 248, 0.3)'
    }
  };

  const curTheme = themeStyles[theme];

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Palette size={16} color="var(--text-muted)" />
          <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>Flyer Theme:</span>
          {(['indigo', 'emerald', 'ruby', 'dark']).map(t => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`btn btn-sm ${theme === t ? 'btn-primary' : 'btn-secondary'}`}
              style={{ textTransform: 'capitalize', padding: '0.2rem 0.65rem', fontSize: '0.75rem' }}
            >
              {t}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={onPrint} className="btn btn-primary btn-sm">
            <Printer size={15} />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Printable Flyer Container */}
      <div 
        className="print-document-container"
        style={{
          width: '100%',
          maxWidth: '820px',
          margin: '0 auto',
          background: curTheme.bg,
          borderRadius: '16px',
          border: `2px solid ${curTheme.cardBorder}`,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
          color: '#ffffff',
          overflow: 'hidden',
          position: 'relative',
          padding: '2.5rem'
        }}
      >
        {/* Subtle decorative circles */}
        <div style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          background: curTheme.accent,
          filter: 'blur(90px)',
          opacity: 0.25,
          pointerEvents: 'none'
        }} />

        {/* Institution & Department Header */}
        <div style={{
          textAlign: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          paddingBottom: '1.25rem',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            fontFamily: 'var(--font-formal)', 
            fontSize: '1rem', 
            letterSpacing: '0.15em', 
            color: curTheme.accentLight,
            textTransform: 'uppercase',
            fontWeight: 700 
          }}>
            COLLEGE OF ENGINEERING & TECHNOLOGY
          </div>
          <div style={{ 
            fontSize: '1.45rem', 
            fontWeight: 800, 
            letterSpacing: '0.04em',
            margin: '0.25rem 0',
            color: '#ffffff'
          }}>
            DEPARTMENT OF COMPUTER ENGINEERING
          </div>
          <div style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: curTheme.badgeBg,
            border: `1px solid ${curTheme.cardBorder}`,
            borderRadius: '999px',
            padding: '0.25rem 1rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: curTheme.accentLight,
            marginTop: '0.5rem'
          }}>
            <Sparkles size={14} />
            Organized by: {event.organizingBody} • Academic Year {event.academicYear}
          </div>
        </div>

        {/* Category Pill & Main Event Title */}
        <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
          <span style={{
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            fontSize: '0.85rem',
            fontWeight: 800,
            color: curTheme.accentLight,
            display: 'block',
            marginBottom: '0.5rem'
          }}>
            — {event.category.toUpperCase()} —
          </span>
          <h1 style={{
            fontSize: '2.2rem',
            fontWeight: 800,
            lineHeight: 1.25,
            color: '#ffffff',
            maxWidth: '740px',
            margin: '0 auto',
            textShadow: '0 2px 10px rgba(0,0,0,0.4)'
          }}>
            {event.title}
          </h1>
        </div>

        {/* Speaker Profile Card */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.35)',
          backdropFilter: 'blur(8px)',
          border: `1px solid ${curTheme.cardBorder}`,
          borderRadius: '14px',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          <img 
            src={event.speaker.photo} 
            alt={event.speaker.name}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: `3px solid ${curTheme.accent}`,
              boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
            }}
          />
          <div style={{ flex: 1, minWidth: '220px' }}>
            <span style={{
              fontSize: '0.72rem',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontWeight: 700,
              color: curTheme.accentLight
            }}>
              Distinguished Resource Speaker
            </span>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', marginTop: '0.1rem' }}>
              {event.speaker.name}
            </div>
            <div style={{ fontSize: '0.925rem', color: curTheme.accentLight, fontWeight: 600 }}>
              {event.speaker.designation} • {event.speaker.organization}
            </div>
            <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.4rem', lineHeight: 1.4 }}>
              {event.speaker.profile}
            </p>
          </div>
        </div>

        {/* Schedule & Venue Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <Calendar size={24} color={curTheme.accentLight} />
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#94a3b8' }}>Event Date</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{event.date}</div>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <Clock size={24} color={curTheme.accentLight} />
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#94a3b8' }}>Time & Duration</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{event.startTime} ({event.duration})</div>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <MapPin size={24} color={curTheme.accentLight} />
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#94a3b8' }}>Venue / Mode</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{event.venue}</div>
            </div>
          </div>
        </div>

        {/* Highlights / Objectives */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.25)',
          borderRadius: '12px',
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: curTheme.accentLight, marginBottom: '0.6rem' }}>
            KEY SESSION HIGHLIGHTS & OBJECTIVES:
          </div>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.6 }}>
            {event.objectives.map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>
        </div>

        {/* Target Audience & QR Code Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Target Participants</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
              Students of {event.participants.targetYears.join(', ')} ({event.participants.divisions.join(', ')})
            </div>
            <div style={{ fontSize: '0.78rem', color: curTheme.accentLight, marginTop: '0.2rem' }}>
              Free Registration • Certificate of Participation Provided
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '0.5rem 1rem',
            borderRadius: '10px'
          }}>
            <QrCode size={40} color="#ffffff" />
            <div style={{ fontSize: '0.75rem', lineHeight: 1.3 }}>
              <div style={{ fontWeight: 700 }}>Scan to Register</div>
              <div style={{ color: '#94a3b8' }}>Portal: eventra.ce.edu</div>
            </div>
          </div>
        </div>

        {/* Footer Signatures / Coordinators */}
        <div style={{
          marginTop: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.825rem',
          textAlign: 'center',
          paddingTop: '1rem',
          borderTop: '1px dashed rgba(255, 255, 255, 0.1)'
        }}>
          <div>
            <div style={{ fontWeight: 700 }}>{event.facultyCoordinator}</div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Faculty Coordinator</div>
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>{event.activityCoordinator}</div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Activity Coordinator</div>
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>{event.adminSupervisor}</div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Head of Department</div>
          </div>
        </div>
      </div>
    </div>
  );
}
