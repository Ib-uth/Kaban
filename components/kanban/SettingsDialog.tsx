'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus } from 'lucide-react';
import { Column } from '@/types/kanban';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: { [key: string]: Column };
  columnOrder: string[];
  onUpdateColumns: (columns: { [key: string]: Column }, columnOrder: string[]) => void;
  settings: {
    autoSave: boolean;
    showTaskCount: boolean;
    compactMode: boolean;
    enableNotifications: boolean;
  };
  onUpdateSettings: (settings: {
    autoSave: boolean;
    showTaskCount: boolean;
    compactMode: boolean;
    enableNotifications: boolean;
  }) => void;
}

export const SettingsDialog = ({
  open,
  onOpenChange,
  columns,
  columnOrder,
  onUpdateColumns,
  settings,
  onUpdateSettings,
}: SettingsDialogProps) => {
  const [localColumns, setLocalColumns] = useState(columns);
  const [localColumnOrder, setLocalColumnOrder] = useState(columnOrder);
  const [localSettings, setLocalSettings] = useState(settings);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const addColumn = () => {
    if (!newColumnTitle.trim()) return;

    const newColumnId = `column-${Date.now()}`;
    const newColumn: Column = {
      id: newColumnId,
      title: newColumnTitle.trim(),
      taskIds: [],
    };

    setLocalColumns(prev => ({ ...prev, [newColumnId]: newColumn }));
    setLocalColumnOrder(prev => [...prev, newColumnId]);
    setNewColumnTitle('');
  };

  const deleteColumn = (columnId: string) => {
    const newColumns = { ...localColumns };
    delete newColumns[columnId];
    
    setLocalColumns(newColumns);
    setLocalColumnOrder(prev => prev.filter(id => id !== columnId));
  };

  const updateColumnTitle = (columnId: string, title: string) => {
    setLocalColumns(prev => ({
      ...prev,
      [columnId]: { ...prev[columnId], title },
    }));
  };

  const handleSave = () => {
    onUpdateColumns(localColumns, localColumnOrder);
    onUpdateSettings(localSettings);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setLocalColumns(columns);
    setLocalColumnOrder(columnOrder);
    setLocalSettings(settings);
    onOpenChange(false);
  };

  const exportData = () => {
    const data = {
      columns: localColumns,
      columnOrder: localColumnOrder,
      settings: localSettings,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kanban-board-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Board Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Column Management */}
          <div>
            <h3 className="text-lg font-medium mb-3">Manage Columns</h3>
            <div className="space-y-3">
              {localColumnOrder.map((columnId) => {
                const column = localColumns[columnId];
                return (
                  <div key={columnId} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Input
                      value={column.title}
                      onChange={(e) => updateColumnTitle(columnId, e.target.value)}
                      className="flex-1"
                    />
                    <Badge variant="secondary">
                      {column.taskIds.length} tasks
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteColumn(columnId)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
              
              <div className="flex gap-2">
                <Input
                  placeholder="New column title..."
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addColumn()}
                />
                <Button onClick={addColumn} disabled={!newColumnTitle.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* General Settings */}
          <div>
            <h3 className="text-lg font-medium mb-3">General Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-save">Auto Save</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically save changes to local storage
                  </p>
                </div>
                <Switch
                  id="auto-save"
                  checked={localSettings.autoSave}
                  onCheckedChange={(checked) =>
                    setLocalSettings(prev => ({ ...prev, autoSave: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-count">Show Task Count</Label>
                  <p className="text-sm text-muted-foreground">
                    Display task count in column headers
                  </p>
                </div>
                <Switch
                  id="show-count"
                  checked={localSettings.showTaskCount}
                  onCheckedChange={(checked) =>
                    setLocalSettings(prev => ({ ...prev, showTaskCount: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="compact-mode">Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Use smaller cards and reduced spacing
                  </p>
                </div>
                <Switch
                  id="compact-mode"
                  checked={localSettings.compactMode}
                  onCheckedChange={(checked) =>
                    setLocalSettings(prev => ({ ...prev, compactMode: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Show browser notifications for updates
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={localSettings.enableNotifications}
                  onCheckedChange={(checked) =>
                    setLocalSettings(prev => ({ ...prev, enableNotifications: checked }))
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Data Management */}
          <div>
            <h3 className="text-lg font-medium mb-3">Data Management</h3>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportData}>
                Export Board Data
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (confirm('This will clear all your data. Are you sure?')) {
                    localStorage.removeItem('kanban-board');
                    window.location.reload();
                  }
                }}
                className="text-red-600 hover:text-red-700"
              >
                Reset Board
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
