'use client';

import { Task } from '@/types/kanban';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Draggable } from 'react-beautiful-dnd';

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-red-100 text-red-800 border-red-200',
};

export const TaskCard = ({ task, index, onEdit, onDelete }: TaskCardProps) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-card mb-3 cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md ${
            snapshot.isDragging ? 'rotate-2 shadow-lg' : ''
          }`}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(task)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(task.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {task.description && (
              <p className="text-xs text-muted-foreground mb-3 line-clamp-3">
                {task.description}
              </p>
            )}
            <div className="flex items-center justify-between">
              <Badge 
                variant="outline" 
                className={`text-xs ${priorityColors[task.priority]}`}
              >
                {task.priority}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {task.updatedAt.toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};
