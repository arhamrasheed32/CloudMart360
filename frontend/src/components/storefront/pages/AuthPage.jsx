import React, { useState } from 'react';
import {
  ShoppingBag,
  Mail,
  KeyRound,
  User,
  Phone,
  Shield,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
  Boxes,
  Zap,
  Check
} from 'lucide-react';
import { Button } from '../../ui/Button.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useToast } from '../../../context/ToastContext.jsx';
import { api } from '../../../services/api.js';

export function AuthPage({ initialView = 'signin', onBackToHome, onAuthSuccess }) {
  const { login } = useAuth();
  const { addToast } = useToast();

  // 'signin' | 'signup' | 'verify' | 'forgot' | 'confirm_forgot'
  const [view, setView] = useState(initialView);

  // Form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+1');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // OTP Verification & Forgot Password
  const [verifyCode, setVerifyCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return { label: 'Empty', percent: 0, color: 'bg-gray-700' };
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;

    if (score <= 25) return { label: 'Weak', percent: 25, color: '#EF4444' };
    if (score <= 50) return { label: 'Fair', percent: 50, color: '#F59E0B' };
    if (score <= 75) return { label: 'Good', percent: 75, color: '#3B82F6' };
    return { label: 'Strong', percent: 100, color: '#10B981' };
  };

  const strength = getPasswordStrength(password);

  // 1. Customer Sign In
  const handleCustomerSignIn = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessNotice('');
    setLoading(true);

    try {
      const data = await api.login(email.trim(), password);
      login(data, rememberMe);
      addToast({
        type: 'success',
        title: `Welcome, ${data.name || data.email}!`,
        message: 'Successfully authenticated with Amazon Cognito.'
      });
      if (onAuthSuccess) {
        onAuthSuccess(data);
      } else {
        onBackToHome();
      }
    } catch (err) {
      if (err.data?.code === 'UserNotConfirmedException') {
        setView('verify');
        setErrorMsg('Please enter the 6-digit verification code sent to your email to confirm your account.');
      } else {
        setErrorMsg(err.message || 'Incorrect email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. Customer Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessNotice('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }
    if (!termsAgreed) {
      setErrorMsg('Please accept the CloudMart 360 Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);
    try {
      await api.signup(email.trim(), password, name.trim(), phone.trim());
      addToast({
        type: 'success',
        title: 'Real Verification Code Sent!',
        message: `Amazon Cognito dispatched a 6-digit code to ${email}.`
      });
      setSuccessNotice(`Verification code sent to ${email}. Check your inbox or spam folder.`);
      setView('verify');
    } catch (err) {
      setErrorMsg(err.message || 'Sign up failed.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Verify OTP Code
  const handleVerify = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await api.verifyEmail(email.trim(), verifyCode.trim());
      addToast({
        type: 'success',
        title: 'Account Confirmed in Cognito!',
        message: 'Email verified successfully. You may now sign in.'
      });
      setSuccessNotice('Account confirmed successfully! Please sign in with your credentials.');
      setView('signin');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid or expired confirmation code.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Resend OTP
  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    setErrorMsg('');
    try {
      await api.resendCode(email.trim());
      addToast({
        type: 'info',
        title: 'Code Dispatched',
        message: 'A fresh confirmation code was sent by Cognito.'
      });
      setResendCooldown(30);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to resend confirmation code.');
    }
  };

  // 5. Forgot Password Request
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      await api.forgotPassword(email.trim());
      setSuccessNotice(`Password recovery code sent to ${email}.`);
      setView('confirm_forgot');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to initiate password recovery.');
    } finally {
      setLoading(false);
    }
  };

  // 6. Confirm Forgot Password
  const handleConfirmForgotPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (newPassword.length < 8) {
      setErrorMsg('New password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await api.confirmForgotPassword(email.trim(), verifyCode.trim(), newPassword);
      addToast({
        type: 'success',
        title: 'Password Reset Successful',
        message: 'Your password has been reset in Cognito. You can now sign in.'
      });
      setSuccessNotice('Password reset successfully! Please sign in.');
      setView('signin');
      setPassword('');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to reset password. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#080A0F', color: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <header
        style={{
          height: '72px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          background: 'rgba(8, 10, 15, 0.8)',
          backdropFilter: 'blur(16px)',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}
      >
        {/* Brand / Logo */}
        <div
          onClick={onBackToHome}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #FF5722 0%, #D84315 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(255, 87, 34, 0.4)'
            }}
          >
            <ShoppingBag size={20} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', gap: '4px' }}>
              <span>CloudMart</span>
              <span style={{ color: '#FF5722' }}>360</span>
            </div>
            <div style={{ fontSize: '0.625rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Customer Portal
            </div>
          </div>
        </div>

        {/* Back to Storefront Link */}
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
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#9CA3AF';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Storefront</span>
        </button>
      </header>

      {/* Main Body Grid */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', position: 'relative', overflow: 'hidden' }}>
        {/* Ambient Glows */}
        <div style={{ position: 'absolute', top: '10%', left: '15%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255, 87, 34, 0.12) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '15%', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(70px)', pointerEvents: 'none' }} />

        <div
          style={{
            width: '100%',
            maxWidth: view === 'signup' ? '560px' : '460px',
            background: 'rgba(15, 20, 34, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '36px 32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 87, 34, 0.08)',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            zIndex: 10,
            transition: 'max-width 0.3s ease'
          }}
        >
          {/* Header Switcher Tabs */}
          {(view === 'signin' || view === 'signup') && (
            <div
              style={{
                display: 'flex',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '14px',
                padding: '4px',
                marginBottom: '28px'
              }}
            >
              <button
                type="button"
                onClick={() => { setView('signin'); setErrorMsg(''); setSuccessNotice(''); }}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  borderRadius: '10px',
                  background: view === 'signin' ? '#FF5722' : 'transparent',
                  color: view === 'signin' ? '#FFFFFF' : '#9CA3AF',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: view === 'signin' ? '0 4px 12px rgba(255, 87, 34, 0.35)' : 'none'
                }}
              >
                Customer Sign In
              </button>
              <button
                type="button"
                onClick={() => { setView('signup'); setErrorMsg(''); setSuccessNotice(''); }}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  borderRadius: '10px',
                  background: view === 'signup' ? '#FF5722' : 'transparent',
                  color: view === 'signup' ? '#FFFFFF' : '#9CA3AF',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: view === 'signup' ? '0 4px 12px rgba(255, 87, 34, 0.35)' : 'none'
                }}
              >
                Create Account (Sign Up)
              </button>
            </div>
          )}

          {/* Banners */}
          {errorMsg && (
            <div style={{ marginBottom: '20px', padding: '12px 14px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', display: 'flex', gap: '10px', fontSize: '0.8125rem', color: '#FCA5A5' }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px', color: '#EF4444' }} />
              <span>{errorMsg}</span>
            </div>
          )}
          {successNotice && (
            <div style={{ marginBottom: '20px', padding: '12px 14px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', display: 'flex', gap: '10px', fontSize: '0.8125rem', color: '#6EE7B7' }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px', color: '#10B981' }} />
              <span>{successNotice}</span>
            </div>
          )}

          {/* 1. SIGN IN FORM */}
          {view === 'signin' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
                  Sign in to CloudMart
                </h1>
                <p style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>
                  Enter your registered credentials authenticated securely by <strong style={{ color: '#FF5722' }}>Amazon Cognito</strong>.
                </p>
              </div>

              <form onSubmit={handleCustomerSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#D1D5DB', marginBottom: '6px' }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '14px', top: '13px', color: '#6B7280' }} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="customer@example.com"
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D1D5DB' }}>
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => { setView('forgot'); setErrorMsg(''); setSuccessNotice(''); }}
                      style={{ background: 'none', border: 'none', color: '#FF5722', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Forgot password?
                    </button>
                  </div>
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

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#9CA3AF' }}>
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ accentColor: '#FF5722', width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <label htmlFor="rememberMe" style={{ cursor: 'pointer' }}>Remember me on this browser</label>
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
                    boxShadow: '0 8px 20px rgba(255, 87, 34, 0.3)',
                    marginTop: '8px'
                  }}
                >
                  {loading ? 'Authenticating with AWS Cognito...' : 'Sign In'}
                </Button>

                <div style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#9CA3AF', marginTop: '12px' }}>
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => { setView('signup'); setErrorMsg(''); setSuccessNotice(''); }}
                    style={{ background: 'none', border: 'none', color: '#FF5722', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Sign up now &rarr;
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 2. SIGN UP FORM */}
          {view === 'signup' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '22px' }}>
                <h1 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
                  Create Customer Account
                </h1>
                <p style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>
                  Register directly in the <strong style={{ color: '#FF5722' }}>Amazon Cognito User Pool</strong> with genuine email OTP verification.
                </p>
              </div>

              <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#D1D5DB', marginBottom: '6px' }}>
                    Full Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '14px', top: '13px', color: '#6B7280' }} />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Arham Raheed"
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#D1D5DB', marginBottom: '6px' }}>
                      Email Address
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} style={{ position: 'absolute', left: '14px', top: '13px', color: '#6B7280' }} />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@email.com"
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
                      Phone (with country code)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} style={{ position: 'absolute', left: '14px', top: '13px', color: '#6B7280' }} />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1234567890"
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
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#D1D5DB', marginBottom: '6px' }}>
                    Password (min 8 chars)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <KeyRound size={16} style={{ position: 'absolute', left: '14px', top: '13px', color: '#6B7280' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
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

                  {/* Strength Bar */}
                  {password && (
                    <div style={{ marginTop: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#9CA3AF', marginBottom: '4px' }}>
                        <span>Password strength: <strong>{strength.label}</strong></span>
                        <span>{strength.percent}%</span>
                      </div>
                      <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${strength.percent}%`, background: strength.color, transition: 'all 0.3s ease' }} />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#D1D5DB', marginBottom: '6px' }}>
                    Confirm Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <KeyRound size={16} style={{ position: 'absolute', left: '14px', top: '13px', color: '#6B7280' }} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
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
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ position: 'absolute', right: '14px', top: '13px', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.75rem', color: '#9CA3AF', marginTop: '2px' }}>
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    style={{ accentColor: '#FF5722', width: '16px', height: '16px', marginTop: '2px', cursor: 'pointer' }}
                  />
                  <label htmlFor="terms" style={{ cursor: 'pointer', lineHeight: 1.4 }}>
                    I agree to the <strong style={{ color: '#FFFFFF' }}>Terms of Service</strong> and consent to Amazon Cognito account verification.
                  </label>
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
                    boxShadow: '0 8px 20px rgba(255, 87, 34, 0.3)',
                    marginTop: '8px'
                  }}
                >
                  {loading ? 'Creating Account in Cognito...' : 'Create Account & Send Email OTP'}
                </Button>

                <div style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#9CA3AF', marginTop: '8px' }}>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => { setView('signin'); setErrorMsg(''); setSuccessNotice(''); }}
                    style={{ background: 'none', border: 'none', color: '#FF5722', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Sign In instead &rarr;
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 3. REAL OTP VERIFICATION SCREEN */}
          {view === 'verify' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: 'rgba(59, 130, 246, 0.15)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px auto',
                    color: '#60A5FA'
                  }}
                >
                  <Mail size={28} />
                </div>
                <h1 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
                  Verify Your Email
                </h1>
                <p style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>
                  Amazon Cognito dispatched a 6-digit confirmation code to:
                </p>
                <div style={{ display: 'inline-block', marginTop: '6px', padding: '4px 12px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, color: '#FFFFFF', fontFamily: 'monospace' }}>
                  {email}
                </div>
              </div>

              <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#D1D5DB', marginBottom: '8px' }}>
                    Enter 6-Digit Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value)}
                    placeholder="123456"
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '14px',
                      color: '#FFFFFF',
                      fontSize: '1.75rem',
                      fontFamily: 'monospace',
                      letterSpacing: '0.35em',
                      textAlign: 'center',
                      outline: 'none'
                    }}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || verifyCode.length < 6}
                  style={{
                    width: '100%',
                    padding: '13px 0',
                    background: '#10B981',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.9375rem',
                    borderRadius: '12px',
                    boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  {loading ? 'Verifying with Cognito...' : 'Confirm Account & Proceed'}
                </Button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#9CA3AF' }}>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendCooldown > 0}
                    style={{ background: 'none', border: 'none', color: resendCooldown > 0 ? '#6B7280' : '#FF5722', fontWeight: 600, cursor: resendCooldown > 0 ? 'default' : 'pointer' }}
                  >
                    {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setView('signup'); setErrorMsg(''); setSuccessNotice(''); }}
                    style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
                  >
                    Change email
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 4. FORGOT PASSWORD */}
          {view === 'forgot' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
                  Reset Password
                </h1>
                <p style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>
                  Enter your email address and Amazon Cognito will send a password reset OTP.
                </p>
              </div>

              <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#D1D5DB', marginBottom: '6px' }}>
                    Registered Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '14px', top: '13px', color: '#6B7280' }} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
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

                <Button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px 0',
                    background: '#FF5722',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    borderRadius: '12px'
                  }}
                >
                  {loading ? 'Sending Code...' : 'Send Recovery Code'}
                </Button>

                <button
                  type="button"
                  onClick={() => { setView('signin'); setErrorMsg(''); setSuccessNotice(''); }}
                  style={{ background: 'none', border: 'none', color: '#9CA3AF', fontSize: '0.8125rem', cursor: 'pointer', textAlign: 'center' }}
                >
                  &larr; Back to Sign In
                </button>
              </form>
            </div>
          )}

          {/* 5. CONFIRM FORGOT PASSWORD */}
          {view === 'confirm_forgot' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
                  Set New Password
                </h1>
                <p style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>
                  Enter the code sent to <strong>{email}</strong> and specify your new password.
                </p>
              </div>

              <form onSubmit={handleConfirmForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#D1D5DB', marginBottom: '6px' }}>
                    Recovery Code
                  </label>
                  <input
                    type="text"
                    required
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value)}
                    placeholder="123456"
                    style={{
                      width: '100%',
                      padding: '11px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: '#FFFFFF',
                      fontSize: '1.1rem',
                      fontFamily: 'monospace',
                      textAlign: 'center',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#D1D5DB', marginBottom: '6px' }}>
                    New Password (min 8 chars)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: '#FFFFFF',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px 0',
                    background: '#10B981',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    borderRadius: '12px'
                  }}
                >
                  {loading ? 'Updating in Cognito...' : 'Save New Password & Sign In'}
                </Button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

