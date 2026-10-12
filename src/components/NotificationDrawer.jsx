import React from 'react';
import { X, Bell, CheckCircle2, AlertTriangle, Info, Clock, ExternalLink } from 'lucide-react';

export function NotificationDrawer({ 
  isOpen, 
  onClose, 
  notifications, 
  onMarkAllRead,
  onSelectEvent
}) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(4px)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end'
    }} onClick={onClose}>
      <div 
        style={{
          width: '100%',
          maxWidth: '420px',
          height: '100%',
          background: '#111827',
          borderLeft: '1px solid var(--border-subtle)',
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeIn 0.2s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#151e30'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Bell size={20} color="#818cf8" />
            <h3 style={{ fontSize: '1.1rem' }}>Notifications & Alerts</h3>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.25rem'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Action Bar */}
        <div style={{
          padding: '0.75rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
          background: 'rgba(0, 0, 0, 0.2)'
        }}>
          <span style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>
            {notifications.filter(n => n.unread).length} Unread Alerts
          </span>
          <button 
            onClick={onMarkAllRead}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
          >
            Mark all read
          </button>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              No notifications at the moment.
            </div>
          ) : (
            notifications.map(n => (
              <div 
                key={n.id}
                style={{
                  background: n.unread ? '#1a243b' : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${n.unread ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.05)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  marginBottom: '0.75rem',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease'
                }}
                onClick={() => {
                  if (n.eventId) {
                    onSelectEvent(n.eventId);
                    onClose();
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ marginTop: '0.15rem' }}>
                    {n.type === 'warning' && <AlertTriangle size={18} color="#f59e0b" />}
                    {n.type === 'info' && <Info size={18} color="#3b82f6" />}
                    {n.type === 'success' && <CheckCircle2 size={18} color="#10b981" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: n.unread ? '#ffffff' : 'var(--text-muted)' }}>
                        {n.title}
                      </h4>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={11} />
                        {n.timestamp}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem', lineHeight: 1.4 }}>
                      {n.message}
                    </p>
                    <div style={{ 
                      marginTop: '0.5rem', 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
                        For: {n.targetRole}
                      </span>
                      {n.eventId && (
                        <span style={{ fontSize: '0.72rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          View event <ExternalLink size={12} />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
