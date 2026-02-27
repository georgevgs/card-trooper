import React from 'react';
import { Plus, LogOut, Search } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { ICONS } from '@/lib/icons';

interface HeaderProps {
  onAddCard: () => void;
  onLogout: () => Promise<void>;
  onToggleSearch: () => void;
  isAddingCard: boolean;
}

const Header: React.FC<HeaderProps> = ({ onAddCard, onLogout, onToggleSearch, isAddingCard }) => {
  return (
    <header
      className="sticky top-0 z-20 flex items-center h-[52px] px-3 bg-white"
      style={{ borderBottom: '1px solid var(--c-border)' }}
    >
      {/* Left: Logout */}
      <button
        onClick={onLogout}
        className="flex items-center justify-center w-9 h-9 rounded-[8px] transition-colors"
        style={{ color: 'var(--c-ink-2)' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--c-cream-2)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        aria-label="Sign out"
      >
        <LogOut className="w-[15px] h-[15px]" />
      </button>

      {/* Center: Wordmark */}
      <div className="flex-1 flex items-center justify-center gap-1.5">
        <img src={ICONS.wallet} alt="" className="w-6 h-6 object-contain" />
        <h1
          className="font-display italic select-none"
          style={{ fontSize: '17px', color: 'var(--c-ink)', letterSpacing: '-0.01em' }}
        >
          Card Trooper
        </h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={onToggleSearch}
          className="flex items-center justify-center w-9 h-9 rounded-[8px] transition-colors"
          style={{ color: 'var(--c-ink-2)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--c-cream-2)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          aria-label="Search"
        >
          <Search className="w-[16px] h-[16px]" />
        </button>
        <button
          onClick={onAddCard}
          disabled={isAddingCard}
          className="flex items-center justify-center w-9 h-9 rounded-[8px] transition-colors disabled:opacity-40"
          style={{ color: 'var(--c-blue)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--c-cream-2)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          aria-label="Add card"
        >
          {isAddingCard ? <LoadingSpinner /> : <Plus className="w-[20px] h-[20px]" strokeWidth={2.2} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
