import React from 'react';
import { Plus, LogOut, Search } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface HeaderProps {
  onAddCard: () => void;
  onLogout: () => Promise<void>;
  onToggleSearch: () => void;
  isAddingCard: boolean;
}

const Header: React.FC<HeaderProps> = ({ onAddCard, onLogout, onToggleSearch, isAddingCard }) => (
  <header
    className="sticky top-0 z-20 flex items-center h-[52px] px-3"
    style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border-default)' }}
  >
    <button onClick={onLogout} className="flex items-center justify-center w-9 h-9 rounded-lg btn-ghost" style={{ color: 'var(--text-2)' }} aria-label="Sign out">
      <LogOut className="w-[15px] h-[15px]" />
    </button>

    <div className="flex-1 flex items-center justify-center gap-1.5">
      <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
        <path d="M28 4L12 26h10l-4 18 20-24H26z" fill="var(--brand-pink)" />
      </svg>
      <span className="text-[15px] font-semibold select-none" style={{ color: 'var(--text-1)' }}>Card Trooper</span>
    </div>

    <div className="flex items-center gap-0.5">
      <button onClick={onToggleSearch} className="flex items-center justify-center w-9 h-9 rounded-lg btn-ghost" style={{ color: 'var(--text-2)' }} aria-label="Search">
        <Search className="w-4 h-4" />
      </button>
      <button onClick={onAddCard} disabled={isAddingCard} className="flex items-center justify-center w-9 h-9 rounded-lg btn-ghost disabled:opacity-40" style={{ color: 'var(--brand-pink)' }} aria-label="Add card">
        {isAddingCard ? <LoadingSpinner /> : <Plus className="w-5 h-5" strokeWidth={2.2} />}
      </button>
    </div>
  </header>
);

export default Header;
