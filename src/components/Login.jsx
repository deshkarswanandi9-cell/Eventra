import React, { useState } from 'react';
import { 
  Layers, 
  ShieldCheck, 
  CheckSquare, 
  UserCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  Building2,
  FileCheck2
} from 'lucide-react';

export function Login({ users, onLogin }) {
  const [selectedRole, setSelectedRole] = useState('Admin'); // Admin, Activity Coordinator, Faculty Coordinator
  const [email, setEmail] = useState('v.chitragar@engg.edu');
  const [password, setPassword] = useState('admin@eventra');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // When selecting a role filter, auto-suggest the first user of that role
  const handleRoleTabClick = (role) => {
    setSelectedRole(role);
    setError('');
    const matchedUser = users.find(u => u.role === role);
    if (matchedUser) {
      setEmail(matchedUser.email);
      setPassword(matchedUser.password || 'faculty@eventra');
    }
  };

  const handleQuickLogin = (user) => {
    setEmail(user.email);
    setPassword(user.password || 'faculty@eventra');
    setSelectedRole(user.role);
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(user);
    }, 400);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!user) {
        setError('No coordinator found with this institutional email address.');
        return;
      }

      // Check password (accept matched password or universal demo password)
      if (user.password && password !== user.password && password !== 'eventra123') {
        setError(`Incorrect password. (Tip: Demo password for ${user.name} is "${user.password}")`);
        return;
      }

      onLogin(user);
    }, 450);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      position: 'relative',
      background: 'radial-gradient(circle at 10% 20%, rgba(79, 70, 229, 0.15) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(6, 182, 212, 0.12) 0%, transparent 50%), #0b0f19'
    }}>
      {/* Container Box */}
      <div style={{
        width: '100%',
        maxWidth: '1100px',
        display: 'grid',
        gridTemplateColumns: '1fr 1.15fr',
        borderRadius: '24px',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75)',
        background: '#111827'
      }}>
        {/* Left Side: University & Department Branding Presentation */}
        <div style={{
          background: 'linear-gradient(145deg, #182238 0%, #0f172a 100%)',
          padding: '3rem 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid var(--border-subtle)',
          position: 'relative'
        }}>
          <div>
            {/* Brand Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(79, 70, 229, 0.5)'
              }}>
                <Layers size={26} color="#ffffff" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ 
                    fontFamily: 'var(--font-heading)', 
                    fontWeight: 800, 
                    fontSize: '1.45rem',
                    letterSpacing: '-0.02em',
                    background: 'linear-gradient(90deg, #ffffff, #c7d2fe)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    EVENTRA
                  </span>
                  <span style={{
                    fontSize: '0.65rem',
                    background: 'rgba(79, 70, 229, 0.3)',
                    color: '#a5b4fc',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px',
                    fontWeight: 700,
                    border: '1px solid rgba(99, 102, 241, 0.4)'
                  }}>
                    CE DEPT
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  College of Engineering & Technology
                </div>
              </div>
            </div>

            {/* Title & Tagline */}
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, lineHeight: 1.3, color: '#ffffff', marginBottom: '1rem' }}>
              College Activity & Documentation Automation System
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '2rem' }}>
              A centralized departmental platform that eliminates manual paperwork. Enter event details once to generate official flyers, invitations, attendance sheets, accredited reports, and appreciation letters.
            </p>

            {/* Core Value Pillars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CheckCircle2 size={16} color="#10b981" />
                </div>
                <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                  <strong>Single-Source Data Entry:</strong> Eliminates duplicate typing
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(99, 102, 241, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FileCheck2 size={16} color="#818cf8" />
                </div>
                <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                  <strong>Auto 5-Document Suite:</strong> High-res flyers, letters & reports
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(6, 182, 212, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ShieldCheck size={16} color="#06b6d4" />
                </div>
                <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                  <strong>NBA & NAAC Compliant:</strong> Outcome mappings & digital dossiers
                </span>
              </div>
            </div>
          </div>

          {/* Footer Accreditation Note */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '1.25rem',
            marginTop: '2rem',
            fontSize: '0.75rem',
            color: 'var(--text-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>Department of Computer Engineering</span>
            <span style={{ color: '#818cf8', fontWeight: 600 }}>v2.4 Accredited</span>
          </div>
        </div>

        {/* Right Side: Coordinator Sign-In Interface */}
        <div style={{
          padding: '3rem 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#818cf8',
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>
              Official Faculty & Coordinator Portal
            </span>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#ffffff', marginTop: '0.2rem' }}>
              Sign In to Your Workspace
            </h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Select your coordinator role or enter your institutional credentials to access your dashboard.
            </p>
          </div>

          {/* Role Filter Tabs */}
          <div style={{
            display: 'flex',
            background: '#0c1322',
            padding: '0.3rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1.5rem',
            gap: '0.35rem'
          }}>
            {[
              { role: 'Admin', label: 'Admin (HOD)', icon: ShieldCheck, color: '#f59e0b' },
              { role: 'Activity Coordinator', label: 'Activity Coord', icon: CheckSquare, color: '#06b6d4' },
              { role: 'Faculty Coordinator', label: 'Faculty Coord', icon: UserCheck, color: '#818cf8' }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = selectedRole === tab.role;
              return (
                <button
                  key={tab.role}
                  type="button"
                  onClick={() => handleRoleTabClick(tab.role)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    padding: '0.55rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: isActive ? 'rgba(79, 70, 229, 0.25)' : 'transparent',
                    color: isActive ? '#ffffff' : 'var(--text-muted)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.785rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={14} color={isActive ? tab.color : 'var(--text-subtle)'} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Error Banner */}
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              color: '#f87171',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              marginBottom: '1.25rem'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">College Email / Faculty ID</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="email" 
                  className="form-input" 
                  style={{ paddingLeft: '38px' }}
                  placeholder="name@engg.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                <span style={{ fontSize: '0.75rem', color: '#818cf8', cursor: 'pointer' }} onClick={() => setError('Contact the IT department or use one of the quick coordinator sign-in buttons below.')}>
                  Forgot Password?
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="form-input" 
                  style={{ paddingLeft: '38px', paddingRight: '38px' }}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-subtle)',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked /> Remember on this workstation
              </label>
            </div>

            {/* Submit Action */}
            <button 
              type="submit" 
              className="btn btn-primary btn-lg" 
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>Sign In as {selectedRole}</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Coordinator Logins Section */}
          <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.25rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.75rem'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
                Quick 1-Click Coordinator Sign-In
              </span>
              <span style={{ fontSize: '0.7rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Sparkles size={12} /> Instant Access
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem' }}>
              {users.map(u => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickLogin(u)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    background: '#151e30',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.55rem 0.75rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: 'var(--text-main)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
                    e.currentTarget.style.background = '#1a253c';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.background = '#151e30';
                  }}
                >
                  <img 
                    src={u.avatar} 
                    alt={u.name} 
                    style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} 
                  />
                  <div style={{ flex: 1, minWidth: 0, lineHeight: 1.25 }}>
                    <div style={{ fontSize: '0.785rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {u.name}
                    </div>
                    <div style={{
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      color: u.role === 'Admin' ? '#f59e0b' : u.role === 'Activity Coordinator' ? '#06b6d4' : '#818cf8'
                    }}>
                      {u.role}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
