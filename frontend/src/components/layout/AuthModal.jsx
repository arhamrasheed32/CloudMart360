import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Shield,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { Input } from '../ui/Input.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { api } from '../../services/api.js';

export function AuthModal() {
  const { authModalOpen, closeAuthModal, authModalInitialTab, login } = useAuth();
  const { addToast } = useToast();

  const [tab, setTab] = useState(authModalInitialTab || 'login'); // 'login' | 'signup' | 'verify'
  const [roleMode, setRoleMode] = useState('customer'); // 'customer' | 'admin'

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!authModalOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const data = await api.login(email.trim(), password);
      login(data);
      addToast({
        type: 'success',
        title: `Welcome back, ${data.role === 'admin' ? 'Administrator' : 'Customer'}!`,
        message: `Signed in as ${data.email} via Amazon Cognito.`
      });
      closeAuthModal();
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await api.signup(email.trim(), password, name.trim());
      addToast({
        type: 'success',
        title: 'Verification Code Sent!',
        message: `Check your inbox at ${email} for the 6-digit confirmation code.`
      });
      setTab('verify');
    } catch (err) {
      setErrorMsg(err.message || 'Sign up failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await api.verifyEmail(email.trim(), verifyCode.trim());
      addToast({
        type: 'success',
        title: 'Email Verified!',
        message: 'Your account is confirmed via Amazon Cognito. You can now sign in.'
      });
      setTab('login');
      setPassword('');
    } catch (err) {
      setErrorMsg(err.message || 'Verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@cloudmart360.com');
    setPassword('CloudMart@Admin360');
    setRoleMode('admin');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0f1422] border border-white/10 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-coral-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-coral-500/20 to-blue-500/20 border border-white/10 text-coral-400 mb-3">
            <Lock size={24} />
          </div>
          <h2 className="text-xl font-bold text-white">
            {tab === 'login' && 'Sign in to CloudMart 360'}
            {tab === 'signup' && 'Create Customer Account'}
            {tab === 'verify' && 'Verify Your Email'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Secured by <span className="text-coral-400 font-medium">Amazon Cognito</span> & Role Management
          </p>
        </div>

        {/* Tab Switcher (Login vs Sign Up) */}
        {tab !== 'verify' && (
          <div className="flex bg-white/5 p-1 rounded-xl mb-5 border border-white/5">
            <button
              onClick={() => { setTab('login'); setErrorMsg(''); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                tab === 'login' ? 'bg-coral-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('signup'); setErrorMsg(''); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                tab === 'signup' ? 'bg-coral-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign Up (Customer)
            </button>
          </div>
        )}

        {/* Error Notice */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2 text-xs text-red-300">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* TAB 1: LOGIN FORM */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-coral-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Password</label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-coral-500 transition-colors"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-coral-500 hover:bg-coral-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-coral-500/20"
            >
              {loading ? 'Authenticating with Cognito...' : 'Sign In'}
            </Button>

            {/* Quick Demo Credentials Pill */}
            <div className="pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-gray-300 flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-1.5 text-coral-400">
                  <Shield size={14} /> <strong>Click for Demo Admin</strong>
                </span>
                <span className="text-gray-500">Auto-fill &rarr;</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: SIGN UP FORM (Customer Registration) */}
        {tab === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-coral-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-coral-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Password (min 8 chars)</label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-coral-500 transition-colors"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-coral-500 hover:bg-coral-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-coral-500/20"
            >
              {loading ? 'Creating Cognito Account...' : 'Create Account & Send Code'}
            </Button>
          </form>
        )}

        {/* TAB 3: VERIFY EMAIL FORM */}
        {tab === 'verify' && (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-300">
              A 6-digit confirmation code was sent to <strong>{email}</strong> by Amazon Cognito. Please enter it below.
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">6-Digit Code</label>
              <input
                type="text"
                required
                maxLength={6}
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                placeholder="123456"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-center text-xl tracking-widest font-mono text-white focus:outline-none focus:border-coral-500 transition-colors"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-emerald-500/20"
            >
              {loading ? 'Verifying with Cognito...' : 'Verify Email & Complete Sign Up'}
            </Button>

            <button
              type="button"
              onClick={() => setTab('signup')}
              className="w-full text-xs text-gray-400 hover:text-white transition-colors"
            >
              &larr; Back to Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
