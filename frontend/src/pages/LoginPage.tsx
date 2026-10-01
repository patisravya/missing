import React, { useState } from 'react';
import { 
  Shield, 
  KeyRound, 
  Mail, 
  ArrowRight, 
  UserCheck, 
  UserPlus, 
  Building2, 
  BadgeCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { api } from '../services/api';
import type { User } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onBackToLanding?: () => void;
  initialMode?: 'signin' | 'signup';
}

export const LoginPage: React.FC<LoginPageProps> = ({ 
  onLoginSuccess, 
  onBackToLanding,
  initialMode = 'signin' 
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialMode) {
      setAuthMode(initialMode);
    }
  }, [initialMode]);

  // Sign In State
  const [signInEmail, setSignInEmail] = useState('demo@findtrace.ai');
  const [signInPassword, setSignInPassword] = useState('demo1234');

  // Sign Up State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpBadge, setSignUpBadge] = useState('');
  const [signUpAgency, setSignUpAgency] = useState('Metropolitan CCTV Analysis Unit');
  const [signUpRole, setSignUpRole] = useState('lead_investigator');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Quick preset accounts
  const demoPresets = [
    { label: 'Lead Investigator', email: 'demo@findtrace.ai', role: 'Lead Examiner', badge: 'SOC-LEAD-007' },
    { label: 'Forensic Video Analyst', email: 'analyst@findtrace.ai', role: 'CCTV Specialist', badge: 'ANL-CCTV-104' },
    { label: 'Field Response Officer', email: 'agent@findtrace.ai', role: 'Tactical Team', badge: 'FLD-RESP-319' },
  ];

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);
    try {
      const user = await api.login({ email: signInEmail, password: signInPassword });
      setSuccessMessage(`Access Granted: Welcome back, ${user.name}`);
      setTimeout(() => {
        onLoginSuccess(user);
      }, 600);
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    if (signUpPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage('You must certify that you are authorized to process CCTV investigation footage.');
      return;
    }

    setLoading(true);
    try {
      const newUser = await api.register({
        name: signUpName,
        email: signUpEmail,
        password: signUpPassword,
        role: signUpRole,
        badge_number: signUpBadge || 'FT-INV-809',
        agency: signUpAgency
      });
      setSuccessMessage(`Account Created: Investigator profile ${newUser.badge_number} registered!`);
      setTimeout(() => {
        onLoginSuccess(newUser);
      }, 800);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Email may already be registered.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (presetEmail: string) => {
    setSignInEmail(presetEmail);
    setSignInPassword('demo1234');
    setAuthMode('signin');
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center p-4 sm:p-6 font-mono relative overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* Background SOC Ambient Glow */}
      <div className="absolute w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl top-1/4 right-1/4 pointer-events-none" />

      <div className="bg-[#121824] border border-[#1e293b] rounded-2xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-blue-500/25 p-0.5">
            <div className="w-full h-full bg-[#0d1117] rounded-[14px] flex items-center justify-center">
              <Shield className="w-7 h-7 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-wider font-mono">
              FindTrace <span className="text-cyan-400">AI</span>
            </h1>
            <p className="text-[11px] text-slate-400 tracking-widest uppercase mt-0.5">
              Law Enforcement & Investigation Portal
            </p>
          </div>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="grid grid-cols-2 bg-[#0d1117] p-1 rounded-xl border border-[#1e293b] text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setAuthMode('signin');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              authMode === 'signin'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              authMode === 'signup'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Sign Up (Register)</span>
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="bg-red-950/60 border border-red-500/50 p-3 rounded-xl flex items-center gap-2.5 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-950/60 border border-emerald-500/50 p-3 rounded-xl flex items-center gap-2.5 text-xs text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 animate-bounce" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ----------------- SIGN IN FORM ----------------- */}
        {authMode === 'signin' && (
          <form onSubmit={handleSignInSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-300 font-semibold mb-1">
                Authorized Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="investigator@findtrace.ai"
                  className="w-full bg-[#161b22] border border-[#1e293b] rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-slate-300 font-semibold">Security Password</label>
                <span className="text-[10px] text-cyan-400 hover:underline cursor-pointer">
                  Demo Pass: demo1234
                </span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#161b22] border border-[#1e293b] rounded-lg pl-9 pr-10 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating Investigator...' : 'Sign In to Investigation Console'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Preset Accounts */}
            <div className="border-t border-[#1e293b] pt-4 space-y-2">
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Quick-Select Demo Credentials:</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {demoPresets.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectPreset(preset.email)}
                    className="bg-[#161b22] hover:bg-[#1f2937] border border-[#1e293b] hover:border-cyan-500/40 p-2 rounded-lg text-left transition-all cursor-pointer group"
                  >
                    <p className="text-[11px] font-bold text-slate-200 truncate group-hover:text-cyan-400">
                      {preset.label}
                    </p>
                    <p className="text-[9px] text-slate-400 truncate">{preset.badge}</p>
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* ----------------- SIGN UP FORM ----------------- */}
        {authMode === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  placeholder="Special Agent Sarah Jenkins"
                  className="w-full bg-[#161b22] border border-[#1e293b] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">Badge / Officer ID</label>
                <div className="relative">
                  <BadgeCheck className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={signUpBadge}
                    onChange={(e) => setSignUpBadge(e.target.value)}
                    placeholder="SOC-INV-442"
                    className="w-full bg-[#161b22] border border-[#1e293b] rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-300 font-semibold mb-1">Official Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="s.jenkins@law-enforcement.gov"
                  className="w-full bg-[#161b22] border border-[#1e293b] rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">Law Enforcement Agency</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={signUpAgency}
                    onChange={(e) => setSignUpAgency(e.target.value)}
                    placeholder="Metropolitan Police"
                    className="w-full bg-[#161b22] border border-[#1e293b] rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">Operational Role</label>
                <select
                  value={signUpRole}
                  onChange={(e) => setSignUpRole(e.target.value)}
                  className="w-full bg-[#161b22] border border-[#1e293b] text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="lead_investigator">Lead Investigator</option>
                  <option value="investigator">CCTV Video Analyst</option>
                  <option value="field_agent">Tactical Field Officer</option>
                  <option value="administrator">SOC Security Admin</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">Create Password *</label>
                <input
                  type="password"
                  required
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="At least 6 chars"
                  className="w-full bg-[#161b22] border border-[#1e293b] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">Confirm Password *</label>
                <input
                  type="password"
                  required
                  value={signUpConfirmPassword}
                  onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full bg-[#161b22] border border-[#1e293b] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="compliance-terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-cyan-400 cursor-pointer"
              />
              <label htmlFor="compliance-terms" className="text-[11px] text-slate-400 leading-tight cursor-pointer font-mono">
                I certify under official authority that all CCTV video footage and reference photos submitted are authorized for missing person search and lawful investigation.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Registering Investigator Profile...' : 'Complete Registration & Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Back to Home Link */}
        {onBackToLanding && (
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onBackToLanding}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-mono cursor-pointer"
            >
              ← Return to FindTrace AI Homepage
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
