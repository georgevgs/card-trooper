import React from 'react';
import { Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingSpinner from './LoadingSpinner';

interface HeaderProps {
  onAddCard: () => void;
  onLogout: () => Promise<void>;
  isAddingCard: boolean;
}

const Header: React.FC<HeaderProps> = ({ onAddCard, onLogout, isAddingCard }) => {
  return (
    <header className="flex justify-between items-center mb-6">
      <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
        My Store Cards
      </h1>
      <div className="flex space-x-2">
        <Button
          onClick={onAddCard}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all duration-300 ease-in-out transform hover:scale-105"
          disabled={isAddingCard}
        >
          {isAddingCard ? (
            <LoadingSpinner />
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" /> Add Card
            </>
          )}
        </Button>
        <Button
          onClick={onLogout}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
