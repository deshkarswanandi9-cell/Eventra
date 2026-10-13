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
  Layers, 
  LogOut, 
  Database,
  GraduationCap
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
  onLogout,
  isSupabaseConfigured
}) {
  return (
    <header className="no-print" style={{
      background: '#ffffff',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
    }}>
      {/* Top Institutional Header Bar */}
      <div style={{
        borderBottom: '1px solid #f1f5f9',
        padding: '0.65rem 1.5rem',
        background: '#ffffff'
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
          {/* Brand & Institutional Identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer'
              }} 
              onClick={() => setActiveTab('dashboard')}
            >
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                background: 'var(--brand-maroon)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 2px 6px rgba(138, 58, 58, 0.25)',
                flexShrink: 0
              }}>
                <GraduationCap size={24} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ 
                    fontFamily: 'var(--font-heading)', 
                    fontWeight: 800, 
                    fontSize: '1.25rem',
                    letterSpacing: '-0.02em',
                    color: 'var(--brand-maroon)'
                  }}>
                    EVENTRA
                  </span>
                  <span style={{
                    fontSize: '0.68rem',
                    background: 'var(--brand-maroon-light)',
                    color: 'var(--brand-maroon)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px',
                    fontWeight: 700,
                    border: '1px solid var(--brand-maroon-border)'
                  }}>
                    COMP ENGG
                  </span>
                  <span style={{
                    fontSize: '0.65rem',
                    padding: '0.12rem 0.45rem',
                    borderRadius: '4px',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    background: isSupabaseConfigured ? '#ecfdf5' : '#fffbeb',
                    color: isSupabaseConfigured ? '#065f46' : '#92400e',
                    border: `1px solid ${isSupabaseConfigured ? '#a7f3d0' : '#fde68a'}`
                  }} title={isSupabaseConfigured ? 'Connected to live Supabase database' : 'Demo local mode'}>
                    <Database size={10} />
                    {isSupabaseConfigured ? 'Supabase Live' : 'Local Fallback'}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 500 }}>
                  College Activity & Event Documentation Automation System
                </div>
              </div>
            </div>
          </div>

          {/* Right Header Controls: Notifications, User Profile Capsule & Sign Out */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Notification Bell Button */}
            <button 
              onClick={onOpenNotifications}
              className="btn btn-secondary btn-sm"
              style={{ 
                position: 'relative', 
                padding: '0.5rem',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}
              title="Notifications & Documentation Alerts"
            >
              <Bell size={18} color="#4b5563" />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: 'var(--brand-maroon)',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(138, 58, 58, 0.4)'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Authenticated Coordinator Profile Info Card */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '0.35rem 0.75rem'
              }}
            >
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #d1d5db' }}
              />
              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827' }}>
                  {currentUser.name}
                </div>
                <div style={{ 
                  fontSize: '0.6875rem', 
                  color: currentUser.role === 'Admin' ? '#b45309' : currentUser.role === 'Activity Coordinator' ? '#0369a1' : 'var(--brand-maroon)',
                  fontWeight: 700
                }}>
                  {currentUser.role}
                </div>
              </div>
            </div>

            {/* Sign Out Button */}
            <button 
              onClick={onLogout}
              className="btn btn-secondary btn-sm"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.35rem', 
                color: '#dc2626',
                borderColor: '#fecaca',
                background: '#fef2f2'
              }}
              title="Sign Out of Eventra"
            >
              <LogOut size={15} />
              <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs Bar (Styled in reference layout) */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0.35rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflowX: 'auto'
      }}>
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem'
        }}>
          {/* Dashboard */}
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`btn btn-sm ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ 
              borderRadius: '6px',
              border: activeTab === 'dashboard' ? '1px solid var(--brand-maroon)' : '1px solid transparent',
              background: activeTab === 'dashboard' ? 'var(--brand-maroon)' : 'transparent',
              color: activeTab === 'dashboard' ? '#ffffff' : '#4b5563',
              boxShadow: activeTab === 'dashboard' ? '0 1px 3px rgba(138, 58, 58, 0.25)' : 'none'
            }}
          >
            <Calendar size={15} />
            Dashboard
          </button>

          {/* Create Event (Faculty Coordinators & Admin) */}
          {(currentUser.role === 'Faculty Coordinator' || currentUser.role === 'Admin') && (
            <button 
              onClick={() => setActiveTab('create-event')}
              className={`btn btn-sm ${activeTab === 'create-event' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ 
                borderRadius: '6px',
                border: activeTab === 'create-event' ? '1px solid var(--brand-maroon)' : '1px solid transparent',
                background: activeTab === 'create-event' ? 'var(--brand-maroon)' : 'transparent',
                color: activeTab === 'create-event' ? '#ffffff' : '#4b5563',
                boxShadow: activeTab === 'create-event' ? '0 1px 3px rgba(138, 58, 58, 0.25)' : 'none'
              }}
            >
              <PlusCircle size={15} />
              Create Event
            </button>
          )}

          {/* Document Centre */}
          <button 
            onClick={() => setActiveTab('documents')}
            className={`btn btn-sm ${activeTab === 'documents' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ 
              borderRadius: '6px',
              border: activeTab === 'documents' ? '1px solid var(--brand-maroon)' : '1px solid transparent',
              background: activeTab === 'documents' ? 'var(--brand-maroon)' : 'transparent',
              color: activeTab === 'documents' ? '#ffffff' : '#4b5563',
              boxShadow: activeTab === 'documents' ? '0 1px 3px rgba(138, 58, 58, 0.25)' : 'none'
            }}
          >
            <FileText size={15} />
            Document Centre
          </button>

          {/* Tracker (Activity Coordinator & Admin) */}
          {(currentUser.role === 'Activity Coordinator' || currentUser.role === 'Admin') && (
            <button 
              onClick={() => setActiveTab('tracker')}
              className={`btn btn-sm ${activeTab === 'tracker' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ 
                borderRadius: '6px',
                border: activeTab === 'tracker' ? '1px solid var(--brand-maroon)' : '1px solid transparent',
                background: activeTab === 'tracker' ? 'var(--brand-maroon)' : 'transparent',
                color: activeTab === 'tracker' ? '#ffffff' : '#4b5563',
                boxShadow: activeTab === 'tracker' ? '0 1px 3px rgba(138, 58, 58, 0.25)' : 'none'
              }}
            >
              <CheckSquare size={15} />
              Lifecycle Tracker
            </button>
          )}

          {/* Admin Monitor (Admin strictly) */}
          {currentUser.role === 'Admin' && (
            <button 
              onClick={() => setActiveTab('admin')}
              className={`btn btn-sm ${activeTab === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ 
                borderRadius: '6px',
                border: activeTab === 'admin' ? '1px solid var(--brand-maroon)' : '1px solid transparent',
                background: activeTab === 'admin' ? 'var(--brand-maroon)' : 'transparent',
                color: activeTab === 'admin' ? '#ffffff' : '#4b5563',
                boxShadow: activeTab === 'admin' ? '0 1px 3px rgba(138, 58, 58, 0.25)' : 'none'
              }}
            >
              <ShieldCheck size={15} />
              Admin Governance
            </button>
          )}

          {/* Archive */}
          <button 
            onClick={() => setActiveTab('archive')}
            className={`btn btn-sm ${activeTab === 'archive' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ 
              borderRadius: '6px',
              border: activeTab === 'archive' ? '1px solid var(--brand-maroon)' : '1px solid transparent',
              background: activeTab === 'archive' ? 'var(--brand-maroon)' : 'transparent',
              color: activeTab === 'archive' ? '#ffffff' : '#4b5563',
              boxShadow: activeTab === 'archive' ? '0 1px 3px rgba(138, 58, 58, 0.25)' : 'none'
            }}
          >
            <Archive size={15} />
            Digital Archive
          </button>
        </nav>

        {/* Accreditation Readiness Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
          <span style={{ fontWeight: 600 }}>NBA / NAAC Criterion 3 & 5 Ready</span>
        </div>
      </div>
    </header>
  );
}
export default Navbar;
