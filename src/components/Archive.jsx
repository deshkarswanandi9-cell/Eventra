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
  ExternalLink
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArchiveIcon size={22} color="#818cf8" />
            <h2 style={{ fontSize: '1.5rem' }}>Centralized Digital Event Archive</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Permanent repository of accredited departmental events, digital dossiers, and signed artifacts.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '1.25rem', background: '#111827' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search archive by keyword, topic, resource person or coordinator..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="form-input" 
              style={{ paddingLeft: '36px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Year:</span>
            <select className="form-select" style={{ width: 'auto' }} value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              <option value="ALL">All Academic Years</option>
              <option value="2026-2027">2026-2027</option>
              <option value="2025-2026">2025-2026</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Semester:</span>
            <select className="form-select" style={{ width: 'auto' }} value={selectedSem} onChange={(e) => setSelectedSem(e.target.value)}>
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
              className="card card-hover"
              style={{
                background: '#131c2e',
                border: `1px solid ${isExpanded ? 'rgba(99, 102, 241, 0.4)' : 'var(--border-subtle)'}`,
                padding: 0,
                overflow: 'hidden'
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
                  background: isExpanded ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
                onClick={() => setExpandedFolder(isExpanded ? null : evt.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: isExpanded ? 'linear-gradient(135deg, #4f46e5, #06b6d4)' : '#1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Folder size={22} color={isExpanded ? '#ffffff' : '#818cf8'} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>{evt.id}</span>
                      <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{evt.category}</span>
                      <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>{evt.status}</span>
                    </div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginTop: '0.2rem' }}>
                      {evt.title}
                    </h3>
                    <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Date: {evt.date} • Speaker: <strong>{evt.speaker.name}</strong> ({evt.speaker.organization}) • Coord: {evt.facultyCoordinator}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {isExpanded ? 'Hide Dossier ▲' : 'Open Dossier ▼'}
                  </span>
                </div>
              </div>

              {/* Dossier Contents / Artifacts */}
              {isExpanded && (
                <div style={{
                  padding: '1.25rem 1.5rem 1.5rem 1.5rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  background: 'rgba(0, 0, 0, 0.2)'
                }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.85rem', textTransform: 'uppercase' }}>
                    Document Dossier & Artifact Files:
                  </div>

                  <div className="grid-3" style={{ gap: '0.75rem' }}>
                    {/* Flyer */}
                    <div 
                      onClick={() => onSelectEventAndDoc(evt.id, 'flyer')}
                      style={{
                        background: '#182238',
                        padding: '0.85rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <ImageIcon size={18} color="#818cf8" />
                        <div>
                          <div style={{ fontSize: '0.825rem', fontWeight: 600 }}>1. Event Flyer.pdf</div>
                          <div style={{ fontSize: '0.68rem', color: '#10b981' }}>✓ High Resolution</div>
                        </div>
                      </div>
                      <Eye size={15} color="var(--text-muted)" />
                    </div>

                    {/* Invitation Letter */}
                    <div 
                      onClick={() => onSelectEventAndDoc(evt.id, 'invitation')}
                      style={{
                        background: '#182238',
                        padding: '0.85rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <FileText size={18} color="#06b6d4" />
                        <div>
                          <div style={{ fontSize: '0.825rem', fontWeight: 600 }}>2. Invitation Letter.pdf</div>
                          <div style={{ fontSize: '0.68rem', color: '#10b981' }}>Ref: {evt.documents?.invitationLetter?.refNo || 'Generated'}</div>
                        </div>
                      </div>
                      <Eye size={15} color="var(--text-muted)" />
                    </div>

                    {/* Attendance Sheet */}
                    <div 
                      onClick={() => onSelectEventAndDoc(evt.id, 'attendance')}
                      style={{
                        background: '#182238',
                        padding: '0.85rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <FileText size={18} color="#34d399" />
                        <div>
                          <div style={{ fontSize: '0.825rem', fontWeight: 600 }}>3. Attendance Sheet.pdf</div>
                          <div style={{ fontSize: '0.68rem', color: '#10b981' }}>{evt.participants.actualAttended || 72} Verified Signatures</div>
                        </div>
                      </div>
                      <Eye size={15} color="var(--text-muted)" />
                    </div>

                    {/* Activity Report */}
                    <div 
                      onClick={() => onSelectEventAndDoc(evt.id, 'report')}
                      style={{
                        background: '#182238',
                        padding: '0.85rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <FileText size={18} color="#f59e0b" />
                        <div>
                          <div style={{ fontSize: '0.825rem', fontWeight: 600 }}>4. Activity Report (Dossier).pdf</div>
                          <div style={{ fontSize: '0.68rem', color: '#38bdf8' }}>NBA/NAAC Mapped</div>
                        </div>
                      </div>
                      <Eye size={15} color="var(--text-muted)" />
                    </div>

                    {/* Thank You Letter */}
                    <div 
                      onClick={() => onSelectEventAndDoc(evt.id, 'thankyou')}
                      style={{
                        background: '#182238',
                        padding: '0.85rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <FileText size={18} color="#ec4899" />
                        <div>
                          <div style={{ fontSize: '0.825rem', fontWeight: 600 }}>5. Thank-You Letter.pdf</div>
                          <div style={{ fontSize: '0.68rem', color: '#10b981' }}>Signed & Dispatched</div>
                        </div>
                      </div>
                      <Eye size={15} color="var(--text-muted)" />
                    </div>

                    {/* Photographs Directory */}
                    <div 
                      style={{
                        background: '#182238',
                        padding: '0.85rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <ImageIcon size={18} color="#a855f7" />
                        <div>
                          <div style={{ fontSize: '0.825rem', fontWeight: 600 }}>Event Photographs Folder/</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                            {evt.eventPhotos?.length || 2} Geotagged high-res images
                          </div>
                        </div>
                      </div>
                      <CheckCircle2 size={15} color="#10b981" />
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
