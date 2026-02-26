import React, { useState } from 'react';
import { CreditCard, Shield, X } from 'lucide-react';

interface WelcomePageProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (username: string, email: string, password: string) => Promise<void>;
}

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (password.length === 0) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const levels = [
    { label: 'Weak', color: 'bg-[#FF3B30]' },
    { label: 'Fair', color: 'bg-[#FF9500]' },
    { label: 'Good', color: 'bg-[#FFCC00]' },
    { label: 'Strong', color: 'bg-[#34C759]' },
    { label: 'Very Strong', color: 'bg-[#34C759]' },
  ];
  return { score, ...levels[score] };
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onLogin, onRegister }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [username, setUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const passwordStrength = getPasswordStrength(signupPassword);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await onLogin(loginEmail, loginPassword);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await onRegister(username, signupEmail, signupPassword);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const openAuth = (tab: 'login' | 'signup') => {
    setActiveTab(tab);
    setError('');
    setIsAuthOpen(true);
  };

  return (
    <div className="min-h-screen w-full bg-[#F2F2F7] flex flex-col">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 pt-14 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#007AFF] rounded-[9px] flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-white" />
          </div>
          <span className="text-[17px] font-semibold text-[#1C1C1E] tracking-tight">
            Card Trooper
          </span>
        </div>
        <button
          onClick={() => openAuth('login')}
          className="text-[#007AFF] text-[15px] font-medium"
        >
          Sign In
        </button>
      </nav>

      {/* Hero */}
      <main className="flex-grow flex flex-col justify-center items-center text-center px-6 py-12">
        <div className="w-20 h-20 bg-[#007AFF] rounded-[22px] flex items-center justify-center mb-8 shadow-lg shadow-[#007AFF]/25">
          <CreditCard className="w-10 h-10 text-white" strokeWidth={1.5} />
        </div>

        <h1 className="text-[40px] font-bold text-[#1C1C1E] leading-tight tracking-tight mb-4">
          All Your Cards,
          <br />
          One Place.
        </h1>

        <p className="text-[17px] text-[#3C3C43]/60 leading-relaxed max-w-sm mb-10">
          Store and access all your loyalty and store cards. Just tap and scan.
        </p>

        <div className="flex flex-col w-full max-w-xs gap-3">
          <button
            onClick={() => openAuth('signup')}
            className="w-full bg-[#007AFF] text-white text-[17px] font-semibold py-[14px] rounded-[14px] transition-opacity active:opacity-80"
          >
            Get Started
          </button>
          <button
            onClick={() => openAuth('login')}
            className="w-full bg-white text-[#007AFF] text-[17px] font-semibold py-[14px] rounded-[14px] border border-[#E5E5EA] transition-opacity active:opacity-80"
          >
            Sign In
          </button>
        </div>

        <div className="mt-8 flex items-center gap-1.5 text-[#3C3C43]/40 text-[13px]">
          <Shield className="w-3.5 h-3.5" />
          <span>Secured with HTTP-only cookies</span>
        </div>
      </main>

      <footer className="pb-8 text-center text-[13px] text-[#3C3C43]/30">
        © 2026 Card Trooper
      </footer>

      {/* Auth Sheet */}
      {isAuthOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAuthOpen(false);
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsAuthOpen(false)} />

          {/* Sheet */}
          <div className="relative w-full sm:max-w-sm bg-[#F2F2F7] rounded-t-[20px] sm:rounded-[20px] pb-safe z-10">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-9 h-1 bg-[#3C3C43]/20 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <h2 className="text-[20px] font-bold text-[#1C1C1E]">
                {activeTab === 'login' ? 'Sign In' : 'Create Account'}
              </h2>
              <button
                onClick={() => setIsAuthOpen(false)}
                className="w-8 h-8 bg-[#E5E5EA] rounded-full flex items-center justify-center"
              >
                <X className="w-4 h-4 text-[#3C3C43]" />
              </button>
            </div>

            {/* Segmented Control */}
            <div className="mx-5 mt-2 mb-5 bg-[#E5E5EA] rounded-[9px] p-1 flex">
              <button
                className={`flex-1 py-1.5 rounded-[7px] text-[14px] font-medium transition-all ${
                  activeTab === 'login'
                    ? 'bg-white text-[#1C1C1E] shadow-sm'
                    : 'text-[#3C3C43]/60'
                }`}
                onClick={() => { setActiveTab('login'); setError(''); }}
              >
                Sign In
              </button>
              <button
                className={`flex-1 py-1.5 rounded-[7px] text-[14px] font-medium transition-all ${
                  activeTab === 'signup'
                    ? 'bg-white text-[#1C1C1E] shadow-sm'
                    : 'text-[#3C3C43]/60'
                }`}
                onClick={() => { setActiveTab('signup'); setError(''); }}
              >
                Sign Up
              </button>
            </div>

            {error && (
              <div className="mx-5 mb-4 px-4 py-3 rounded-[12px] bg-[#FF3B30]/10 border border-[#FF3B30]/20 text-[#FF3B30] text-[14px]">
                {error}
              </div>
            )}

            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="px-5 pb-6 space-y-3">
                <div className="bg-white rounded-[12px] overflow-hidden divide-y divide-[#E5E5EA]">
                  <div className="flex items-center px-4">
                    <label className="text-[15px] text-[#1C1C1E] w-24 shrink-0 py-3">Email</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="flex-1 py-3 text-[15px] text-[#1C1C1E] placeholder:text-[#C7C7CC] bg-transparent outline-none"
                    />
                  </div>
                  <div className="flex items-center px-4">
                    <label className="text-[15px] text-[#1C1C1E] w-24 shrink-0 py-3">Password</label>
                    <input
                      type="password"
                      placeholder="Required"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="flex-1 py-3 text-[15px] text-[#1C1C1E] placeholder:text-[#C7C7CC] bg-transparent outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#007AFF] text-white text-[17px] font-semibold py-[14px] rounded-[14px] disabled:opacity-50 transition-opacity active:opacity-80"
                >
                  {isLoading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="px-5 pb-6 space-y-3">
                <div className="bg-white rounded-[12px] overflow-hidden divide-y divide-[#E5E5EA]">
                  <div className="flex items-center px-4">
                    <label className="text-[15px] text-[#1C1C1E] w-24 shrink-0 py-3">Name</label>
                    <input
                      placeholder="Your name"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="flex-1 py-3 text-[15px] text-[#1C1C1E] placeholder:text-[#C7C7CC] bg-transparent outline-none"
                    />
                  </div>
                  <div className="flex items-center px-4">
                    <label className="text-[15px] text-[#1C1C1E] w-24 shrink-0 py-3">Email</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      className="flex-1 py-3 text-[15px] text-[#1C1C1E] placeholder:text-[#C7C7CC] bg-transparent outline-none"
                    />
                  </div>
                  <div className="flex items-center px-4">
                    <label className="text-[15px] text-[#1C1C1E] w-24 shrink-0 py-3">Password</label>
                    <input
                      type="password"
                      placeholder="Required"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      className="flex-1 py-3 text-[15px] text-[#1C1C1E] placeholder:text-[#C7C7CC] bg-transparent outline-none"
                    />
                  </div>
                </div>
                {signupPassword.length > 0 && (
                  <div className="px-1 space-y-1">
                    <div className="flex gap-1 h-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-full transition-all duration-300 ${
                            i < passwordStrength.score ? passwordStrength.color : 'bg-[#E5E5EA]'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-[12px] text-[#3C3C43]/60">{passwordStrength.label}</p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#007AFF] text-white text-[17px] font-semibold py-[14px] rounded-[14px] disabled:opacity-50 transition-opacity active:opacity-80"
                >
                  {isLoading ? 'Creating account…' : 'Create Account'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomePage;
