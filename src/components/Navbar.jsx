import React, { useState } from 'react';
import { 
  Building2, 
  Calendar, 
  FileText, 
  CheckSquare, 
  ShieldCheck, 
  Archive, 
  Bell, 
  PlusCircle, 
  UserCheck, 
  ChevronDown,
  Sparkles,
  Layers,
  LogOut
} from 'lucide-react';

export function Navbar({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  users, 
  setCurrentUser,
  notifications,
  unreadCount,
  onOpenNotifications,
  onCreateEvent,
  onLogout
}) {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  return (
    <header className="no-print" style={{
      background: 'rgba(11, 15, 25, 0.92)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0.75rem 1.5rem'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand & Department Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            cursor: 'pointer'
          }} onClick={() => setActiveTab('dashboard')}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(79, 70, 229, 0.4)'
            }}>
              <Layers size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ 
                  fontFamily: 'var(--font-heading)', 
                  fontWeight: 800, 
                  fontSize: '1.25rem',
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(90deg, #ffffff, #c7d2fe)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  EVENTRA
                </span>
                <span style={{
                  fontSize: '0.65rem',
                  background: 'rgba(79, 70, 229, 0.25)',
                  color: '#a5b4fc',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                  fontWeight: 700,
                  border: '1px solid rgba(99, 102, 241, 0.3)'
                }}>
                  CE DEPT
                </span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                College Activity & Doc Automation
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '0.3rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`btn btn-sm ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
          >
            <Calendar size={15} />
            Dashboard
          </button>

          <button 
            onClick={() => setActiveTab('create-event')}
            className={`btn btn-sm ${activeTab === 'create-event' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
          >
            <PlusCircle size={15} />
            Create Event
          </button>

          <button 
            onClick={() => setActiveTab('documents')}
            className={`btn btn-sm ${activeTab === 'documents' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
          >
            <FileText size={15} />
            Document Centre
          </button>

          <button 
            onClick={() => setActiveTab('tracker')}
            className={`btn btn-sm ${activeTab === 'tracker' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
          >
            <CheckSquare size={15} />
            Tracker
          </button>

          <button 
            onClick={() => setActiveTab('admin')}
            className={`btn btn-sm ${activeTab === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
          >
            <ShieldCheck size={15} />
            Admin Monitor
          </button>

          <button 
            onClick={() => setActiveTab('archive')}
            className={`btn btn-sm ${activeTab === 'archive' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
          >
            <Archive size={15} />
            Archive
          </button>
        </nav>

        {/* Right Side: Role Selector & Notifications */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Notification Button */}
          <button 
            onClick={onOpenNotifications}
            className="btn btn-secondary btn-sm"
            style={{ position: 'relative', padding: '0.5rem' }}
            title="Notifications & Alerts"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ef4444',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: 700,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Interactive Role Switcher */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: '#151e30',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.35rem 0.75rem',
                cursor: 'pointer',
                color: 'var(--text-main)',
                transition: 'all 0.2s ease'
              }}
            >
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{currentUser.name.split(' ')[1] || currentUser.name}</div>
                <div style={{ 
                  fontSize: '0.65rem', 
                  color: currentUser.role === 'Admin' ? '#f59e0b' : currentUser.role === 'Activity Coordinator' ? '#06b6d4' : '#818cf8',
                  fontWeight: 600
                }}>
                  {currentUser.role}
                </div>
              </div>
              <ChevronDown size={14} color="var(--text-muted)" />
            </button>

            {showRoleDropdown && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                width: '260px',
                background: '#131b2e',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
                zIndex: 100,
                padding: '0.5rem',
                animation: 'fadeIn 0.15s ease'
              }}>
                <div style={{ 
                  padding: '0.4rem 0.6rem', 
                  fontSize: '0.72rem', 
                  fontWeight: 700, 
                  color: 'var(--text-subtle)',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                  marginBottom: '0.35rem'
                }}>
                  Switch Active Role Portal
                </div>
                {users.map(u => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setCurrentUser(u);
                      setShowRoleDropdown(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      width: '100%',
                      padding: '0.5rem 0.6rem',
                      background: currentUser.id === u.id ? 'rgba(79, 70, 229, 0.2)' : 'transparent',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      color: 'var(--text-main)',
                      textAlign: 'left',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => {
                      if (currentUser.id !== u.id) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      if (currentUser.id !== u.id) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <img 
                      src={u.avatar} 
                      alt={u.name} 
                      style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{u.name}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        {u.role}
                      </div>
                    </div>
                    {currentUser.id === u.id && (
                      <span style={{ fontSize: '0.7rem', color: '#818cf8', fontWeight: 700 }}>Active</span>
                    )}
                  </button>
                ))}

                <div style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  marginTop: '0.4rem',
                  paddingTop: '0.4rem'
                }}>
                  <button
                    onClick={() => {
                      setShowRoleDropdown(false);
                      onLogout();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      width: '100%',
                      padding: '0.5rem 0.6rem',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      color: '#f87171',
                      fontSize: '0.785rem',
                      fontWeight: 600
                    }}
                  >
                    <LogOut size={14} />
                    Sign Out of Portal
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Logout Button */}
          <button 
            onClick={onLogout}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.5rem', color: '#f87171' }}
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
