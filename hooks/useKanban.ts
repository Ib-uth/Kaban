'use client';

import { useState, useEffect, useMemo } from 'react';
import { Board, Task, Column, Theme, KanbanState, FilterOptions } from '@/types/kanban';

const initialBoard: Board = {
  tasks: {
    'task-1': {
      id: 'task-1',
      title: 'Welcome to TaskFlow!',
      description: 'This is your first task with TaskFlow\'s enhanced features. Try the search, filters, and settings!',
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['welcome', 'tutorial'],
    },
    'task-2': {
      id: 'task-2',
      title: 'Try the new search and filter features',
      description: 'Use the search bar to find tasks quickly, and try filtering by priority or date.',
      priority: 'high',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['feature', 'search'],
    },
    'task-3': {
      id: 'task-3',
      title: 'Explore bulk actions',
      description: 'Select multiple tasks and use Quick Actions for bulk operations.',
      priority: 'low',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['bulk', 'actions'],
    },
    'task-4': {
      id: 'task-4',
      title: 'Check out the statistics',
      description: 'View comprehensive statistics about your board and task distribution.',
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['statistics', 'analytics'],
    },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: ['task-1', 'task-2'],
      color: '#3b82f6',
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: ['task-4'],
      color: '#f59e0b',
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      taskIds: ['task-3'],
      color: '#10b981',
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
};

const initialSettings = {
  autoSave: true,
  showTaskCount: true,
  compactMode: false,
  enableNotifications: false,
  showStatistics: true,
};

export const useKanban = () => {
  const [state, setState] = useState<KanbanState>({
    board: initialBoard,
    theme: 'light',
    showOnboarding: true,
    settings: initialSettings,
    filters: {
      priority: [],
      dateRange: null,
      assignee: [],
      tags: [],
    },
    searchQuery: '',
    selectedTasks: [],
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('taskflow-board');
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        // Convert date strings back to Date objects
        Object.keys(parsedState.board.tasks).forEach(taskId => {
          parsedState.board.tasks[taskId].createdAt = new Date(parsedState.board.tasks[taskId].createdAt);
          parsedState.board.tasks[taskId].updatedAt = new Date(parsedState.board.tasks[taskId].updatedAt);
          if (parsedState.board.tasks[taskId].dueDate) {
            parsedState.board.tasks[taskId].dueDate = new Date(parsedState.board.tasks[taskId].dueDate);
          }
        });
        setState(parsedState);
      } catch (error) {
        console.error('Failed to load saved board:', error);
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (state.settings.autoSave) {
      localStorage.setItem('taskflow-board', JSON.stringify(state));
    }
  }, [state]);

  // Filtered and searched tasks
  const filteredTasks = useMemo(() => {
    let tasks = Object.values(state.board.tasks);

    // Apply search filter
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      tasks = tasks.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply priority filter
    if (state.filters.priority.length > 0) {
      tasks = tasks.filter(task => state.filters.priority.includes(task.priority));
    }

    // Apply date range filter
    if (state.filters.dateRange) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      tasks = tasks.filter(task => {
        switch (state.filters.dateRange) {
          case 'today':
            return task.createdAt >= today;
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return task.createdAt >= weekAgo;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return task.createdAt >= monthAgo;
          case 'overdue':
            return task.dueDate && task.dueDate < now && !task.completed;
          default:
            return true;
        }
      });
    }

    // Apply tags filter
    if (state.filters.tags.length > 0) {
      tasks = tasks.filter(task => 
        task.tags?.some(tag => state.filters.tags.includes(tag))
      );
    }

    return tasks.reduce((acc, task) => {
      acc[task.id] = task;
      return acc;
    }, {} as { [key: string]: Task });
  }, [state.board.tasks, state.searchQuery, state.filters]);

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
        selectedTasks: prev.selectedTasks.filter(id => id !== taskId),
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

  const bulkAction = async (action: string, taskIds: string[]) => {
    switch (action) {
      case 'select-all':
        setState(prev => ({
          ...prev,
          selectedTasks: Object.keys(prev.board.tasks),
        }));
        break;
      
      case 'deselect-all':
        setState(prev => ({ ...prev, selectedTasks: [] }));
        break;
      
      case 'delete':
        if (confirm(`Delete ${taskIds.length} selected tasks?`)) {
          taskIds.forEach(taskId => deleteTask(taskId));
        }
        break;
      
      case 'duplicate':
        taskIds.forEach(taskId => {
          const originalTask = state.board.tasks[taskId];
          if (originalTask) {
            // Find which column the task is in
            const columnId = Object.keys(state.board.columns).find(colId =>
              state.board.columns[colId].taskIds.includes(taskId)
            );
            if (columnId) {
              addTask(columnId, {
                ...originalTask,
                title: `${originalTask.title} (Copy)`,
              });
            }
          }
        });
        break;
      
      case 'set-priority-high':
      case 'set-priority-medium':
      case 'set-priority-low':
        const priority = action.split('-')[2] as 'high' | 'medium' | 'low';
        taskIds.forEach(taskId => {
          updateTask(taskId, { priority });
        });
        break;
      
      case 'archive':
        taskIds.forEach(taskId => {
          updateTask(taskId, { archived: true });
        });
        break;
      
      case 'export-selected':
        const selectedTasksData = taskIds.map(id => state.board.tasks[id]);
        const blob = new Blob([JSON.stringify(selectedTasksData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `taskflow-selected-tasks-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        break;
    }
  };

  const updateColumns = (columns: { [key: string]: Column }, columnOrder: string[]) => {
    setState(prev => ({
      ...prev,
      board: {
        ...prev.board,
        columns,
        columnOrder,
      },
    }));
  };

  const setTheme = (theme: Theme) => {
    setState(prev => ({ ...prev, theme }));
  };

  const setShowOnboarding = (show: boolean) => {
    setState(prev => ({ ...prev, showOnboarding: show }));
  };

  const setSettings = (settings: any) => {
    setState(prev => ({ ...prev, settings }));
  };

  const setFilters = (filters: FilterOptions) => {
    setState(prev => ({ ...prev, filters }));
  };

  const setSearchQuery = (query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  };

  const setSelectedTasks = (taskIds: string[]) => {
    setState(prev => ({ ...prev, selectedTasks: taskIds }));
  };

  const toggleTaskSelection = (taskId: string) => {
    setState(prev => ({
      ...prev,
      selectedTasks: prev.selectedTasks.includes(taskId)
        ? prev.selectedTasks.filter(id => id !== taskId)
        : [...prev.selectedTasks, taskId],
    }));
  };

  return {
    ...state,
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
  };
};
