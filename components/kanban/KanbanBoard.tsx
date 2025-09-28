'use client';

import { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Task } from '@/types/kanban';
import { useKanban } from '@/hooks/useKanban';
import { Column } from './Column';
import { TaskDialog } from './TaskDialog';
import { ThemeSelector } from './ThemeSelector';
import { SearchBar } from './SearchBar';
import { FilterBar } from './FilterBar';
import { QuickActions } from './QuickActions';
import { Statistics } from './Statistics';
import { SettingsDialog } from './SettingsDialog';
import { Button } from '@/components/ui/button';
import { 
  Settings
} from 'lucide-react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

const onboardingSteps: Step[] = [
  {
    target: '.kanban-header',
    content: 'Welcome to TaskFlow! This powerful tool helps you manage tasks with advanced features.',
    placement: 'bottom',
  },
  {
    target: '.search-bar',
    content: 'Use the search bar to quickly find tasks by title, description, or tags.',
    placement: 'bottom',
  },
  {
    target: '.filter-bar',
    content: 'Filter tasks by priority, date range, or other criteria to focus on what matters.',
    placement: 'bottom',
  },
  {
    target: '.quick-actions',
    content: 'Select multiple tasks and use Quick Actions for bulk operations like duplicate, delete, or change priority.',
    placement: 'bottom',
  },
  {
    target: '.theme-selector',
    content: 'Switch between different themes to customize your board appearance.',
    placement: 'bottom',
  },
  {
    target: '.settings-button',
    content: 'Access board settings to manage columns, preferences, and export your data.',
    placement: 'bottom',
  },
  {
    target: '.statistics-toggle',
    content: 'Toggle statistics to see comprehensive analytics about your tasks and productivity.',
    placement: 'bottom',
  },
  {
    target: '.kanban-columns',
    content: 'Your tasks are organized in columns. Drag and drop tasks between columns, and use checkboxes to select multiple tasks.',
    placement: 'top',
  },
  {
    target: '.task-card',
    content: 'Each task card shows priority, tags, assignee, and due dates. Click the menu for more options.',
    placement: 'top',
  },
];

