import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { NotificationDrawer } from './components/NotificationDrawer';
import { Dashboard } from './components/Dashboard';
import { EventForm } from './components/EventForm';
import { DocumentCentre } from './components/DocumentCentre';
import { Tracker } from './components/Tracker';
import { AdminMonitoring } from './components/AdminMonitoring';
import { Archive } from './components/Archive';
import { Login } from './components/Login';
import { 
  INITIAL_USERS, 
  INITIAL_EVENTS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_AUDIT_LOGS 
} from './data/mockData';
import { eventsService } from './services/eventsService';
import { authService } from './services/authService';
import { notificationsService } from './services/notificationsService';
import { auditService } from './services/auditService';
import { isSupabaseConfigured } from './lib/supabase';

export function App() {
  // Persistent state with localStorage fallback
  const [users] = useState(INITIAL_USERS);
  
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('eventra_auth') === 'true';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUserId = localStorage.getItem('eventra_user_id');
    const found = INITIAL_USERS.find(u => u.id === savedUserId);
    return found || INITIAL_USERS[0]; // Prof. Vaishnavi Chitragar (Admin & Department Head)
  });

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('eventra_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('eventra_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('eventra_audit');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedEventId, setSelectedEventId] = useState('EVT-2026-001');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('eventra_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('eventra_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('eventra_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Load from Supabase on mount / when auth is active
  useEffect(() => {
    async function loadRemoteData() {
      if (isSupabaseConfigured) {
        setIsLoadingData(true);
        try {
          const [fetchedEvents, fetchedNotifs, fetchedLogs] = await Promise.all([
            eventsService.fetchEvents(),
            notificationsService.fetchNotifications(currentUser?.id, currentUser?.role),
            auditService.fetchAuditLogs()
          ]);

          if (fetchedEvents && fetchedEvents.length > 0) {
            setEvents(fetchedEvents);
            setSelectedEventId(fetchedEvents[0].id);
          }
          if (fetchedNotifs && fetchedNotifs.length > 0) {
            setNotifications(fetchedNotifs);
          }
          if (fetchedLogs && fetchedLogs.length > 0) {
            setAuditLogs(fetchedLogs);
          }
        } catch (err) {
          console.warn('Error loading initial data from Supabase:', err);
        } finally {
          setIsLoadingData(false);
        }
      }
    }

    loadRemoteData();
  }, [isAuthenticated, currentUser?.id, currentUser?.role]);

  // Supabase Auth listener
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((event, session, profile) => {
      if (session && profile) {
        setCurrentUser(profile);
        setIsAuthenticated(true);
        localStorage.setItem('eventra_auth', 'true');
        localStorage.setItem('eventra_user_id', profile.id);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        localStorage.removeItem('eventra_auth');
        localStorage.removeItem('eventra_user_id');
      }
    });

    return () => unsubscribe();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('eventra_auth', 'true');
    localStorage.setItem('eventra_user_id', user.id);

    // Audit log
    const log = {
      id: `audit_${Date.now()}`,
      user: user.name,
      role: user.role,
      action: 'User Signed In',
      details: `${user.name} authenticated into the ${user.role} portal.`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setAuditLogs(prev => [log, ...prev]);
    auditService.logAction({
      user: user.name,
      role: user.role,
      action: 'User Signed In',
      details: `${user.name} authenticated into the ${user.role} portal.`
    });

    // Landing view per role
    if (user.role === 'Activity Coordinator') {
      setActiveTab('tracker');
    } else {
      setActiveTab('dashboard');
    }

    showToast(`Welcome, ${user.name} (${user.role})!`);
  };

  // Route protection: prevent coordinators from accessing pages outside their permissions
  useEffect(() => {
    if (currentUser.role === 'Faculty Coordinator') {
      if (activeTab === 'admin' || activeTab === 'tracker') {
        setActiveTab('dashboard');
      }
    } else if (currentUser.role === 'Activity Coordinator') {
      if (activeTab === 'admin' || activeTab === 'create-event') {
        setActiveTab('tracker');
      }
    }
  }, [currentUser.role, activeTab]);

  const handleLogout = async () => {
    await authService.signOut();
    setIsAuthenticated(false);
    localStorage.removeItem('eventra_auth');
    localStorage.removeItem('eventra_user_id');
    showToast('Signed out of coordinator session.');
  };

  // Handlers
  const handleSaveEvent = async (newEvent) => {
    setEvents(prev => [newEvent, ...prev]);
    setSelectedEventId(newEvent.id);

    // Save to Supabase
    try {
      await eventsService.createEvent(newEvent, currentUser);
    } catch (err) {
      console.warn('Could not persist event in Supabase:', err.message);
    }
    
    // Create Audit Log
    const log = {
      id: `audit_${Date.now()}`,
      user: currentUser.name,
      role: currentUser.role,
      action: 'Created Event',
      details: `Created "${newEvent.title}" and auto-generated 5 official document templates.`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setAuditLogs(prev => [log, ...prev]);
    auditService.logAction({
      user: currentUser.name,
      role: currentUser.role,
      action: 'Created Event',
      entityType: 'event',
      entityId: newEvent.id,
      details: `Created "${newEvent.title}" and auto-generated 5 official document templates.`
    });

    // Create Notification
    const notif = {
      id: `notif_${Date.now()}`,
      targetRole: 'Activity Coordinator',
      recipient: 'Prof. Rajesh Verma',
      title: 'New Activity Registered',
      message: `${currentUser.name} registered "${newEvent.title}". Templates are initialized.`,
      type: 'info',
      timestamp: 'Just now',
      unread: true,
      eventId: newEvent.id
    };
    setNotifications(prev => [notif, ...prev]);
    notificationsService.createNotification(notif);

    showToast(`Event created! 5 document templates auto-generated for "${newEvent.title}".`);
    setActiveTab('documents');
  };

  const handleSelectEvent = (eventId) => {
    setSelectedEventId(eventId);
    setActiveTab('documents');
  };

  const handleSelectEventAndDoc = (eventId, docType) => {
    setSelectedEventId(eventId);
    setActiveTab('documents');
  };

  const handleSendReminder = (evt) => {
    const notif = {
      id: `notif_${Date.now()}`,
      targetRole: 'Faculty Coordinator',
      recipient: evt.facultyCoordinator,
      title: 'Urgent: Missing Activity Report',
      message: `Activity Coordinator Prof. Rajesh Verma requested submission of final report for "${evt.title}".`,
      type: 'warning',
      timestamp: 'Just now',
      unread: true,
      eventId: evt.id
    };
    setNotifications(prev => [notif, ...prev]);
    notificationsService.createNotification(notif);

    const log = {
      id: `audit_${Date.now()}`,
      user: currentUser.name,
      role: currentUser.role,
      action: 'Dispatched Reminder',
      details: `Sent reminder to ${evt.facultyCoordinator} for ${evt.id} report submission.`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setAuditLogs(prev => [log, ...prev]);
    auditService.logAction({
      user: currentUser.name,
      role: currentUser.role,
      action: 'Dispatched Reminder',
      entityType: 'notification',
      entityId: evt.id,
      details: `Sent reminder to ${evt.facultyCoordinator} for ${evt.id} report submission.`
    });

    showToast(`Reminder sent to ${evt.facultyCoordinator} for ${evt.id}!`);
  };

  const handleApproveDocument = async (eventId, docKey, decision) => {
    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        const updatedDocs = {
          ...evt.documents,
          [docKey]: {
            ...evt.documents[docKey],
            status: decision
          }
        };

        // Check if all docs are approved
        const allApproved = Object.values(updatedDocs).every(d => d.status === 'Approved');

        return {
          ...evt,
          documents: updatedDocs,
          status: allApproved ? 'Completed' : evt.status
        };
      }
      return evt;
    }));

    // Update in Supabase
    try {
      await eventsService.updateDocumentStatus(eventId, docKey, decision);
    } catch (err) {
      console.warn('Could not update doc status in Supabase:', err.message);
    }

    const log = {
      id: `audit_${Date.now()}`,
      user: currentUser.name,
      role: currentUser.role,
      action: decision === 'Approved' ? 'Approved Document' : 'Revision Requested',
      details: `${decision}: ${docKey} for event ${eventId} by ${currentUser.name}.`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setAuditLogs(prev => [log, ...prev]);
    auditService.logAction({
      user: currentUser.name,
      role: currentUser.role,
      action: decision === 'Approved' ? 'Approved Document' : 'Revision Requested',
      entityType: 'document',
      entityId: eventId,
      details: `${decision}: ${docKey} for event ${eventId} by ${currentUser.name}.`
    });

    showToast(`Document ${decision === 'Approved' ? 'Approved & Signed' : 'Sent back for revisions'}!`);
  };

  const handleMarkAllNotificationsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    await notificationsService.markAllRead(currentUser?.id, currentUser?.role);
  };

  const pendingApprovalsCount = events.reduce((count, evt) => {
    const pendingInEvt = Object.values(evt.documents || {}).filter(
      d => d.status === 'Pending Review' || d.status === 'In Review'
    ).length;
    return count + pendingInEvt;
  }, 0);

  // If not authenticated, render Login Interface
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {toastMessage && (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            color: '#ffffff',
            padding: '0.85rem 1.4rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #4f46e5',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            animation: 'fadeIn 0.25s ease'
          }}>
            <span style={{ color: '#10b981' }}>✓</span> {toastMessage}
          </div>
        )}
        <Login users={users} onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#ffffff',
          color: '#111827',
          padding: '0.85rem 1.4rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--brand-maroon)',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          animation: 'fadeIn 0.25s ease'
        }}>
          <span style={{ color: '#059669', fontWeight: 800 }}>✓</span> {toastMessage}
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        users={users}
        setCurrentUser={setCurrentUser}
        notifications={notifications}
        unreadCount={notifications.filter(n => n.unread).length}
        onOpenNotifications={() => setIsNotifOpen(true)}
        onCreateEvent={() => setActiveTab('create-event')}
        onLogout={handleLogout}
        isSupabaseConfigured={isSupabaseConfigured}
      />

      {/* Slide-in Notifications Drawer */}
      <NotificationDrawer 
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onSelectEvent={handleSelectEvent}
      />

      {/* Syncing indicator */}
      {isLoadingData && (
        <div style={{
          background: 'var(--brand-maroon-light)',
          borderBottom: '1px solid var(--brand-maroon-border)',
          padding: '0.35rem 1.5rem',
          fontSize: '0.75rem',
          color: 'var(--brand-maroon)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          fontWeight: 600
        }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--brand-maroon)' }} />
          Synchronizing events and documents with Supabase...
        </div>
      )}

      {/* View Switcher Main Container */}
      <main className="app-container" style={{ flex: 1 }}>
        {activeTab === 'dashboard' && (
          <Dashboard 
            currentUser={currentUser}
            events={events}
            onNavigate={setActiveTab}
            onSelectEvent={handleSelectEvent}
            onOpenNotifications={() => setIsNotifOpen(true)}
            pendingApprovalsCount={pendingApprovalsCount}
          />
        )}

        {activeTab === 'create-event' && (
          <EventForm 
            currentUser={currentUser}
            onSaveEvent={handleSaveEvent}
            onCancel={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentCentre 
            events={events}
            selectedEventId={selectedEventId}
            setSelectedEventId={setSelectedEventId}
            currentUser={currentUser}
            onUpdateEventDocStatus={handleApproveDocument}
          />
        )}

        {activeTab === 'tracker' && (
          <Tracker 
            events={events}
            onSelectEvent={handleSelectEvent}
            onSendReminder={handleSendReminder}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'admin' && (
          <AdminMonitoring 
            events={events}
            auditLogs={auditLogs}
            users={users}
            onApproveDocument={handleApproveDocument}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'archive' && (
          <Archive 
            events={events}
            onSelectEventAndDoc={handleSelectEventAndDoc}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print" style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '1.25rem 1.5rem',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        background: '#ffffff'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <strong>EVENTRA</strong> • College Activity & Event Documentation Automation System
          </div>
          <div>
            Department of Computer Engineering • NBA & NAAC Accreditation Documentation Ready
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
