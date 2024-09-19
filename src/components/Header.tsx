import React from 'react';
import { Plus, LogOut, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingSpinner from './LoadingSpinner';

interface HeaderProps {
  onAddCard: () => void;
  onLogout: () => Promise<void>;
  onToggleSearch: () => void;
  isAddingCard: boolean;
}

const Header: React.FC<HeaderProps> = ({ onAddCard, onLogout, onToggleSearch, isAddingCard }) => {
  return (
    <header className="flex justify-between items-center mb-6">
      <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
        Card Trooper
      </h1>
      <div className="flex items-center space-x-2">
        <Button
          onClick={onToggleSearch}
          variant="outline"
          className="bg-white hover:bg-gray-100 text-purple-600 transition-all duration-300 ease-in-out transform hover:scale-105 w-12 h-12 sm:w-auto sm:h-auto sm:px-4 sm:py-2"
        >
          <Search className="h-6 w-6 sm:h-5 sm:w-5 sm:mr-2" />
          <span className="hidden sm:inline">Search</span>
        </Button>
        <Button
          onClick={onAddCard}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all duration-300 ease-in-out transform hover:scale-105 w-12 h-12 sm:w-auto sm:h-auto sm:px-4 sm:py-2"
          disabled={isAddingCard}
        >
          {isAddingCard ? (
            <LoadingSpinner />
          ) : (
            <>
              <Plus className="h-6 w-6 sm:h-5 sm:w-5 sm:mr-2" />
              <span className="hidden sm:inline">Add Card</span>
            </>
          )}
        </Button>
        <Button
          onClick={onLogout}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all duration-300 ease-in-out transform hover:scale-105 w-12 h-12 sm:w-auto sm:h-auto sm:px-4 sm:py-2"
        >
          <LogOut className="h-6 w-6 sm:h-5 sm:w-5 sm:mr-2" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
