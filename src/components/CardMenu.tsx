import React from 'react';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type CardMenuProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onDeleteClick: () => void;
};

const CardMenu = ({ isOpen, onOpenChange, onDeleteClick }: CardMenuProps) => {
  const handleDeleteClick = (event: Event) => {
    event.preventDefault();
    onDeleteClick();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          className="w-8 h-8 flex items-center justify-center text-[#8E8E93] hover:text-[#3C3C43] rounded-full hover:bg-[#F2F2F7] transition-colors"
          onClick={(e) => e.stopPropagation()}
          aria-label="Card options"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-white/90 backdrop-blur-xl border border-[#E5E5EA] rounded-[12px] shadow-lg min-w-[160px]"
      >
        <DropdownMenuItem
          onSelect={handleDeleteClick}
          className="text-[#FF3B30] focus:text-[#FF3B30] focus:bg-[#FF3B30]/5 rounded-[8px] text-[15px] py-2.5"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CardMenu;
