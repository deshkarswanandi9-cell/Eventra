import React, { useState } from 'react';
import { 
  Archive as ArchiveIcon, 
  Search, 
  Folder, 
  FileText, 
  Calendar, 
  User, 
  Download, 
  Eye, 
  Image as ImageIcon,
  CheckCircle2,
  ExternalLink,
  GraduationCap
} from 'lucide-react';

export function Archive({ events, onSelectEventAndDoc }) {
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [selectedSem, setSelectedSem] = useState('ALL');
  const [expandedFolder, setExpandedFolder] = useState(events[0]?.id || null);

  const filtered = events.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
                        e.speaker.name.toLowerCase().includes(search.toLowerCase()) ||
                        e.facultyCoordinator.toLowerCase().includes(search.toLowerCase()) ||
                        e.id.toLowerCase().includes(search.toLowerCase());
    const matchYear = selectedYear === 'ALL' || e.academicYear === selectedYear;
    const matchSem = selectedSem === 'ALL' || e.semester.includes(selectedSem);
    return matchSearch && matchYear && matchSem;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'var(--brand-maroon-light)' }}>
              <ArchiveIcon size={24} color="var(--brand-maroon)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', color: '#111827' }}>Centralized Digital Event Archive</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Permanent repository of accredited departmental events, digital dossiers, and signed artifacts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '1.25rem', background: '#ffffff' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search archive by keyword, topic, resource person or coordinator..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="form-input" 
              style={{ paddingLeft: '38px', height: '38px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Year:</span>
            <select className="form-select" style={{ width: 'auto', height: '38px', padding: '0.35rem 0.75rem' }} value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              <option value="ALL">All Academic Years</option>
              <option value="2026-2027">2026-2027</option>
              <option value="2025-2026">2025-2026</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Semester:</span>
            <select className="form-select" style={{ width: 'auto', height: '38px', padding: '0.35rem 0.75rem' }} value={selectedSem} onChange={(e) => setSelectedSem(e.target.value)}>
              <option value="ALL">All Semesters</option>
              <option value="Odd">Odd Semester</option>
              <option value="Even">Even Semester</option>
            </select>
          </div>
        </div>
      </div>

      {/* Digital Event Folders List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.map(evt => {
          const isExpanded = expandedFolder === evt.id;

          return (
            <div 
              key={evt.id}
              className="card"
              style={{
                background: '#ffffff',
                border: `1px solid ${isExpanded ? 'var(--brand-maroon)' : 'var(--border-subtle)'}`,
                borderLeft: `5px solid ${isExpanded ? 'var(--brand-maroon)' : '#cbd5e1'}`,
                padding: 0,
                overflow: 'hidden',
                boxShadow: isExpanded ? 'var(--shadow-md)' : 'var(--shadow-sm)'
              }}
            >
              {/* Folder Row Header */}
              <div 
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  background: isExpanded ? 'var(--brand-maroon-light)' : 'transparent',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
                onClick={() => setExpandedFolder(isExpanded ? null : evt.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '8px',
                    background: isExpanded ? 'var(--brand-maroon)' : '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isExpanded ? '#ffffff' : 'var(--brand-maroon)'
                  }}>
                    <Folder size={22} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>{evt.id}</span>
                      <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{evt.category}</span>
                      <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>{evt.status}</span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', marginTop: '0.2rem' }}>
                      {evt.title}
                    </h3>
                    <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Date: {evt.date} • Speaker: <strong>{evt.speaker.name}</strong> ({evt.speaker.organization}) • Coordinator: {evt.facultyCoordinator}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--brand-maroon)', fontWeight: 600 }}>
                    {isExpanded ? 'Hide Dossier ▲' : 'Open Dossier ▼'}
                  </span>
                </div>
              </div>

              {/* Dossier Contents / Artifacts */}
              {isExpanded && (
                <div style={{
                  padding: '1.25rem 1.5rem 1.5rem 1.5rem',
                  borderTop: '1px solid var(--border-subtle)',
                  background: '#f8fafc'
                }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Accredited Artifacts & Document Suite:
                  </div>

                  <div className="grid-3" style={{ gap: '0.75rem' }}>
                    {/* Flyer */}
                    <div 
                      onClick={() => onSelectEventAndDoc(evt.id, 'flyer')}
                      style={{
                        background: '#ffffff',
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'border-color 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <ImageIcon size={18} color="var(--brand-maroon)" />
                        <div>
                          <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#111827' }}>1. Event Flyer.pdf</div>
                          <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>✓ High Resolution</div>
                        </div>
                      </div>
                      <Eye size={15} color="var(--text-subtle)" />
                    </div>

                    {/* Invitation Letter */}
                    <div 
                      onClick={() => onSelectEventAndDoc(evt.id, 'invitation')}
                      style={{
                        background: '#ffffff',
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <FileText size={18} color="#0284c7" />
                        <div>
                          <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#111827' }}>2. Invitation Letter.pdf</div>
                          <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>Ref: {evt.documents?.invitationLetter?.refNo || 'Generated'}</div>
                        </div>
                      </div>
                      <Eye size={15} color="var(--text-subtle)" />
                    </div>

                    {/* Attendance Sheet */}
                    <div 
                      onClick={() => onSelectEventAndDoc(evt.id, 'attendance')}
                      style={{
                        background: '#ffffff',
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <FileText size={18} color="#059669" />
                        <div>
                          <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#111827' }}>3. Attendance Sheet.pdf</div>
                          <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>{evt.participants.actualAttended || 72} Verified Records</div>
                        </div>
                      </div>
                      <Eye size={15} color="var(--text-subtle)" />
                    </div>

                    {/* Activity Report */}
                    <div 
                      onClick={() => onSelectEventAndDoc(evt.id, 'report')}
                      style={{
                        background: '#ffffff',
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <FileText size={18} color="var(--brand-maroon)" />
                        <div>
                          <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#111827' }}>4. Activity Report.pdf</div>
                          <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>NBA Criteria 3 & 5 Mapped</div>
                        </div>
                      </div>
                      <Eye size={15} color="var(--text-subtle)" />
                    </div>

                    {/* Thank You Letter */}
                    <div 
                      onClick={() => onSelectEventAndDoc(evt.id, 'thankyou')}
                      style={{
                        background: '#ffffff',
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <FileText size={18} color="#b45309" />
                        <div>
                          <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#111827' }}>5. Thank-You Letter.pdf</div>
                          <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>Signed & Dispatched</div>
                        </div>
                      </div>
                      <Eye size={15} color="var(--text-subtle)" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default Archive;
