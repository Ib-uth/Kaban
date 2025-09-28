export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
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
}
