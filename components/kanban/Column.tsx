'use client';

import { Column as ColumnType, Task } from '@/types/kanban';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Droppable } from 'react-beautiful-dnd';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onAddTask: (columnId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export const Column = ({ column, tasks, onAddTask, onEditTask, onDeleteTask }: ColumnProps) => {
  return (
    <Card className="w-80 flex-shrink-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{column.title}</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {tasks.length}
            </span>
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
      </CardHeader>
      <CardContent className="pt-0">
        <Droppable droppableId={column.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`min-h-[200px] transition-colors duration-200 ${
                snapshot.isDraggingOver ? 'bg-muted/50 rounded-lg' : ''
              }`}
            >
              {tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                />
              ))}
              {provided.placeholder}
              {tasks.length === 0 && !snapshot.isDraggingOver && (
                <div className="flex items-center justify-center h-32 text-muted-foreground text-sm border-2 border-dashed border-muted rounded-lg">
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
