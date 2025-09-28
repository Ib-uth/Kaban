'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Filter, X } from 'lucide-react';

interface FilterBarProps {
  filters: {
    priority: string[];
    dateRange: string | null;
    assignee: string[];
  };
  onFilterChange: (filters: any) => void;
}

const priorityOptions = [
  { value: 'high', label: 'High Priority', color: 'bg-red-100 text-red-800' },
  { value: 'medium', label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'low', label: 'Low Priority', color: 'bg-green-100 text-green-800' },
];

const dateRangeOptions = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'overdue', label: 'Overdue' },
];

export const FilterBar = ({ filters, onFilterChange }: FilterBarProps) => {
  const togglePriorityFilter = (priority: string) => {
    const newPriorities = filters.priority.includes(priority)
      ? filters.priority.filter(p => p !== priority)
      : [...filters.priority, priority];
    
    onFilterChange({ ...filters, priority: newPriorities });
  };

  const setDateRangeFilter = (dateRange: string | null) => {
    onFilterChange({ ...filters, dateRange });
  };

  const clearAllFilters = () => {
    onFilterChange({ priority: [], dateRange: null, assignee: [] });
  };

  const hasActiveFilters = filters.priority.length > 0 || filters.dateRange || filters.assignee.length > 0;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                {filters.priority.length + (filters.dateRange ? 1 : 0)}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
          {priorityOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => togglePriorityFilter(option.value)}
              className="flex items-center justify-between"
            >
              <span>{option.label}</span>
              {filters.priority.includes(option.value) && (
                <Badge className={option.color}>✓</Badge>
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Filter by Date</DropdownMenuLabel>
          {dateRangeOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setDateRangeFilter(option.value)}
              className="flex items-center justify-between"
            >
              <span>{option.label}</span>
              {filters.dateRange === option.value && (
                <Badge variant="secondary">✓</Badge>
              )}
            </DropdownMenuItem>
          ))}
          {filters.dateRange && (
            <DropdownMenuItem onClick={() => setDateRangeFilter(null)}>
              Clear Date Filter
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Active Filter Tags */}
      {filters.priority.map((priority) => {
        const option = priorityOptions.find(o => o.value === priority);
        return (
          <Badge
            key={priority}
            variant="secondary"
            className="gap-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => togglePriorityFilter(priority)}
          >
            {option?.label}
            <X className="h-3 w-3" />
          </Badge>
        );
      })}

      {filters.dateRange && (
        <Badge
          variant="secondary"
          className="gap-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
          onClick={() => setDateRangeFilter(null)}
        >
          {dateRangeOptions.find(o => o.value === filters.dateRange)?.label}
          <X className="h-3 w-3" />
        </Badge>
      )}

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="text-muted-foreground hover:text-foreground"
        >
          Clear All
        </Button>
      )}
    </div>
  );
};
