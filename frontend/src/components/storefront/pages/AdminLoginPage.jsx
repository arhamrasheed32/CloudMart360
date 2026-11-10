import React, { useState } from 'react';
import {
  Shield,
  Mail,
  KeyRound,
  ArrowLeft,
  AlertCircle,
  Eye,
  EyeOff,
  ShoppingBag,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../../ui/Button.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useToast } from '../../../context/ToastContext.jsx';
import { api } from '../../../services/api.js';

export function AdminLoginPage({ onBackToHome, onAdminSuccess }) {
  const { login } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAdminSignIn = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      // Passes requiredRole: 'admin' to enforce Admins Cognito group
      const data = await api.login(email.trim(), password, 'admin');
      login(data, true);
      addToast({
        type: 'success',
        title: 'Master Administrator Verified',
        message: 'Elevated Cognito permissions verified. Launching Admin Console.'
      });
      if (onAdminSuccess) {
        onAdminSuccess(data);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Access Denied: Account does not possess Administrator credentials in Amazon Cognito.');
    } finally {
      setLoading(false);
    }
  };

  const autoFillDemoAdmin = () => {
    setEmail('admin@cloudmart360.com');
    setPassword('CloudMart@Admin360');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#05070B', color: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <header
        style={{
          height: '72px',
          borderBottom: '1px solid rgba(255, 87, 34, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          background: 'rgba(5, 7, 11, 0.85)',
          backdropFilter: 'blur(16px)'
        }}
      >
        <div onClick={onBackToHome} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #FF5722 0%, #D84315 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(255, 87, 34, 0.5)'
            }}
          >
            <Shield size={20} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', gap: '4px' }}>
              <span>CloudMart</span>
              <span style={{ color: '#FF5722' }}>360</span>
            </div>
            <div style={{ fontSize: '0.625rem', color: '#FF5722', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
              Management & Operations Portal
            </div>
          </div>
        </div>

        <button
          onClick={onBackToHome}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8125rem',
            color: '#9CA3AF',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '7px 16px',
            borderRadius: '9999px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.borderColor = 'rgba(255, 87, 34, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#9CA3AF';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          }}
        >
          <ArrowLeft size={16} />
          <span>Exit to Storefront</span>
        </button>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '300px', background: 'radial-gradient(circle, rgba(255, 87, 34, 0.15) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(70px)', pointerEvents: 'none' }} />

        <div
          style={{
            width: '100%',
            maxWidth: '460px',
            background: 'rgba(12, 16, 26, 0.85)',
            border: '1px solid rgba(255, 87, 34, 0.25)',
            borderRadius: '24px',
            padding: '40px 32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 35px rgba(255, 87, 34, 0.1)',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            zIndex: 10
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'rgba(255, 87, 34, 0.15)',
                border: '1px solid rgba(255, 87, 34, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                color: '#FF5722'
              }}
            >
              <Shield size={28} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
              Admin Portal
            </h1>
            <p style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>
              Restricted to verified accounts in the <strong style={{ color: '#FF5722' }}>Amazon Cognito Admins group</strong>.
            </p>
          </div>

          {errorMsg && (
            <div style={{ marginBottom: '20px', padding: '12px 14px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', display: 'flex', gap: '10px', fontSize: '0.8125rem', color: '#FCA5A5' }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px', color: '#EF4444' }} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleAdminSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#D1D5DB', marginBottom: '6px' }}>
                Administrator Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '13px', color: '#6B7280' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cloudmart360.com"
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 40px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#D1D5DB', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={16} style={{ position: 'absolute', left: '14px', top: '13px', color: '#6B7280' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '11px 40px 11px 40px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', top: '13px', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px 0',
                background: '#FF5722',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.9375rem',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(255, 87, 34, 0.35)',
                marginTop: '4px'
              }}
            >
              {loading ? 'Verifying Admin Claims with AWS Cognito...' : 'Authenticate as Administrator'}
            </Button>

            {/* Demo Master Admin Pill */}
            <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <button
                type="button"
                onClick={autoFillDemoAdmin}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  background: 'rgba(255, 87, 34, 0.08)',
                  border: '1px solid rgba(255, 87, 34, 0.25)',
                  borderRadius: '10px',
                  color: '#FF8A65',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Shield size={14} /> Auto-fill Demo Master Admin
                </span>
                <span style={{ color: '#9CA3AF' }}>admin@cloudmart360.com &rarr;</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

