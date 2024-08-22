import React from 'react';
import { Button } from '@/components/ui/button';
import { MoreVertical, Trash2 } from 'lucide-react';
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
        <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={handleDeleteClick}>
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CardMenu;
