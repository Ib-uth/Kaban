export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  assignee?: string;
  tags?: string[];
  archived?: boolean;
  completed?: boolean;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
  color?: string;
  limit?: number;
}

export interface Board {
  tasks: { [key: string]: Task };
  columns: { [key: string]: Column };
  columnOrder: string[];
}

export type Theme = 'light' | 'dark' | 'colorful';

export interface KanbanState {
  board: Board;
  theme: Theme;
  showOnboarding: boolean;
  settings: {
    autoSave: boolean;
    showTaskCount: boolean;
    compactMode: boolean;
    enableNotifications: boolean;
    showStatistics: boolean;
  };
  filters: {
    priority: string[];
    dateRange: string | null;
    assignee: string[];
    tags: string[];
  };
  searchQuery: string;
  selectedTasks: string[];
}

export interface FilterOptions {
  priority: string[];
  dateRange: string | null;
  assignee: string[];
  tags: string[];
}
