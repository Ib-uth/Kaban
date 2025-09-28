'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Archive, 
  Trash2, 
  Copy, 
  Download, 
  Upload,
  RefreshCw,
  CheckSquare,
  Square
} from 'lucide-react';

interface QuickActionsProps {
  selectedTasks: string[];
  onBulkAction: (action: string, taskIds: string[]) => void;
  onClearSelection: () => void;
  totalTasks: number;
}

export const QuickActions = ({ 
  selectedTasks, 
  onBulkAction, 
  onClearSelection,
  totalTasks 
}: QuickActionsProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBulkAction = async (action: string) => {
    setIsProcessing(true);
    try {
      await onBulkAction(action, selectedTasks);
      if (action !== 'select-all' && action !== 'deselect-all') {
        onClearSelection();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const hasSelection = selectedTasks.length > 0;

  return (
    <div className="flex items-center gap-2">
      {hasSelection && (
        <Badge variant="secondary" className="gap-1">
          {selectedTasks.length} selected
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-4 w-4 p-0 hover:bg-transparent"
          >
            ×
          </Button>
        </Badge>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            disabled={isProcessing}
          >
            <Zap className="h-4 w-4" />
            Quick Actions
            {isProcessing && <RefreshCw className="h-3 w-3 animate-spin" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Selection</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handleBulkAction('select-all')}>
            <CheckSquare className="mr-2 h-4 w-4" />
            Select All Tasks ({totalTasks})
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleBulkAction('deselect-all')}
            disabled={!hasSelection}
          >
            <Square className="mr-2 h-4 w-4" />
            Deselect All
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
          
          <DropdownMenuItem 
            onClick={() => handleBulkAction('duplicate')}
            disabled={!hasSelection}
          >
            <Copy className="mr-2 h-4 w-4" />
            Duplicate Selected ({selectedTasks.length})
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => handleBulkAction('archive')}
            disabled={!hasSelection}
          >
            <Archive className="mr-2 h-4 w-4" />
            Archive Selected
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => handleBulkAction('delete')}
            disabled={!hasSelection}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Priority Actions</DropdownMenuLabel>
          
          <DropdownMenuItem 
            onClick={() => handleBulkAction('set-priority-high')}
            disabled={!hasSelection}
          >
            <div className="w-4 h-4 mr-2 bg-red-500 rounded-full"></div>
            Set High Priority
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => handleBulkAction('set-priority-medium')}
            disabled={!hasSelection}
          >
            <div className="w-4 h-4 mr-2 bg-yellow-500 rounded-full"></div>
            Set Medium Priority
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => handleBulkAction('set-priority-low')}
            disabled={!hasSelection}
          >
            <div className="w-4 h-4 mr-2 bg-green-500 rounded-full"></div>
            Set Low Priority
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Data</DropdownMenuLabel>
          
          <DropdownMenuItem onClick={() => handleBulkAction('export-selected')}>
            <Download className="mr-2 h-4 w-4" />
            Export Selected Tasks
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => handleBulkAction('import-tasks')}>
            <Upload className="mr-2 h-4 w-4" />
            Import Tasks
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
