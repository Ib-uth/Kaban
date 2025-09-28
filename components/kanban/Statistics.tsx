'use client';

import { Task, Column } from '@/types/kanban';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  CheckCircle, 
  AlertTriangle, 
  Activity
} from 'lucide-react';

interface StatisticsProps {
  tasks: { [key: string]: Task };
  columns: { [key: string]: Column };
  columnOrder: string[];
}

export const Statistics = ({ tasks, columns, columnOrder }: StatisticsProps) => {
  const taskArray = Object.values(tasks);
  const totalTasks = taskArray.length;
  
  // Priority distribution
  const priorityStats = {
    high: taskArray.filter(t => t.priority === 'high').length,
    medium: taskArray.filter(t => t.priority === 'medium').length,
    low: taskArray.filter(t => t.priority === 'low').length,
  };

  // Column distribution
  const columnStats = columnOrder.map(columnId => ({
    name: columns[columnId].title,
    count: columns[columnId].taskIds.length,
    percentage: totalTasks > 0 ? (columns[columnId].taskIds.length / totalTasks) * 100 : 0,
  }));

  // Completion rate (assuming last column is "Done")
  const doneColumnId = columnOrder[columnOrder.length - 1];
  const completedTasks = columns[doneColumnId]?.taskIds.length || 0;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Recent activity (tasks created in last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentTasks = taskArray.filter(task => task.createdAt > sevenDaysAgo).length;


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Tasks */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTasks}</div>
          <p className="text-xs text-muted-foreground">
            Across {columnOrder.length} columns
          </p>
        </CardContent>
      </Card>

      {/* Completion Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completionRate.toFixed(1)}%</div>
          <Progress value={completionRate} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {completedTasks} of {totalTasks} completed
          </p>
        </CardContent>
      </Card>

      {/* High Priority Tasks */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">High Priority</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{priorityStats.high}</div>
          <p className="text-xs text-muted-foreground">
            {totalTasks > 0 ? ((priorityStats.high / totalTasks) * 100).toFixed(1) : 0}% of total
          </p>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{recentTasks}</div>
          <p className="text-xs text-muted-foreground">
            Tasks created this week
          </p>
        </CardContent>
      </Card>

      {/* Column Distribution */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Column Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {columnStats.map((column, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{column.name}</span>
                  <Badge variant="secondary">{column.count}</Badge>
                </div>
                <div className="flex items-center gap-2 min-w-[100px]">
                  <Progress value={column.percentage} className="flex-1" />
                  <span className="text-xs text-muted-foreground w-10 text-right">
                    {column.percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Priority Breakdown */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Priority Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">High Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="destructive">{priorityStats.high}</Badge>
                <span className="text-xs text-muted-foreground">
                  {totalTasks > 0 ? ((priorityStats.high / totalTasks) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Medium Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  {priorityStats.medium}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {totalTasks > 0 ? ((priorityStats.medium / totalTasks) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Low Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {priorityStats.low}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {totalTasks > 0 ? ((priorityStats.low / totalTasks) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
