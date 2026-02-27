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
          className="w-7 h-7 flex items-center justify-center rounded-[6px] transition-colors"
          style={{ color: 'var(--c-ink-3)' }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--c-cream-2)';
            e.currentTarget.style.color = 'var(--c-ink-2)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--c-ink-3)';
          }}
          onClick={e => e.stopPropagation()}
          aria-label="Card options"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="rounded-[10px] min-w-[148px] p-1"
        style={{
          background: 'var(--c-white)',
          border: '1px solid var(--c-border)',
          boxShadow: '0 8px 24px rgba(28,25,23,0.12), 0 2px 6px rgba(28,25,23,0.06)',
        }}
      >
        <DropdownMenuItem
          onSelect={handleDeleteClick}
          className="rounded-[7px] text-[13px] py-2 px-2.5 cursor-pointer"
          style={{ color: 'var(--c-red)' }}
        >
          <Trash2 className="mr-2 h-3.5 w-3.5" />
          Delete Card
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CardMenu;
