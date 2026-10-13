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
  GraduationCap,
  FileCheck2,
  Database,
  UserPlus,
  LogIn,
  Briefcase
} from 'lucide-react';
import { authService } from '../services/authService';
import { isSupabaseConfigured } from '../lib/supabase';

export function Login({ users, onLogin }) {
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'register'
  const [selectedRole, setSelectedRole] = useState('Faculty Coordinator'); // Faculty Coordinator, Activity Coordinator, Admin
  
  // Sign In State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register / Activation State
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regDesignation, setRegDesignation] = useState('Assistant Professor');
  const [regDepartment, setRegDepartment] = useState('Computer Engineering');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

  const roleDescriptions = {
    'Faculty Coordinator': {
      title: 'Faculty Coordinator Portal',
      badge: 'Activity Creator',
      color: 'var(--brand-maroon)',
      desc: 'Single-source event creation, auto-generation of 5-document suites (flyer, invitation, attendance, report, appreciation), and student roster attendance tracking.',
      icon: UserCheck
    },
    'Activity Coordinator': {
      title: 'Activity Coordinator Workspace',
      badge: 'Lifecycle Tracking',
      color: '#0284c7',
      desc: 'Department-wide activity monitoring, missing document inspection, automated follow-up reminders, and checklist milestone enforcement.',
      icon: CheckSquare
    },
    'Admin': {
      title: 'Department Head & Admin Portal',
      badge: 'Executive Governance',
      color: '#d97706',
      desc: 'Departmental activity approval, accreditation dossier sign-offs (NBA/NAAC), audit trails, user role governance, and institutional CSV export.',
      icon: ShieldCheck
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      if (isSupabaseConfigured) {
        const { profile, user } = await authService.signIn(email, password);
        setIsLoading(false);
        onLogin(profile || {
          id: user.id,
          name: user.email.split('@')[0],
          role: selectedRole,
          email: user.email,
        });
      } else {
        setTimeout(() => {
          setIsLoading(false);
          const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
          if (!found) {
            setError('No coordinator found with this institutional email. Click "Activate / Register Account" to create your login.');
            return;
          }

          if (found.password && password !== found.password && password !== 'eventra123') {
            setError('Invalid password. Please check your credentials.');
            return;
          }

          onLogin(found);
        }, 400);
      }
    } catch (err) {
      setIsLoading(false);
      const msg = err.message || '';
      if (msg.includes('Invalid login credentials') || msg.includes('not found')) {
        setError('Account not registered in Supabase yet. Please switch to "Activate / Register Account" to create your institutional login in Supabase.');
      } else {
        setError(msg || 'Authentication failed. Please verify institutional credentials.');
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }
    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { user, profile } = await authService.signUp(regEmail, regPassword, {
          name: regFullName,
          role: selectedRole,
          department: regDepartment,
          designation: regDesignation
        });

        setIsLoading(false);
        setSuccessMsg(`Account created for ${regFullName}! You can now sign in.`);
        setEmail(regEmail);
        setPassword(regPassword);
        setAuthMode('signin');
      } else {
        setTimeout(() => {
          setIsLoading(false);
          const newUser = {
            id: `usr_${Date.now()}`,
            name: regFullName,
            email: regEmail,
            role: selectedRole,
            department: regDepartment,
            designation: regDesignation,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            password: regPassword
          };
          users.push(newUser);
          setSuccessMsg(`Local account activated for ${regFullName}! Please sign in.`);
          setEmail(regEmail);
          setPassword(regPassword);
          setAuthMode('signin');
        }, 500);
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Registration failed. Check if user already exists.');
    }
  };

  const quickFill = (user) => {
    setEmail(user.email);
    setPassword('eventra123');
    setSelectedRole(user.role);
    setError('');
  };

  const CurrentRoleIcon = roleDescriptions[selectedRole].icon;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-app)',
      padding: '2rem 1.25rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '520px',
        background: '#ffffff',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden'
      }}>
        {/* Institutional Header Banner (Reference Maroon Style) */}
        <div style={{
          background: 'linear-gradient(135deg, var(--brand-maroon) 0%, var(--brand-maroon-dark) 100%)',
          padding: '2rem 2rem 1.75rem 2rem',
          color: '#ffffff',
          textAlign: 'center',
          position: 'relative'
        }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.85rem auto',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}>
            <GraduationCap size={30} color="#ffffff" />
          </div>

          <h1 style={{ 
            fontSize: '1.65rem', 
            fontWeight: 800, 
            letterSpacing: '-0.02em', 
            color: '#ffffff',
            marginBottom: '0.25rem'
          }}>
            EVENTRA
          </h1>

          <div style={{
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: 'rgba(255, 255, 255, 0.9)',
            letterSpacing: '0.01em'
          }}>
            College Activity & Event Documentation Automation System
          </div>

          <div style={{
            marginTop: '0.65rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.72rem',
            background: 'rgba(0, 0, 0, 0.2)',
            padding: '0.2rem 0.65rem',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <span>Department of Computer Engineering</span>
            <span>•</span>
            <span style={{ color: 'var(--brand-mustard)', fontWeight: 600 }}>NBA & NAAC Compliant</span>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.75rem 2rem 2rem 2rem' }}>
          {/* Mode Switcher Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
            background: '#f1f5f9',
            padding: '0.3rem',
            borderRadius: '8px',
            marginBottom: '1.5rem'
          }}>
            <button
              type="button"
              onClick={() => { setAuthMode('signin'); setError(''); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                padding: '0.55rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                background: authMode === 'signin' ? '#ffffff' : 'transparent',
                color: authMode === 'signin' ? 'var(--brand-maroon)' : '#64748b',
                boxShadow: authMode === 'signin' ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <LogIn size={15} />
              Sign In
            </button>

            <button
              type="button"
              onClick={() => { setAuthMode('register'); setError(''); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                padding: '0.55rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                background: authMode === 'register' ? '#ffffff' : 'transparent',
                color: authMode === 'register' ? 'var(--brand-maroon)' : '#64748b',
                boxShadow: authMode === 'register' ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <UserPlus size={15} />
              Register / Activate
            </button>
          </div>

          {/* Role Selection Tabs */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ marginBottom: '0.5rem' }}>
              Select Coordinator Role:
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.5rem'
            }}>
              {Object.keys(roleDescriptions).map(roleKey => {
                const isSelected = selectedRole === roleKey;
                return (
                  <button
                    key={roleKey}
                    type="button"
                    onClick={() => setSelectedRole(roleKey)}
                    style={{
                      padding: '0.65rem 0.5rem',
                      borderRadius: '8px',
                      border: `1.5px solid ${isSelected ? 'var(--brand-maroon)' : '#e2e8f0'}`,
                      background: isSelected ? 'var(--brand-maroon-light)' : '#ffffff',
                      color: isSelected ? 'var(--brand-maroon)' : '#475569',
                      fontSize: '0.785rem',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'center',
                      lineHeight: 1.25,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {roleKey === 'Faculty Coordinator' ? 'Faculty' :
                     roleKey === 'Activity Coordinator' ? 'Activity' : 'HOD / Admin'}
                  </button>
                );
              })}
            </div>

            {/* Role Context Helper Banner */}
            <div style={{
              marginTop: '0.65rem',
              padding: '0.65rem 0.85rem',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '0.75rem',
              color: '#475569',
              lineHeight: 1.4,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem'
            }}>
              <CurrentRoleIcon size={16} color="var(--brand-maroon)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#1e293b' }}>{roleDescriptions[selectedRole].title}</strong>: {roleDescriptions[selectedRole].desc}
              </div>
            </div>
          </div>

          {/* Error & Success Messages */}
          {error && (
            <div style={{
              padding: '0.75rem 0.9rem',
              background: 'var(--danger-bg)',
              border: '1px solid var(--danger-border)',
              borderRadius: '6px',
              color: 'var(--danger-text)',
              fontSize: '0.8125rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <div>{error}</div>
            </div>
          )}

          {successMsg && (
            <div style={{
              padding: '0.75rem 0.9rem',
              background: 'var(--success-bg)',
              border: '1px solid var(--success-border)',
              borderRadius: '6px',
              color: 'var(--success-text)',
              fontSize: '0.8125rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <div>{successMsg}</div>
            </div>
          )}

          {/* Sign In Form */}
          {authMode === 'signin' && (
            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Institutional Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    required
                    placeholder="coordinator@jspm.edu.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '38px' }}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter institutional password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '38px', paddingRight: '38px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#94a3b8'
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                {isLoading ? 'Authenticating...' : `Sign In to ${selectedRole}`}
                {!isLoading && <ArrowRight size={16} />}
              </button>
            </form>
          )}

          {/* Register / Activation Form */}
          {authMode === 'register' && (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Full Name & Title</label>
                <input
                  type="text"
                  required
                  placeholder="Prof. John Doe"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Institutional Email</label>
                <input
                  type="email"
                  required
                  placeholder="john.doe@college.edu.in"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Re-enter password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Designation</label>
                  <input
                    type="text"
                    value={regDesignation}
                    onChange={(e) => setRegDesignation(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                {isLoading ? 'Creating Account...' : `Register & Activate as ${selectedRole}`}
              </button>
            </form>
          )}

          {/* Quick Demo Credentials Assistant */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => setShowDemoCredentials(!showDemoCredentials)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--brand-maroon)',
                fontSize: '0.785rem',
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              {showDemoCredentials ? 'Hide Quick Sign-In Helpers' : 'Show Demo Account Quick-Fill'}
            </button>

            {showDemoCredentials && (
              <div style={{
                marginTop: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                textAlign: 'left'
              }}>
                {users.map(u => (
                  <div
                    key={u.id}
                    onClick={() => quickFill(u)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: '6px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}
                  >
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1e293b' }}>{u.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{u.email}</div>
                    </div>
                    <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>{u.role}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
