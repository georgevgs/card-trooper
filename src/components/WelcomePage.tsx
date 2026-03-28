import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';

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

/* ── Tri-color bolt (matches the overlapping-triangle reference) ── */
const TriBolt: React.FC<{
  top: string; bottom: string; back: string;
  size: number; rotation?: number;
  style?: React.CSSProperties;
}> = ({ top, bottom, back, size, rotation = -25, style }) => (
  <svg
    width={size}
    height={size * 1.47}
    viewBox="0 0 60 88"
    fill="none"
    style={{ transform: `rotate(${rotation}deg)`, ...style }}
  >
    {/* Back layer — visible at edges */}
    <path d="M42 0L16 44h26z" fill={back} />
    <path d="M18 44h26L18 88z" fill={back} />
    {/* Upper triangle */}
    <path d="M40 2L18 44h22z" fill={top} />
    {/* Lower triangle */}
    <path d="M20 44h22L20 86z" fill={bottom} />
  </svg>
);

/* ── Bolt compositions — color combos from the reference ── */
const BOLTS = [
  { top: '#FF2D78', bottom: '#4DA6FF', back: '#1B1464', x: '-2%',  y: '2%',   s: 78, r: -25 },
  { top: '#E8FF00', bottom: '#00C9A7', back: '#7B2FF2', x: '26%',  y: '-6%',  s: 70, r: -20 },
  { top: '#FF6B35', bottom: '#7B2FF2', back: '#00C9A7', x: '54%',  y: '4%',   s: 74, r: -28 },
  { top: '#4DA6FF', bottom: '#FFA500', back: '#7B2FF2', x: '80%',  y: '-4%',  s: 66, r: -22 },
  { top: '#00C9A7', bottom: '#FF2D78', back: '#7B2FF2', x: '10%',  y: '46%',  s: 72, r: -30 },
  { top: '#FFA500', bottom: '#00C9A7', back: '#7B2FF2', x: '40%',  y: '40%',  s: 68, r: -24 },
  { top: '#FF2D78', bottom: '#1B1464', back: '#4DA6FF', x: '68%',  y: '48%',  s: 70, r: -26 },
  { top: '#E8FF00', bottom: '#7B2FF2', back: '#FF6B35', x: '92%',  y: '42%',  s: 64, r: -20 },
];

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
    <div className="min-h-screen flex flex-col overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Nav */}
      <nav
        className="relative z-10 flex justify-between items-center px-5 h-[52px]"
        style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border-default)' }}
      >
        <div className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
            <path d="M28 4L12 26h10l-4 18 20-24H26z" fill="var(--brand-pink)" />
          </svg>
          <span className="text-[15px] font-semibold" style={{ color: 'var(--text-1)' }}>Card Trooper</span>
        </div>
        <button
          onClick={() => openAuth('login')}
          className="text-[14px] font-medium px-3 py-1.5 rounded-lg btn-ghost-accent"
        >
          Sign In
        </button>
      </nav>

      <main className="flex-1 flex flex-col">
        {/* ── Bolt field ── */}
        <div className="relative w-full overflow-hidden anim-fade-in" style={{ height: 'clamp(220px, 36vh, 340px)' }}>
          {BOLTS.map((b, i) => (
            <TriBolt
              key={i}
              top={b.top} bottom={b.bottom} back={b.back}
              size={b.s} rotation={b.r}
              style={{ position: 'absolute', left: b.x, top: b.y }}
            />
          ))}
        </div>

        {/* ── Text + CTAs ── */}
        <div className="flex-1 flex flex-col items-center text-center px-6 pb-8" style={{ marginTop: '-16px' }}>
          <h1
            className="text-[38px] sm:text-[52px] font-extrabold leading-[1.05] mb-4 anim-slide-up"
            style={{ color: 'var(--text-1)', letterSpacing: '-0.03em' }}
          >
            All your cards,<br />
            <span style={{ color: 'var(--brand-pink)' }}>one tap.</span>
          </h1>

          <p
            className="text-[15px] leading-relaxed max-w-[280px] mb-10 anim-slide-up"
            style={{ color: 'var(--text-2)', animationDelay: '50ms' }}
          >
            Store every loyalty card and scan instantly at checkout.
          </p>

          <div className="flex flex-col w-full max-w-[260px] gap-2.5 anim-slide-up" style={{ animationDelay: '100ms' }}>
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

          <div className="mt-8 flex items-center gap-1.5 text-[12px] anim-slide-up" style={{ color: 'var(--text-3)', animationDelay: '150ms' }}>
            <Lock className="w-3 h-3" />
            <span>Secured with HTTP-only cookies</span>
          </div>
        </div>
      </main>

      <footer className="relative z-10 pb-8 text-center text-[12px]" style={{ color: 'var(--text-3)' }}>
        &copy; 2026 Card Trooper
      </footer>

      {/* ── Auth dialog ── */}
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
