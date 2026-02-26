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
    <header className="flex justify-between items-center mb-6 pt-safe">
      {/* Left: Logout */}
      <button
        onClick={onLogout}
        className="w-9 h-9 flex items-center justify-center text-[#007AFF] rounded-full active:bg-[#007AFF]/10 transition-colors"
        aria-label="Sign out"
      >
        <LogOut className="w-[18px] h-[18px]" />
      </button>

      {/* Center: Title */}
      <h1 className="text-[17px] font-semibold text-[#1C1C1E] tracking-tight">
        Card Trooper
      </h1>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={onToggleSearch}
          className="w-9 h-9 flex items-center justify-center text-[#007AFF] rounded-full active:bg-[#007AFF]/10 transition-colors"
          aria-label="Search"
        >
          <Search className="w-[18px] h-[18px]" />
        </button>
        <button
          onClick={onAddCard}
          disabled={isAddingCard}
          className="w-9 h-9 flex items-center justify-center text-[#007AFF] rounded-full active:bg-[#007AFF]/10 transition-colors disabled:opacity-40"
          aria-label="Add card"
        >
          {isAddingCard ? (
            <LoadingSpinner />
          ) : (
            <Plus className="w-[22px] h-[22px]" strokeWidth={2} />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
