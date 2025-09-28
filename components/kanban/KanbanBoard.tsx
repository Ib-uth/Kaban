'use client';

import { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Task } from '@/types/kanban';
import { useKanban } from '@/hooks/useKanban';
import { Column } from './Column';
import { TaskDialog } from './TaskDialog';
import { ThemeSelector } from './ThemeSelector';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

const onboardingSteps: Step[] = [
  {
    target: '.kanban-header',
    content: 'Welcome to your Kanban Board! This is where you can manage your tasks and projects efficiently.',
    placement: 'bottom',
  },
  {
    target: '.theme-selector',
    content: 'Switch between different themes to customize your board appearance.',
    placement: 'bottom',
  },
  {
    target: '.kanban-columns',
    content: 'Your tasks are organized in columns. You can drag and drop tasks between columns to update their status.',
    placement: 'top',
  },
  {
    target: '.add-task-button',
    content: 'Click the + button to add new tasks to any column.',
    placement: 'left',
  },
  {
    target: '.task-card',
    content: 'Each task card shows the title, description, priority, and date. Click the menu to edit or delete tasks.',
    placement: 'top',
  },
];

export const KanbanBoard = () => {
  const {
    board,
    theme,
    showOnboarding,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTask,
    setTheme,
    setShowOnboarding,
  } = useKanban();

  const [taskDialog, setTaskDialog] = useState<{
    open: boolean;
    task?: Task | null;
    columnId?: string;
  }>({ open: false });

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
      // Reordering within the same column
      reorderTask(source.droppableId, source.index, destination.index);
    } else {
      // Moving to a different column
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

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setShowOnboarding(false);
    }
  };

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
        styles={{
          options: {
            primaryColor: theme === 'dark' ? '#3b82f6' : '#2563eb',
          },
        }}
      />

      {/* Header */}
      <header className="kanban-header border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Kanban Board</h1>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOnboarding(true)}
                className="gap-2"
              >
                <HelpCircle className="h-4 w-4" />
                Help
              </Button>
              <div className="theme-selector">
                <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="kanban-columns kanban-columns">
            {board.columnOrder.map((columnId) => {
              const column = board.columns[columnId];
              const tasks = column.taskIds.map((taskId) => board.tasks[taskId]);

              return (
                <Column
                  key={column.id}
                  column={column}
                  tasks={tasks}
                  onAddTask={handleAddTask}
                  onEditTask={handleEditTask}
                  onDeleteTask={deleteTask}
                />
              );
            })}
          </div>
        </DragDropContext>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/80 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center text-sm text-muted-foreground">
            © <a 
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

      {/* Task Dialog */}
      <TaskDialog
        open={taskDialog.open}
        onOpenChange={(open) => setTaskDialog({ open })}
        task={taskDialog.task}
        onSave={handleSaveTask}
        onUpdate={updateTask}
      />
    </div>
  );
};
