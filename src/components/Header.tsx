import React from 'react';
import { Plus, LogOut, Search } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface HeaderProps {
  onAddCard: () => void;
  onLogout: () => Promise<void>;
  onToggleSearch: () => void;
  isAddingCard: boolean;
}

/* 3-part bolt matching the reference: upper triangle + lower triangle + dark overlap diamond */
const BrandBolt: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size * 1.47} viewBox="0 0 60 88" fill="none" className="shrink-0">
    <path d="M44 0L16 48h28z" fill="#FF2D78" />
    <path d="M16 40h28L16 88z" fill="#4DA6FF" />
    <path d="M21 40h23L39 48H16z" fill="#1B1464" />
  </svg>
);

const Header: React.FC<HeaderProps> = ({ onAddCard, onLogout, onToggleSearch, isAddingCard }) => (
  <header className="sticky top-0 z-20" style={{ background: 'var(--surface)' }}>
    {/* Brand accent strip */}
    <div className="h-[3px] w-full" style={{ background: 'linear-gradient(90deg, #FF2D78 0%, #FF6B35 25%, #E8FF00 50%, #00C9A7 75%, #4DA6FF 100%)' }} />

    <div className="flex items-center h-[52px] px-3" style={{ borderBottom: '1px solid var(--border-default)' }}>
      <button onClick={onLogout} className="flex items-center justify-center w-9 h-9 rounded-lg btn-ghost" style={{ color: 'var(--text-2)' }} aria-label="Sign out">
        <LogOut className="w-[15px] h-[15px]" />
      </button>

      <div className="flex-1 flex items-center justify-center gap-2">
        <BrandBolt size={16} />
        <span className="text-[15px] font-bold tracking-[-0.01em] select-none" style={{ color: 'var(--text-1)' }}>
          Card Trooper
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button onClick={onToggleSearch} className="flex items-center justify-center w-9 h-9 rounded-lg btn-ghost" style={{ color: 'var(--text-2)' }} aria-label="Search">
          <Search className="w-4 h-4" />
        </button>
        <button
          onClick={onAddCard}
          disabled={isAddingCard}
          className="flex items-center justify-center h-8 px-3 rounded-full btn-primary text-[13px] gap-1 disabled:opacity-40"
          aria-label="Add card"
        >
          {isAddingCard ? (
            <LoadingSpinner />
          ) : (
            <>
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              <span className="hidden sm:inline font-semibold">Add</span>
            </>
          )}
        </button>
      </div>
    </div>
  </header>
);

export default Header;
