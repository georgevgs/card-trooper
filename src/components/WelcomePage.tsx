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

const MacInput: React.FC<{
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}> = ({ label, type = 'text', placeholder, value, onChange, required, disabled, isFirst, isLast }) => (
  <div
    className={`flex items-center px-3 gap-3 ${!isLast ? 'border-b' : ''}`}
    style={{ borderColor: 'var(--mac-border)' }}
  >
    <label className="text-[13px] text-foreground w-20 shrink-0 py-2.5 select-none">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className="flex-1 py-2.5 bg-transparent outline-none text-foreground placeholder:text-muted-foreground disabled:opacity-50"
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
    <div className="min-h-screen w-full bg-background flex flex-col">
      {/* Toolbar */}
      <nav
        className="flex justify-between items-center px-4 h-11 mac-toolbar border-b sticky top-0 z-10"
        style={{ borderColor: 'var(--mac-border)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#007AFF] rounded-[6px] flex items-center justify-center">
            <CreditCard className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-[13px] font-semibold text-foreground tracking-tight">
            Card Trooper
          </span>
        </div>
        <button
          onClick={() => openAuth('login')}
          className="text-[#007AFF] text-[13px] font-medium px-3 py-1.5 rounded-[6px] transition-colors"
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--mac-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          Sign In
        </button>
      </nav>

      {/* Hero */}
      <main className="flex-grow flex flex-col justify-center items-center text-center px-6 py-16">
        <div
          className="w-16 h-16 bg-[#007AFF] rounded-[16px] flex items-center justify-center mb-7"
          style={{ boxShadow: '0 8px 24px rgba(0,122,255,0.28)' }}
        >
          <CreditCard className="w-8 h-8 text-white" strokeWidth={1.5} />
        </div>

        <h1 className="text-[36px] font-bold text-foreground leading-tight tracking-tight mb-3">
          All Your Cards,
          <br />
          One Place.
        </h1>

        <p className="text-[15px] text-muted-foreground leading-relaxed max-w-sm mb-9">
          Store and access all your loyalty and store cards. Just tap and scan.
        </p>

        <div className="flex flex-col w-full max-w-xs gap-2.5">
          <button
            onClick={() => openAuth('signup')}
            className="w-full bg-[#007AFF] text-white text-[15px] font-semibold py-[11px] rounded-[8px] transition-opacity hover:opacity-90 active:opacity-80"
          >
            Get Started
          </button>
          <button
            onClick={() => openAuth('login')}
            className="w-full text-[15px] font-medium py-[11px] rounded-[8px] transition-colors border text-foreground"
            style={{
              background: 'hsl(var(--card))',
              borderColor: 'var(--mac-border-strong)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--mac-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'hsl(var(--card))')}
          >
            Sign In
          </button>
        </div>

        <div className="mt-7 flex items-center gap-1.5 text-[12px]" style={{ color: 'var(--mac-section)' }}>
          <Shield className="w-3 h-3" />
          <span>Secured with HTTP-only cookies</span>
        </div>
      </main>

      <footer className="pb-8 text-center text-[12px]" style={{ color: 'var(--mac-section)' }}>
        © 2026 Card Trooper
      </footer>

      {/* Auth dialog */}
      {isAuthOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          onClick={(e) => { if (e.target === e.currentTarget) setIsAuthOpen(false); }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 backdrop-blur-sm"
            style={{ background: 'rgba(0,0,0,0.35)' }}
            onClick={() => setIsAuthOpen(false)}
          />

          {/* Dialog */}
          <div
            className="relative w-full sm:max-w-sm mac-sheet rounded-t-[14px] sm:rounded-[14px] z-10 overflow-hidden"
            style={{ border: '1px solid var(--mac-border-strong)', boxShadow: 'var(--mac-shadow-dialog)' }}
          >
            {/* Drag handle (mobile only) */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-8 h-1 rounded-full" style={{ background: 'var(--mac-border-strong)' }} />
            </div>

            {/* Header */}
            <div
              className="flex items-center justify-between px-4 pt-4 pb-3 border-b"
              style={{ borderColor: 'var(--mac-border)' }}
            >
              <h2 className="text-[15px] font-semibold text-foreground">
                {activeTab === 'login' ? 'Sign In' : 'Create Account'}
              </h2>
              <button
                onClick={() => setIsAuthOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors text-muted-foreground"
                style={{ background: 'var(--mac-input-bg)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--mac-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--mac-input-bg)')}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Segmented Control */}
            <div
              className="mx-4 mt-3 mb-4 rounded-[7px] p-0.5 flex"
              style={{ background: 'var(--mac-input-bg)' }}
            >
              {(['login', 'signup'] as const).map((tab) => (
                <button
                  key={tab}
                  className="flex-1 py-1.5 rounded-[5px] text-[13px] font-medium transition-all"
                  style={
                    activeTab === tab
                      ? {
                          background: 'hsl(var(--card))',
                          color: 'hsl(var(--foreground))',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        }
                      : { color: 'var(--mac-section)' }
                  }
                  onClick={() => { setActiveTab(tab); setError(''); }}
                >
                  {tab === 'login' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            {error && (
              <div className="mx-4 mb-3 px-3 py-2.5 rounded-[8px] bg-[#FF3B30]/10 border border-[#FF3B30]/20 text-[#FF3B30] text-[13px]">
                {error}
              </div>
            )}

            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="px-4 pb-4 space-y-3">
                <div
                  className="rounded-[8px] overflow-hidden border"
                  style={{ background: 'hsl(var(--card))', borderColor: 'var(--mac-border)' }}
                >
                  <MacInput label="Email" type="email" placeholder="you@example.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required disabled={isLoading} isFirst />
                  <MacInput label="Password" type="password" placeholder="Required" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required disabled={isLoading} isLast />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#007AFF] text-white text-[14px] font-semibold py-[9px] rounded-[8px] disabled:opacity-50 transition-opacity hover:opacity-90"
                >
                  {isLoading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="px-4 pb-4 space-y-3">
                <div
                  className="rounded-[8px] overflow-hidden border"
                  style={{ background: 'hsl(var(--card))', borderColor: 'var(--mac-border)' }}
                >
                  <MacInput label="Name" placeholder="Your name" value={username} onChange={e => setUsername(e.target.value)} required disabled={isLoading} isFirst />
                  <MacInput label="Email" type="email" placeholder="you@example.com" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} required disabled={isLoading} />
                  <MacInput label="Password" type="password" placeholder="Required" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} required disabled={isLoading} isLast />
                </div>
                {signupPassword.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex gap-1 h-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-full transition-all duration-300 ${
                            i < passwordStrength.score ? passwordStrength.color : 'bg-[#E5E5EA] dark:bg-[#3A3A3C]'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-[11px] text-muted-foreground">{passwordStrength.label}</p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#007AFF] text-white text-[14px] font-semibold py-[9px] rounded-[8px] disabled:opacity-50 transition-opacity hover:opacity-90"
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
