'use client';

import { Column as ColumnType, Task } from '@/types/kanban';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreVertical } from 'lucide-react';
import { Droppable } from 'react-beautiful-dnd';
import { TaskCard } from './TaskCard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onAddTask: (columnId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  selectedTasks?: string[];
  onToggleTaskSelection: (taskId: string) => void;
  showTaskCount: boolean;
  compactMode: boolean;
}

export const Column = ({ 
  column, 
  tasks, 
  onAddTask, 
  onEditTask, 
  onDeleteTask,
  selectedTasks = [],
  onToggleTaskSelection,
  showTaskCount,
  compactMode
}: ColumnProps) => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;
  const overdueTasks = tasks.filter(task => 
    task.dueDate && task.dueDate < new Date() && !task.completed
  ).length;

  return (
    <Card className="w-80 flex-shrink-0">
      <CardHeader className={`${compactMode ? 'pb-2' : 'pb-3'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {column.color && (
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: column.color }}
              ></div>
            )}
            <CardTitle className={`font-medium ${compactMode ? 'text-sm' : 'text-sm'}`}>
              {column.title}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {showTaskCount && (
              <Badge variant="secondary" className="text-xs">
                {tasks.length}
                {column.limit && `/${column.limit}`}
              </Badge>
            )}
            {highPriorityTasks > 0 && (
              <Badge variant="destructive" className="text-xs">
                {highPriorityTasks} high
              </Badge>
            )}
            {overdueTasks > 0 && (
              <Badge variant="outline" className="text-xs border-red-300 text-red-600">
                {overdueTasks} overdue
              </Badge>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onAddTask(column.id)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddTask(column.id)}
              className="add-task-button h-6 w-6 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {/* Column Stats */}
        {!compactMode && tasks.length > 0 && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
            {completedTasks > 0 && (
              <span>{completedTasks} completed</span>
            )}
            {column.limit && tasks.length >= column.limit && (
              <span className="text-orange-600">At limit</span>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <Droppable droppableId={column.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`min-h-[200px] transition-colors duration-200 ${
                snapshot.isDraggingOver ? 'bg-muted/50 rounded-lg' : ''
              } ${compactMode ? 'min-h-[150px]' : ''}`}
            >
              {tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  isSelected={(selectedTasks || []).includes(task.id)}
                  onToggleSelection={onToggleTaskSelection}
                  compactMode={compactMode}
                />
              ))}
              {provided.placeholder}
              {tasks.length === 0 && !snapshot.isDraggingOver && (
                <div className={`flex items-center justify-center text-muted-foreground text-sm border-2 border-dashed border-muted rounded-lg ${
                  compactMode ? 'h-24' : 'h-32'
                }`}>
                  Drop tasks here or click + to add
                </div>
              )}
            </div>
          )}
        </Droppable>
      </CardContent>
    </Card>
  );
};
