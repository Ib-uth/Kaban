'use client';

import { Task } from '@/types/kanban';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { MoreHorizontal, Edit, Trash2, Calendar, User, Tag } from 'lucide-react';
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
  isSelected: boolean;
  onToggleSelection: (taskId: string) => void;
  compactMode?: boolean;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-red-100 text-red-800 border-red-200',
};

const priorityDots = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500',
};

export const TaskCard = ({ 
  task, 
  index, 
  onEdit, 
  onDelete, 
  isSelected, 
  onToggleSelection,
  compactMode = false 
}: TaskCardProps) => {
  const isOverdue = task.dueDate && task.dueDate < new Date() && !task.completed;

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-card mb-3 cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md ${
            snapshot.isDragging ? 'rotate-2 shadow-lg' : ''
          } ${isSelected ? 'ring-2 ring-blue-500' : ''} ${
            compactMode ? 'text-sm' : ''
          } ${isOverdue ? 'border-red-300 bg-red-50' : ''}`}
        >
          <CardHeader className={`${compactMode ? 'pb-1' : 'pb-2'}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2 flex-1">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onToggleSelection(task.id)}
                  className="mt-0.5"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${priorityDots[task.priority]}`}></div>
                    <h4 className={`font-medium leading-tight ${compactMode ? 'text-sm' : 'text-sm'} ${
                      task.completed ? 'line-through text-muted-foreground' : ''
                    }`}>
                      {task.title}
                    </h4>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
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
            {task.description && !compactMode && (
              <p className="text-xs text-muted-foreground mb-3 line-clamp-3">
                {task.description}
              </p>
            )}
            
            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {task.tags.slice(0, compactMode ? 2 : 3).map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs px-1 py-0"
                  >
                    <Tag className="w-2 h-2 mr-1" />
                    {tag}
                  </Badge>
                ))}
                {task.tags.length > (compactMode ? 2 : 3) && (
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    +{task.tags.length - (compactMode ? 2 : 3)}
                  </Badge>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${priorityColors[task.priority]}`}
                >
                  {task.priority}
                </Badge>
                {isOverdue && (
                  <Badge variant="destructive" className="text-xs">
                    Overdue
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {task.assignee && (
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{task.assignee}</span>
                  </div>
                )}
                {task.dueDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{task.dueDate.toLocaleDateString()}</span>
                  </div>
                )}
                {!task.dueDate && (
                  <span>{task.updatedAt.toLocaleDateString()}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};
