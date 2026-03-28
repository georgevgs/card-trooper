import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';
import { ICONS } from '@/lib/icons';

interface WelcomePageProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (username: string, email: string, password: string) => Promise<void>;
}

function getPasswordStrength(pw: string) {
  if (!pw.length) return { score: 0, label: '', color: '' };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return [
    { score: s, label: 'Weak', color: 'var(--red)' },
    { score: s, label: 'Fair', color: 'var(--amber)' },
    { score: s, label: 'Good', color: 'var(--brand-pink)' },
    { score: s, label: 'Strong', color: 'var(--green)' },
    { score: s, label: 'Strong', color: 'var(--green)' },
  ][s];
}

const Field: React.FC<{
  label: string; type?: string; placeholder: string;
  value: string; onChange: (v: string) => void;
  required?: boolean; disabled?: boolean; last?: boolean;
}> = ({ label, type = 'text', placeholder, value, onChange, required, disabled, last }) => (
  <div
    className="flex items-center px-4 gap-3"
    style={{ borderBottom: last ? 'none' : '1px solid var(--border-default)' }}
  >
    <label className="text-[13px] font-medium w-20 shrink-0 py-3 select-none" style={{ color: 'var(--text-2)' }}>
      {label}
    </label>
    <input
      type={type} placeholder={placeholder} value={value}
      onChange={e => onChange(e.target.value)}
      required={required} disabled={disabled}
      className="flex-1 py-3 bg-transparent outline-none disabled:opacity-50"
      style={{ color: 'var(--text-1)' }}
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
    catch (err) { setError(err instanceof Error ? err.message : 'Login failed. Check your credentials.'); }
    finally { setIsLoading(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setIsLoading(true);
    try { await onRegister(username, signupEmail, signupPassword); }
    catch (err) { setError(err instanceof Error ? err.message : 'Registration failed. Try again.'); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <nav
        className="flex justify-between items-center px-5 h-[52px]"
        style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border-default)' }}
      >
        <div className="flex items-center gap-2">
          <svg width="16" height="24" viewBox="0 0 60 88" fill="none" className="shrink-0">
            <path d="M44 0L16 48h28z" fill="#FF2D78" />
            <path d="M16 40h28L16 88z" fill="#4DA6FF" />
            <path d="M21 40h23L39 48H16z" fill="#1B1464" />
          </svg>
          <span className="text-[15px] font-bold tracking-[-0.01em]" style={{ color: 'var(--text-1)' }}>Card Trooper</span>
        </div>
        <button
          onClick={() => openAuth('login')}
          className="text-[14px] font-medium px-3 py-1.5 rounded-lg btn-ghost-accent"
        >
          Sign In
        </button>
      </nav>

      <main className="flex-1 flex flex-col justify-center items-center text-center px-6 py-16">
        <div className="anim-slide-up">
          <img src={ICONS.wallet} alt="" className="w-20 h-20 sm:w-24 sm:h-24 object-contain mx-auto mb-6" />
        </div>

        <h1
          className="text-[36px] sm:text-[48px] font-bold leading-[1.1] mb-4 anim-slide-up"
          style={{ color: 'var(--text-1)', letterSpacing: '-0.02em', animationDelay: '50ms' }}
        >
          All your cards,<br />
          <span style={{ color: 'var(--brand-pink)' }}>one place.</span>
        </h1>

        <p
          className="text-[15px] leading-relaxed max-w-[280px] mb-10 anim-slide-up"
          style={{ color: 'var(--text-2)', animationDelay: '100ms' }}
        >
          Store every loyalty card and scan instantly at checkout.
        </p>

        <div className="flex flex-col w-full max-w-[260px] gap-2.5 anim-slide-up" style={{ animationDelay: '150ms' }}>
          <button
            onClick={() => openAuth('signup')}
            className="w-full text-[15px] py-3 rounded-lg btn-primary"
          >
            Get Started
          </button>
          <button
            onClick={() => openAuth('login')}
            className="w-full text-[15px] py-3 rounded-lg btn-outline"
          >
            Sign In
          </button>
        </div>

        <div className="mt-8 flex items-center gap-1.5 text-[12px] anim-slide-up" style={{ color: 'var(--text-3)', animationDelay: '200ms' }}>
          <Lock className="w-3 h-3" />
          <span>Secured with HTTP-only cookies</span>
        </div>
      </main>

      <footer className="pb-8 text-center text-[12px]" style={{ color: 'var(--text-3)' }}>
        &copy; 2026 Card Trooper
      </footer>

      {isAuthOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          onClick={e => { if (e.target === e.currentTarget) setIsAuthOpen(false); }}
        >
          <div className="absolute inset-0 overlay anim-fade-in" onClick={() => setIsAuthOpen(false)} />

          <div
            className="relative w-full sm:max-w-[380px] rounded-t-2xl sm:rounded-xl z-10 overflow-hidden anim-slide-up"
            style={{ background: 'var(--surface)', boxShadow: 'var(--shadow-overlay)' }}
          >
            <div className="flex justify-center pt-3 sm:hidden">
              <div className="w-8 h-1 rounded-full" style={{ background: 'var(--border-strong)' }} />
            </div>

            <div className="flex items-center justify-between px-5 pt-4 pb-3" style={{ borderBottom: '1px solid var(--border-default)' }}>
              <h2 className="text-[18px] font-semibold" style={{ color: 'var(--text-1)' }}>
                {activeTab === 'login' ? 'Sign in' : 'Create account'}
              </h2>
              <button
                onClick={() => setIsAuthOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center btn-ghost"
                style={{ color: 'var(--text-3)' }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mx-4 mt-3 mb-4 p-0.5 flex rounded-lg" style={{ background: 'var(--surface-hover)' }}>
              {(['login', 'signup'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setError(''); }}
                  className="flex-1 py-1.5 rounded-md text-[13px] font-medium transition-all"
                  style={
                    activeTab === tab
                      ? { background: 'var(--surface)', color: 'var(--text-1)', boxShadow: 'var(--shadow-xs)' }
                      : { color: 'var(--text-3)' }
                  }
                >
                  {tab === 'login' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            {error && (
              <div className="mx-4 mb-3 px-3 py-2.5 rounded-lg text-[13px]" style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: 'var(--red)' }}>
                {error}
              </div>
            )}

            {activeTab === 'login' ? (
              <form onSubmit={handleLogin} className="px-4 pb-5 space-y-3">
                <div className="rounded-lg overflow-hidden" style={{ background: 'var(--bg)', border: '1px solid var(--border-default)' }}>
                  <Field label="Email" type="email" placeholder="you@example.com" value={loginEmail} onChange={setLoginEmail} required disabled={isLoading} />
                  <Field label="Password" type="password" placeholder="Required" value={loginPassword} onChange={setLoginPassword} required disabled={isLoading} last />
                </div>
                <button type="submit" disabled={isLoading} className="w-full text-[14px] py-2.5 rounded-lg btn-primary">
                  {isLoading ? 'Signing in\u2026' : 'Sign In'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="px-4 pb-5 space-y-3">
                <div className="rounded-lg overflow-hidden" style={{ background: 'var(--bg)', border: '1px solid var(--border-default)' }}>
                  <Field label="Name" placeholder="Your name" value={username} onChange={setUsername} required disabled={isLoading} />
                  <Field label="Email" type="email" placeholder="you@example.com" value={signupEmail} onChange={setSignupEmail} required disabled={isLoading} />
                  <Field label="Password" type="password" placeholder="Required" value={signupPassword} onChange={setSignupPassword} required disabled={isLoading} last />
                </div>
                {signupPassword.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex gap-1 h-1">
                      {[0, 1, 2, 3].map(i => (
                        <div key={i} className="flex-1 rounded-full transition-all duration-200"
                          style={{ background: i < strength.score ? strength.color : 'var(--border-default)' }} />
                      ))}
                    </div>
                    <p className="text-[11px]" style={{ color: 'var(--text-2)' }}>{strength.label}</p>
                  </div>
                )}
                <button type="submit" disabled={isLoading} className="w-full text-[14px] py-2.5 rounded-lg btn-primary">
                  {isLoading ? 'Creating account\u2026' : 'Create Account'}
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
