import React, { useState } from 'react';
import { Shield, X } from 'lucide-react';
import { ICONS } from '@/lib/icons';

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
    { label: 'Weak', color: '#DC2626' },
    { label: 'Fair', color: '#D97706' },
    { label: 'Good', color: '#CA8A04' },
    { label: 'Strong', color: '#16A34A' },
    { label: 'Very Strong', color: '#16A34A' },
  ];
  return { score, ...levels[score] };
}

const InputRow: React.FC<{
  label: string; type?: string; placeholder: string;
  value: string; onChange: (v: string) => void;
  required?: boolean; disabled?: boolean; last?: boolean;
}> = ({ label, type = 'text', placeholder, value, onChange, required, disabled, last }) => (
  <div
    className="flex items-center px-4 gap-3"
    style={{ borderBottom: last ? 'none' : '1px solid var(--c-border)' }}
  >
    <label className="text-[13px] font-medium w-20 shrink-0 py-3 select-none" style={{ color: 'var(--c-ink-2)' }}>
      {label}
    </label>
    <input
      type={type} placeholder={placeholder} value={value}
      onChange={e => onChange(e.target.value)}
      required={required} disabled={disabled}
      className="flex-1 py-3 bg-transparent outline-none disabled:opacity-50"
      style={{ color: 'var(--c-ink)', fontSize: '15px' }}
    />
  </div>
);

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

  const strength = getPasswordStrength(signupPassword);

  const openAuth = (tab: 'login' | 'signup') => {
    setActiveTab(tab); setError(''); setIsAuthOpen(true);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setIsLoading(true);
    try { await onLogin(loginEmail, loginPassword); }
    catch (err) { setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.'); }
    finally { setIsLoading(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setIsLoading(true);
    try { await onRegister(username, signupEmail, signupPassword); }
    catch (err) { setError(err instanceof Error ? err.message : 'Registration failed. Please try again.'); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--c-cream)' }}>
      {/* Nav */}
      <nav
        className="flex justify-between items-center px-5 h-[52px] bg-white"
        style={{ borderBottom: '1px solid var(--c-border)' }}
      >
        <div className="flex items-center gap-2">
          <img src={ICONS.wallet} alt="" className="w-7 h-7 object-contain" />
          <span className="font-display italic text-[17px]" style={{ color: 'var(--c-ink)' }}>
            Card Trooper
          </span>
        </div>
        <button
          onClick={() => openAuth('login')}
          className="text-[14px] font-medium px-3 py-1.5 rounded-[8px] transition-colors"
          style={{ color: 'var(--c-blue)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--c-cream-2)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          Sign In
        </button>
      </nav>

      {/* Hero */}
      <main className="flex-grow flex flex-col justify-center items-center text-center px-6 py-16">
        {/* Thiings credit card icon */}
        <div className="mb-8 anim-fade-up">
          <img
            src={ICONS.wallet}
            alt="Wallet"
            className="w-28 h-28 object-contain drop-shadow-xl"
            style={{ animationDelay: '0ms' }}
          />
        </div>

        <h1
          className="font-display italic text-[44px] sm:text-[54px] leading-[1.1] mb-4 anim-fade-up"
          style={{ color: 'var(--c-ink)', letterSpacing: '-0.02em', animationDelay: '60ms' }}
        >
          All your cards,
          <br />
          <span style={{ color: 'var(--c-blue)' }}>one place.</span>
        </h1>

        <p
          className="text-[16px] leading-relaxed max-w-[300px] mb-10 anim-fade-up"
          style={{ color: 'var(--c-ink-2)', animationDelay: '120ms' }}
        >
          Store and access all your loyalty cards. Tap any card to scan.
        </p>

        <div className="flex flex-col w-full max-w-[260px] gap-2.5 anim-fade-up" style={{ animationDelay: '180ms' }}>
          <button
            onClick={() => openAuth('signup')}
            className="w-full text-white text-[15px] font-semibold py-[13px] rounded-[10px] transition-opacity hover:opacity-90 active:opacity-80"
            style={{ background: 'var(--c-blue)' }}
          >
            Get Started
          </button>
          <button
            onClick={() => openAuth('login')}
            className="w-full text-[15px] font-medium py-[13px] rounded-[10px] transition-colors"
            style={{ background: 'var(--c-white)', border: '1px solid var(--c-border)', color: 'var(--c-ink)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--c-cream-2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--c-white)')}
          >
            Sign In
          </button>
        </div>

        <div
          className="mt-8 flex items-center gap-1.5 text-[12px] anim-fade-up"
          style={{ color: 'var(--c-ink-3)', animationDelay: '240ms' }}
        >
          <Shield className="w-3 h-3" />
          <span>Secured with HTTP-only cookies</span>
        </div>
      </main>

      <footer className="pb-8 text-center text-[12px]" style={{ color: 'var(--c-ink-3)' }}>
        © 2026 Card Trooper
      </footer>

      {/* Auth dialog */}
      {isAuthOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          onClick={e => { if (e.target === e.currentTarget) setIsAuthOpen(false); }}
        >
          <div className="absolute inset-0 backdrop-warm anim-fade-in" onClick={() => setIsAuthOpen(false)} />

          <div
            className="relative w-full sm:max-w-[380px] rounded-t-[20px] sm:rounded-[16px] z-10 overflow-hidden anim-sheet"
            style={{
              background: 'var(--c-white)',
              border: '1px solid var(--c-border)',
              boxShadow: '0 24px 64px rgba(28,25,23,0.16), 0 6px 16px rgba(28,25,23,0.08)',
            }}
          >
            {/* Handle (mobile) */}
            <div className="flex justify-center pt-3 sm:hidden">
              <div className="w-8 h-1 rounded-full" style={{ background: 'var(--c-border-2)' }} />
            </div>

            {/* Header */}
            <div
              className="flex items-center justify-between px-5 pt-4 pb-3"
              style={{ borderBottom: '1px solid var(--c-border)' }}
            >
              <h2 className="font-display italic text-[22px]" style={{ color: 'var(--c-ink)', letterSpacing: '-0.01em' }}>
                {activeTab === 'login' ? 'Sign in.' : 'Create account.'}
              </h2>
              <button
                onClick={() => setIsAuthOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                style={{ background: 'var(--c-cream-2)', color: 'var(--c-ink-2)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--c-border)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--c-cream-2)')}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tabs */}
            <div
              className="mx-4 mt-3 mb-4 p-0.5 flex rounded-[9px]"
              style={{ background: 'var(--c-cream-2)' }}
            >
              {(['login', 'signup'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setError(''); }}
                  className="flex-1 py-1.5 rounded-[7px] text-[13px] font-medium transition-all"
                  style={
                    activeTab === tab
                      ? { background: 'var(--c-white)', color: 'var(--c-ink)', boxShadow: '0 1px 4px rgba(28,25,23,0.08)' }
                      : { color: 'var(--c-ink-2)' }
                  }
                >
                  {tab === 'login' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            {error && (
              <div
                className="mx-4 mb-3 px-3.5 py-2.5 rounded-[9px] text-[13px]"
                style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.18)', color: 'var(--c-red)' }}
              >
                {error}
              </div>
            )}

            {activeTab === 'login' ? (
              <form onSubmit={handleLogin} className="px-4 pb-5 space-y-3">
                <div className="rounded-[10px] overflow-hidden" style={{ background: 'var(--c-cream)', border: '1px solid var(--c-border)' }}>
                  <InputRow label="Email" type="email" placeholder="you@example.com" value={loginEmail} onChange={setLoginEmail} required disabled={isLoading} />
                  <InputRow label="Password" type="password" placeholder="Required" value={loginPassword} onChange={setLoginPassword} required disabled={isLoading} last />
                </div>
                <button type="submit" disabled={isLoading}
                  className="w-full text-white text-[14px] font-semibold py-[11px] rounded-[10px] disabled:opacity-50 transition-opacity hover:opacity-90"
                  style={{ background: 'var(--c-blue)' }}
                >
                  {isLoading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="px-4 pb-5 space-y-3">
                <div className="rounded-[10px] overflow-hidden" style={{ background: 'var(--c-cream)', border: '1px solid var(--c-border)' }}>
                  <InputRow label="Name" placeholder="Your name" value={username} onChange={setUsername} required disabled={isLoading} />
                  <InputRow label="Email" type="email" placeholder="you@example.com" value={signupEmail} onChange={setSignupEmail} required disabled={isLoading} />
                  <InputRow label="Password" type="password" placeholder="Required" value={signupPassword} onChange={setSignupPassword} required disabled={isLoading} last />
                </div>
                {signupPassword.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex gap-1 h-1">
                      {[0, 1, 2, 3].map(i => (
                        <div key={i} className="flex-1 rounded-full transition-all duration-300"
                          style={{ background: i < strength.score ? strength.color : 'var(--c-border)' }} />
                      ))}
                    </div>
                    <p className="text-[11px]" style={{ color: 'var(--c-ink-2)' }}>{strength.label}</p>
                  </div>
                )}
                <button type="submit" disabled={isLoading}
                  className="w-full text-white text-[14px] font-semibold py-[11px] rounded-[10px] disabled:opacity-50 transition-opacity hover:opacity-90"
                  style={{ background: 'var(--c-blue)' }}
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
