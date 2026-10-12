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

        {/* Navigation Tabs - Filtered strictly by Coordinator Role */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '0.3rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          {/* Dashboard is visible to all coordinators */}
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`btn btn-sm ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
          >
            <Calendar size={15} />
            Dashboard
          </button>

          {/* Create Event is exclusive to Faculty Coordinators and Admin */}
          {(currentUser.role === 'Faculty Coordinator' || currentUser.role === 'Admin') && (
            <button 
              onClick={() => setActiveTab('create-event')}
              className={`btn btn-sm ${activeTab === 'create-event' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ border: 'none' }}
            >
              <PlusCircle size={15} />
              Create Event
            </button>
          )}

          {/* Document Centre is accessible to all */}
          <button 
            onClick={() => setActiveTab('documents')}
            className={`btn btn-sm ${activeTab === 'documents' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
          >
            <FileText size={15} />
            Document Centre
          </button>

          {/* Tracker is for Activity Coordinator and Admin */}
          {(currentUser.role === 'Activity Coordinator' || currentUser.role === 'Admin') && (
            <button 
              onClick={() => setActiveTab('tracker')}
              className={`btn btn-sm ${activeTab === 'tracker' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ border: 'none' }}
            >
              <CheckSquare size={15} />
              Tracker
            </button>
          )}

          {/* Admin Monitor is strictly for Admin (Head of Department) */}
          {currentUser.role === 'Admin' && (
            <button 
              onClick={() => setActiveTab('admin')}
              className={`btn btn-sm ${activeTab === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ border: 'none' }}
            >
              <ShieldCheck size={15} />
              Admin Monitor
            </button>
          )}

          {/* Archive is visible to all */}
          <button 
            onClick={() => setActiveTab('archive')}
            className={`btn btn-sm ${activeTab === 'archive' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
          >
            <Archive size={15} />
            Archive
          </button>
        </nav>

        {/* Right Side: Logged-in Profile Badge & Sign Out (No Role Switching) */}
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

          {/* Authenticated Coordinator Profile Info (Static Display - No Switcher) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: '#151e30',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.35rem 0.75rem'
            }}
          >
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{currentUser.name}</div>
              <div style={{ 
                fontSize: '0.65rem', 
                color: currentUser.role === 'Admin' ? '#f59e0b' : currentUser.role === 'Activity Coordinator' ? '#06b6d4' : '#818cf8',
                fontWeight: 700
              }}>
                {currentUser.role}
              </div>
            </div>
          </div>

          {/* Explicit Sign Out Action Button */}
          <button 
            onClick={onLogout}
            className="btn btn-secondary btn-sm"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.35rem', 
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              background: 'rgba(239, 68, 68, 0.08)'
            }}
            title="Sign Out of Portal"
          >
            <LogOut size={15} />
            <span style={{ fontSize: '0.785rem' }}>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