export const KanbanBoard = () => {
  const {
    board,
    theme,
    showOnboarding,
    settings,
    filters,
    searchQuery,
    selectedTasks,
    filteredTasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTask,
    bulkAction,
    updateColumns,
    setTheme,
    setShowOnboarding,
    setSettings,
    setFilters,
    setSearchQuery,
    setSelectedTasks,
    toggleTaskSelection,
  } = useKanban();

  const [taskDialog, setTaskDialog] = useState<{
    open: boolean;
    task?: Task | null;
    columnId?: string;
  }>({ open: false });

  const [settingsDialog, setSettingsDialog] = useState(false);
  const [showStats, setShowStats] = useState(settings.showStatistics);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      reorderTask(source.droppableId, source.index, destination.index);
    } else {
      moveTask(
        draggableId,
        source.droppableId,
        destination.droppableId,
        destination.index
      );
    }
  };

  const handleAddTask = (columnId: string) => {
    setTaskDialog({ open: true, columnId });
  };

  const handleEditTask = (task: Task) => {
    setTaskDialog({ open: true, task });
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (taskDialog.columnId) {
      addTask(taskDialog.columnId, taskData);
    }
  };

  const handleBulkAction = async (action: string, taskIds: string[]) => {
    await bulkAction(action, taskIds);
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setShowOnboarding(false);
    }
  };

  const getFilteredTasksForColumn = (columnId: string) => {
    const column = board.columns[columnId];
    return column.taskIds
      .map(taskId => filteredTasks[taskId])
      .filter(Boolean);
  };

  const totalFilteredTasks = Object.keys(filteredTasks).length;
  const totalTasks = Object.keys(board.tasks).length;

  const themeClasses = {
    light: 'bg-gray-50',
    dark: 'bg-gray-900 text-white',
    colorful: 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50',
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${themeClasses[theme]}`}>
      <Joyride
        steps={onboardingSteps}
        run={showOnboarding}
        continuous
        showProgress
        showSkipButton
        callback={handleJoyrideCallback}
        disableOverlayClose
        disableScrolling={false}
        disableCloseOnEsc={false}
        styles={{
          options: {
            primaryColor: theme === 'dark' ? '#3b82f6' : '#2563eb',
            zIndex: 10000,
          },
          spotlight: {
            borderRadius: 8,
            animation: 'none',
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            animation: 'none',
          },
          tooltip: {
            animation: 'none',
          },
          tooltipContainer: {
            animation: 'none',
          },
          tooltipTitle: {
            animation: 'none',
          },
          tooltipContent: {
            animation: 'none',
          },
          tooltipFooter: {
            animation: 'none',
          },
          tooltipFooterSpacer: {
            animation: 'none',
          },
          buttonNext: {
            animation: 'none',
          },
          buttonBack: {
            animation: 'none',
          },
          buttonSkip: {
            animation: 'none',
          },
          buttonClose: {
            animation: 'none',
          },
          beacon: {
            display: 'none !important',
          },
          beaconInner: {
            display: 'none !important',
          },
          beaconOuter: {
            display: 'none !important',
          },
        }}
      />

      {/* Header */}
      <header className={`kanban-header border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10 transition-colors duration-300 ${themeClasses[theme]}`}>
        <div className="container mx-auto px-4 py-3">
          {/* Single horizontal row */}
          <div className="flex items-center justify-between gap-4">
            {/* Left side - Logo */}
            <h1 className="text-lg md:text-xl font-bold whitespace-nowrap">TaskFlow</h1>
            
            {/* Center - Search Bar */}
            <div className="flex-1 max-w-md mx-4">
              <div className="search-bar">
                <SearchBar onSearch={setSearchQuery} />
              </div>
            </div>
            
            {/* Right side - All controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="filter-bar">
                <FilterBar filters={filters} onFilterChange={setFilters} />
              </div>
              <div className="quick-actions">
                <QuickActions
                  selectedTasks={selectedTasks}
                  onBulkAction={handleBulkAction}
                  onClearSelection={() => setSelectedTasks([])}
                  totalTasks={totalTasks}
                />
              </div>
              <div className="theme-selector">
                <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSettingsDialog(true)}
                className="gap-2 settings-button whitespace-nowrap"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </div>
          </div>

          {/* Results Summary */}
          {(searchQuery || filters.priority.length > 0 || filters.dateRange) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                Showing {totalFilteredTasks} of {totalTasks} tasks
              </span>
              {searchQuery && (
                <span>• Search: &quot;{searchQuery}&quot;</span>
              )}
              {filters.priority.length > 0 && (
                <span>• Priority: {filters.priority.join(', ')}</span>
              )}
              {filters.dateRange && (
                <span>• Date: {filters.dateRange}</span>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Statistics */}
      {showStats && (
        <div className={`container mx-auto px-4 py-6 transition-colors duration-300 ${themeClasses[theme]}`}>
          <Statistics
            tasks={board.tasks}
            columns={board.columns}
            columnOrder={board.columnOrder}
          />
        </div>
      )}

      {/* Main Content */}
      <main className={`container mx-auto px-4 py-6 transition-colors duration-300 ${themeClasses[theme]}`}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="kanban-columns">
            {board.columnOrder.map((columnId) => {
              const column = board.columns[columnId];
              const tasks = getFilteredTasksForColumn(columnId);

              return (
                <Column
                  key={column.id}
                  column={column}
                  tasks={tasks}
                  onAddTask={handleAddTask}
                  onEditTask={handleEditTask}
                  onDeleteTask={deleteTask}
                  selectedTasks={selectedTasks}
                  onToggleTaskSelection={toggleTaskSelection}
                  showTaskCount={settings.showTaskCount}
                  compactMode={settings.compactMode}
                />
              );
            })}
          </div>
        </DragDropContext>
      </main>

      {/* Footer */}
      <footer className={`border-t bg-background/80 backdrop-blur-sm mt-auto transition-colors duration-300 ${themeClasses[theme]}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="text-center text-sm text-muted-foreground">
            © TaskFlow by <a 
              href="https://LinkedIn.com/in/ibraheem-uthman" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors underline"
            >
              Ibraheem Uthman
            </a>
          </div>
        </div>
      </footer>

      {/* Dialogs */}
      <TaskDialog
        open={taskDialog.open}
        onOpenChange={(open) => setTaskDialog({ open })}
        task={taskDialog.task}
        onSave={handleSaveTask}
        onUpdate={updateTask}
      />

      <SettingsDialog
        open={settingsDialog}
        onOpenChange={setSettingsDialog}
        columns={board.columns}
        columnOrder={board.columnOrder}
        onUpdateColumns={updateColumns}
        settings={settings}
        onUpdateSettings={setSettings}
        onShowHelp={() => setShowOnboarding(true)}
        onToggleStats={() => setShowStats(!showStats)}
        showStats={showStats}
      />
    </div>
  );
};
