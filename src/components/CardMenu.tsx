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
  onOpenChange: (open: boolean) => void;
  onDeleteClick: () => void;
};

const CardMenu = ({ isOpen, onOpenChange, onDeleteClick }: CardMenuProps) => (
  <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
    <DropdownMenuTrigger asChild>
      <button
        className="w-7 h-7 flex items-center justify-center rounded-md btn-ghost"
        style={{ color: 'var(--text-3)' }}
        onClick={e => e.stopPropagation()}
        aria-label="Card options"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      className="rounded-lg min-w-[140px] p-1"
      style={{ background: 'var(--surface)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-lg)' }}
    >
      <DropdownMenuItem
        onSelect={e => { e.preventDefault(); onDeleteClick(); }}
        className="rounded-md text-[13px] py-2 px-2.5 cursor-pointer"
        style={{ color: 'var(--red)' }}
      >
        <Trash2 className="mr-2 h-3.5 w-3.5" />
        Delete Card
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export default CardMenu;
