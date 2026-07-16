import React, { useState } from 'react';
import { LogOut, User } from 'lucide-react';

interface HeaderProps {
  cardCount: number;
  onLogout: () => Promise<void>;
}

const Header: React.FC<HeaderProps> = ({ cardCount, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const subtitle = cardCount > 0
    ? `${cardCount} loyalty ${cardCount === 1 ? 'card' : 'cards'} · always with you`
    : 'All your cards, always with you';

  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-[32px] font-extrabold tracking-[-0.03em] leading-tight" style={{ color: 'var(--text-1)' }}>
          Wallet
        </h1>
        <p className="text-[14px] font-medium mt-0.5" style={{ color: 'var(--text-3)' }}>{subtitle}</p>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(v => !v)}
          className="w-11 h-11 rounded-full flex items-center justify-center"
          style={{ background: 'var(--accent)', color: '#FFFFFF', boxShadow: '0 6px 14px -4px rgba(240,85,61,0.6)' }}
          aria-label="Account"
          aria-expanded={isMenuOpen}
        >
          <User className="w-5 h-5" strokeWidth={2.4} />
        </button>

        {isMenuOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setIsMenuOpen(false)} />
            <div
              className="absolute right-0 top-[52px] z-40 rounded-2xl overflow-hidden anim-scale-in"
              style={{ background: 'var(--surface)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-overlay)' }}
            >
              <button
                onClick={() => { setIsMenuOpen(false); onLogout(); }}
                className="flex items-center gap-2.5 px-4 py-3 w-40 btn-ghost text-[14px] font-bold"
                style={{ color: 'var(--text-1)' }}
              >
                <LogOut className="w-4 h-4" style={{ color: 'var(--text-2)' }} />
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
