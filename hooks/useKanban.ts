'use client';

import { useState, useEffect } from 'react';
import { Board, Task, Column, Theme, KanbanState } from '@/types/kanban';

const initialBoard: Board = {
  tasks: {
    'task-1': {
      id: 'task-1',
      title: 'Welcome to your Kanban Board!',
      description: 'This is your first task. You can edit or delete it.',
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    'task-2': {
      id: 'task-2',
      title: 'Try dragging this task',
      description: 'Drag and drop tasks between columns to organize your workflow.',
      priority: 'high',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    'task-3': {
      id: 'task-3',
      title: 'Change themes',
      description: 'Click the theme button to switch between light, dark, and colorful themes.',
      priority: 'low',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: ['task-1', 'task-2'],
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: [],
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      taskIds: ['task-3'],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
};

export const useKanban = () => {
  const [state, setState] = useState<KanbanState>({
    board: initialBoard,
    theme: 'light',
    showOnboarding: true,
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('kanban-board');
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        // Convert date strings back to Date objects
        Object.keys(parsedState.board.tasks).forEach(taskId => {
          parsedState.board.tasks[taskId].createdAt = new Date(parsedState.board.tasks[taskId].createdAt);
          parsedState.board.tasks[taskId].updatedAt = new Date(parsedState.board.tasks[taskId].updatedAt);
        });
        setState(parsedState);
      } catch (error) {
        console.error('Failed to load saved board:', error);
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('kanban-board', JSON.stringify(state));
  }, [state]);

  const addTask = (columnId: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const taskId = `task-${Date.now()}`;
    const newTask: Task = {
      ...task,
      id: taskId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setState(prev => ({
      ...prev,
      board: {
        ...prev.board,
        tasks: {
          ...prev.board.tasks,
          [taskId]: newTask,
        },
        columns: {
          ...prev.board.columns,
          [columnId]: {
            ...prev.board.columns[columnId],
            taskIds: [...prev.board.columns[columnId].taskIds, taskId],
          },
        },
      },
    }));
  };

  const updateTask = (taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setState(prev => ({
      ...prev,
      board: {
        ...prev.board,
        tasks: {
          ...prev.board.tasks,
          [taskId]: {
            ...prev.board.tasks[taskId],
            ...updates,
            updatedAt: new Date(),
          },
        },
      },
    }));
  };

  const deleteTask = (taskId: string) => {
    setState(prev => {
      const newTasks = { ...prev.board.tasks };
      delete newTasks[taskId];

      const newColumns = { ...prev.board.columns };
      Object.keys(newColumns).forEach(columnId => {
        newColumns[columnId] = {
          ...newColumns[columnId],
          taskIds: newColumns[columnId].taskIds.filter(id => id !== taskId),
        };
      });

      return {
        ...prev,
        board: {
          ...prev.board,
          tasks: newTasks,
          columns: newColumns,
        },
      };
    });
  };

  const moveTask = (taskId: string, sourceColumnId: string, destinationColumnId: string, destinationIndex: number) => {
    setState(prev => {
      const newColumns = { ...prev.board.columns };
      
      // Remove from source column
      newColumns[sourceColumnId] = {
        ...newColumns[sourceColumnId],
        taskIds: newColumns[sourceColumnId].taskIds.filter(id => id !== taskId),
      };

      // Add to destination column
      const destTaskIds = [...newColumns[destinationColumnId].taskIds];
      destTaskIds.splice(destinationIndex, 0, taskId);
      newColumns[destinationColumnId] = {
        ...newColumns[destinationColumnId],
        taskIds: destTaskIds,
      };

      return {
        ...prev,
        board: {
          ...prev.board,
          columns: newColumns,
        },
      };
    });
  };

  const reorderTask = (columnId: string, startIndex: number, endIndex: number) => {
    setState(prev => {
      const column = prev.board.columns[columnId];
      const newTaskIds = [...column.taskIds];
      const [removed] = newTaskIds.splice(startIndex, 1);
      newTaskIds.splice(endIndex, 0, removed);

      return {
        ...prev,
        board: {
          ...prev.board,
          columns: {
            ...prev.board.columns,
            [columnId]: {
              ...column,
              taskIds: newTaskIds,
            },
          },
        },
      };
    });
  };

  const setTheme = (theme: Theme) => {
    setState(prev => ({ ...prev, theme }));
  };

  const setShowOnboarding = (show: boolean) => {
    setState(prev => ({ ...prev, showOnboarding: show }));
  };

  return {
    ...state,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTask,
    setTheme,
    setShowOnboarding,
  };
};
