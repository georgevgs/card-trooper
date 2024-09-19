import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
  placeholder?: string;
}

const SearchField = ({
  value,
  onChange,
  isExpanded,
  onToggle,
  placeholder = 'Search cards...',
}: SearchFieldProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {isExpanded ? (
        <div className="flex items-center">
          <Input
            type="search"
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className="pl-4 pr-10 py-2 w-full rounded-lg border-2 border-purple-300 focus:border-purple-500 transition duration-300 ease-in-out"
          />
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-10 top-1/2 transform -translate-y-1/2"
              onClick={handleClear}
            >
              <X className="h-4 w-4 text-gray-400" />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={onToggle}
          >
            <Search className="h-5 w-5 text-purple-500" />
          </Button>
        </div>
      ) : (
        <Button type="button" variant="outline" size="icon" className="ml-auto" onClick={onToggle}>
          <Search className="h-5 w-5 text-purple-500" />
        </Button>
      )}
    </div>
  );
};

export default SearchField;
