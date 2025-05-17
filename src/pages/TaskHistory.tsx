
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/auth';
import { TaskHistoryStats } from '@/components/task-history/TaskHistoryStats';
import { TaskFilters } from '@/components/task-history/TaskFilters';
import { ViewToggle } from '@/components/task-history/ViewToggle';
import { TaskCards } from '@/components/task-history/TaskCards';
import { TaskTable } from '@/components/task-history/TaskTable';

const TaskHistory: React.FC = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [filters, setFilters] = useState({
    pillar: 'all',
    dateRange: 'all',
    status: 'all',
  });

  useEffect(() => {
    // Mock task data (replace with actual data fetching)
    const mockTasks = [
      { id: 1, title: 'Task 1', pillar: 'Pillar A', dueDate: '2024-01-20', status: 'completed', score: 85 },
      { id: 2, title: 'Task 2', pillar: 'Pillar B', dueDate: '2024-01-25', status: 'pending', score: 60 },
      { id: 3, title: 'Task 3', pillar: 'Pillar A', dueDate: '2024-01-30', status: 'in progress', score: 75 },
      { id: 4, title: 'Task 4', pillar: 'Pillar C', dueDate: '2024-02-05', status: 'completed', score: 90 },
    ];
    setTasks(mockTasks);
    setFilteredTasks(mockTasks);
  }, []);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (currentFilters: any) => {
    let newFilteredTasks = [...tasks];

    if (currentFilters.pillar !== 'all') {
      newFilteredTasks = newFilteredTasks.filter(task => task.pillar === currentFilters.pillar);
    }

    if (currentFilters.status !== 'all') {
      newFilteredTasks = newFilteredTasks.filter(task => task.status === currentFilters.status);
    }

    // Date range filtering logic (mock)
    if (currentFilters.dateRange === 'last7Days') {
      newFilteredTasks = newFilteredTasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return taskDate >= sevenDaysAgo;
      });
    }

    setFilteredTasks(newFilteredTasks);
  };

  const handleViewToggle = (newViewMode: 'cards' | 'table') => {
    setViewMode(newViewMode);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Task History</h1>

      <div className="flex justify-between items-center mb-4">
        <TaskFilters onFilterChange={handleFilterChange} />
        <ViewToggle onViewToggle={handleViewToggle} />
      </div>

      <TaskHistoryStats tasks={filteredTasks} />

      {viewMode === 'cards' ? (
        <TaskCards tasks={filteredTasks} />
      ) : (
        <TaskTable tasks={filteredTasks} />
      )}
    </div>
  );
};

export default TaskHistory;
