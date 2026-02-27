import React from 'react';
import { Plus, LogOut, Search } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface HeaderProps {
  onAddCard: () => void;
  onLogout: () => Promise<void>;
  onToggleSearch: () => void;
  isAddingCard: boolean;
}

const Header: React.FC<HeaderProps> = ({ onAddCard, onLogout, onToggleSearch, isAddingCard }) => {
  return (
    <header
      className="sticky top-0 z-20 flex items-center h-11 px-2 mac-toolbar border-b"
      style={{ borderColor: 'var(--mac-border)' }}
    >
      {/* Left: Logout */}
      <button
        onClick={onLogout}
        className="flex items-center justify-center w-8 h-8 rounded-[6px] text-[#007AFF] transition-colors"
        style={{ ':hover': { background: 'var(--mac-hover)' } } as React.CSSProperties}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--mac-hover)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        aria-label="Sign out"
      >
        <LogOut className="w-[15px] h-[15px]" />
      </button>

      {/* Center: Title */}
      <h1 className="flex-1 text-center text-[13px] font-semibold text-[#1C1C1E] dark:text-white/90 tracking-tight select-none">
        Card Trooper
      </h1>

      {/* Right: Actions */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={onToggleSearch}
          className="flex items-center justify-center w-8 h-8 rounded-[6px] text-[#007AFF] transition-colors"
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--mac-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          aria-label="Search"
        >
          <Search className="w-[15px] h-[15px]" />
        </button>
        <button
          onClick={onAddCard}
          disabled={isAddingCard}
          className="flex items-center justify-center w-8 h-8 rounded-[6px] text-[#007AFF] transition-colors disabled:opacity-40"
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--mac-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          aria-label="Add card"
        >
          {isAddingCard ? (
            <LoadingSpinner />
          ) : (
            <Plus className="w-[18px] h-[18px]" strokeWidth={2} />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
