import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  Shield,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  RotateCw,
  ShoppingBag
} from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { api } from '../../services/api.js';

export function AuthModal() {
  const { authModalOpen, closeAuthModal, authModalInitialTab, login } = useAuth();
  const { addToast } = useToast();

  // Mode: 'landing' | 'login' | 'signup' | 'verify' | 'forgot' | 'admin_login'
  const [mode, setMode] = useState(authModalInitialTab || 'login');

  // Customer Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+1');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Verification & Password reset fields
  const [verifyCode, setVerifyCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  if (!authModalOpen) return null;

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return { label: 'Empty', percent: 0, color: 'bg-gray-600' };
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;

    if (score <= 25) return { label: 'Weak', percent: 25, color: 'bg-red-500' };
    if (score <= 50) return { label: 'Fair', percent: 50, color: 'bg-amber-500' };
    if (score <= 75) return { label: 'Good', percent: 75, color: 'bg-blue-500' };
    return { label: 'Strong', percent: 100, color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  // 1. Customer Sign In Handler
  const handleCustomerLogin = async (e) => {
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
      closeAuthModal();
    } catch (err) {
      if (err.data?.code === 'UserNotConfirmedException') {
        setMode('verify');
        setErrorMsg('Please enter the 6-digit verification code sent to your email to confirm your account.');
      } else {
        setErrorMsg(err.message || 'Incorrect email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. Admin Sign In Handler (Enforces Admins Group)
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessNotice('');
    setLoading(true);

    try {
      const data = await api.login(email.trim(), password, 'admin');
      login(data, rememberMe);
      addToast({
        type: 'success',
        title: 'Master Administrator Verified',
        message: 'Elevated Cognito permissions granted. Opening Admin Dashboard.'
      });
      closeAuthModal();
    } catch (err) {
      setErrorMsg(err.message || 'Access Denied: Account does not have Administrator permissions in Amazon Cognito.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Customer Sign Up Handler
  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessNotice('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
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
      setMode('verify');
    } catch (err) {
      setErrorMsg(err.message || 'Sign up failed.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Verify Email Code Handler
  const handleVerify = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await api.verifyEmail(email.trim(), verifyCode.trim());
      addToast({
        type: 'success',
        title: 'Email Verified with Amazon Cognito!',
        message: 'Your account is active. You may now sign in.'
      });
      setSuccessNotice('Account confirmed successfully! Please sign in with your credentials.');
      setMode('login');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid or expired confirmation code.');
    } finally {
      setLoading(false);
    }
  };

  // 5. Resend Verification Code
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
      setErrorMsg(err.message || 'Failed to resend code.');
    }
  };

  // 6. Forgot Password Request
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      await api.forgotPassword(email.trim());
      setSuccessNotice(`Password recovery code sent to ${email}.`);
      setMode('confirm_forgot');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to initiate password recovery.');
    } finally {
      setLoading(false);
    }
  };

  // 7. Confirm Password Reset
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
      setMode('login');
      setPassword('');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to reset password. Check the code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0a0e17] border border-white/10 rounded-3xl shadow-2xl p-7 md:p-8 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#FF5722]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top-Right Close Button & Admin Mode Link */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FF5722]/15 border border-[#FF5722]/30 flex items-center justify-center text-[#FF5722]">
              <ShoppingBag size={18} />
            </div>
            <span className="font-bold text-white text-base tracking-wide">
              CloudMart <span className="text-[#FF5722]">360</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {mode !== 'admin_login' ? (
              <button
                type="button"
                onClick={() => {
                  setMode('admin_login');
                  setErrorMsg('');
                  setSuccessNotice('');
                }}
                className="text-xs px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-[#FF5722] transition-colors flex items-center gap-1 font-medium"
              >
                <Shield size={12} className="text-[#FF5722]" /> Admin Portal
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                  setSuccessNotice('');
                }}
                className="text-xs px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
              >
                &larr; Customer Sign In
              </button>
            )}

            <button
              onClick={closeAuthModal}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Notifications & Error Banners */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2.5 text-xs text-red-300">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successNotice && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start gap-2.5 text-xs text-emerald-300">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-400" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* ================================================================ */}
        {/* 1. CUSTOMER SIGN IN                                              */}
        {/* ================================================================ */}
        {mode === 'login' && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
              <p className="text-xs text-gray-400 mt-1">
                Sign in to your CloudMart 360 customer account to access your cart & orders.
              </p>
            </div>

            <form onSubmit={handleCustomerLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="customer@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#FF5722] transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-gray-300">Password</label>
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setErrorMsg(''); }}
                    className="text-xs text-[#FF5722] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <KeyRound size={16} className="absolute left-3.5 top-3 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#FF5722] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-white/5 border-white/10 text-[#FF5722] focus:ring-0"
                  />
                  <span>Remember me on this device</span>
                </label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#FF5722] hover:bg-[#F4511E] text-white rounded-xl font-semibold text-sm shadow-lg shadow-[#FF5722]/25 transition-all"
              >
                {loading ? 'Authenticating with Cognito...' : 'Sign In as Customer'}
              </Button>

              <div className="text-center pt-2 text-xs text-gray-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setErrorMsg(''); }}
                  className="text-[#FF5722] font-semibold hover:underline"
                >
                  Create Customer Account &rarr;
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================================================================ */}
        {/* 2. CUSTOMER SIGN UP (Registration Form)                           */}
        {/* ================================================================ */}
        {mode === 'signup' && (
          <div>
            <div className="text-center mb-5">
              <h2 className="text-2xl font-bold text-white tracking-tight">Create Customer Account</h2>
              <p className="text-xs text-gray-400 mt-1">
                Join CloudMart 360 for personalized recommendations & faster checkout.
              </p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-3 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Arham Raheed"
                    className="w-full pl-10 pr-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#FF5722] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-3 text-gray-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full pl-10 pr-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#FF5722] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-3 text-gray-500" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1234567890"
                      className="w-full pl-10 pr-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#FF5722] transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <KeyRound size={16} className="absolute left-3.5 top-3 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full pl-10 pr-10 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#FF5722] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-gray-400">
                      <span>Strength: {strength.label}</span>
                      <span>{strength.percent}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                      <div className={`h-full transition-all duration-300 ${strength.color}`} style={{ width: `${strength.percent}%` }} />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Confirm Password</label>
                <div className="relative">
                  <KeyRound size={16} className="absolute left-3.5 top-3 text-gray-500" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-10 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#FF5722] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2 text-xs text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    className="mt-0.5 rounded bg-white/5 border-white/10 text-[#FF5722] focus:ring-0"
                  />
                  <span>
                    I agree to CloudMart 360's <strong className="text-gray-300">Terms of Service</strong> and <strong className="text-gray-300">Privacy Policy</strong>.
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#FF5722] hover:bg-[#F4511E] text-white rounded-xl font-semibold text-sm shadow-lg shadow-[#FF5722]/25 transition-all"
              >
                {loading ? 'Creating Cognito Account...' : 'Sign Up & Send Real Email OTP'}
              </Button>

              <div className="text-center pt-1 text-xs text-gray-400">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(''); }}
                  className="text-[#FF5722] font-semibold hover:underline"
                >
                  Sign In instead &rarr;
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================================================================ */}
        {/* 3. REAL COGNITO EMAIL OTP VERIFICATION                           */}
        {/* ================================================================ */}
        {mode === 'verify' && (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-400 mb-3 border border-blue-500/30">
                <Mail size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Confirm Your Email</h2>
              <p className="text-xs text-gray-400 mt-1">
                Amazon Cognito sent a real 6-digit verification code to:
              </p>
              <div className="text-sm font-semibold text-white mt-1 font-mono bg-white/5 py-1 px-3 rounded-lg inline-block">
                {email}
              </div>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1 text-center">
                  Enter 6-Digit Verification Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  placeholder="123456"
                  className="w-full py-3 px-4 bg-white/5 border border-white/15 rounded-xl text-center text-2xl font-mono tracking-[0.4em] text-white focus:outline-none focus:border-[#FF5722] transition-colors"
                />
              </div>

              <Button
                type="submit"
                disabled={loading || verifyCode.length < 6}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-emerald-500/25 transition-all"
              >
                {loading ? 'Verifying with Cognito...' : 'Confirm Account & Proceed'}
              </Button>

              <div className="flex items-center justify-between text-xs text-gray-400 pt-2">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendCooldown > 0}
                  className="text-[#FF5722] hover:underline disabled:text-gray-500"
                >
                  {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend verification code'}
                </button>

                <button
                  type="button"
                  onClick={() => { setMode('signup'); setErrorMsg(''); }}
                  className="hover:text-white"
                >
                  Change email address
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================================================================ */}
        {/* 4. DEDICATED SEPARATE ADMIN LOGIN                                */}
        {/* ================================================================ */}
        {mode === 'admin_login' && (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FF5722]/15 text-[#FF5722] mb-3 border border-[#FF5722]/30">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">CloudMart 360 Admin Portal</h2>
              <p className="text-xs text-gray-400 mt-1">
                Restricted access. Only users in the <span className="text-[#FF5722] font-semibold">Admins</span> Cognito group can authenticate.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Administrator Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@cloudmart360.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#FF5722] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Administrator Password</label>
                <div className="relative">
                  <KeyRound size={16} className="absolute left-3.5 top-3 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#FF5722] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#FF5722] hover:bg-[#F4511E] text-white rounded-xl font-semibold text-sm shadow-lg shadow-[#FF5722]/25 transition-all"
              >
                {loading ? 'Verifying Admin Claims in Cognito...' : 'Authenticate as Administrator'}
              </Button>

              {/* Quick Fill Provisioned Master Admin */}
              <div className="pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@cloudmart360.com');
                    setPassword('CloudMart@Admin360');
                  }}
                  className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-gray-300 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-1.5 text-[#FF5722]">
                    <Shield size={14} /> <strong>Auto-Fill Master Admin</strong>
                  </span>
                  <span className="text-gray-500">Cognito Provisioned &rarr;</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================================================================ */}
        {/* 5. FORGOT PASSWORD REQUEST                                       */}
        {/* ================================================================ */}
        {mode === 'forgot' && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white tracking-tight">Recover Password</h2>
              <p className="text-xs text-gray-400 mt-1">
                Enter your registered email address and Cognito will send a recovery code.
              </p>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Registered Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#FF5722] transition-colors"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#FF5722] hover:bg-[#F4511E] text-white rounded-xl font-semibold text-sm shadow-lg shadow-[#FF5722]/25"
              >
                {loading ? 'Sending Code...' : 'Send Recovery Code'}
              </Button>

              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(''); }}
                className="w-full text-center text-xs text-gray-400 hover:text-white transition-colors"
              >
                &larr; Back to Sign In
              </button>
            </form>
          </div>
        )}

        {/* ================================================================ */}
        {/* 6. CONFIRM FORGOT PASSWORD (Enter Code & New Password)           */}
        {/* ================================================================ */}
        {mode === 'confirm_forgot' && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white tracking-tight">Set New Password</h2>
              <p className="text-xs text-gray-400 mt-1">
                Enter the recovery code sent to <strong>{email}</strong> and your new password.
              </p>
            </div>

            <form onSubmit={handleConfirmForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Recovery Code</label>
                <input
                  type="text"
                  required
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  placeholder="123456"
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-xl text-center text-lg font-mono text-white focus:outline-none focus:border-[#FF5722]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">New Password (min 8 chars)</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#FF5722]"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-emerald-500/25"
              >
                {loading ? 'Updating Password in Cognito...' : 'Confirm New Password'}
              </Button>

              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(''); }}
                className="w-full text-center text-xs text-gray-400 hover:text-white transition-colors"
              >
                &larr; Back to Sign In
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
