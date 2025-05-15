
import React, { useState, useMemo } from 'react';
import { Search, Calendar, SlidersHorizontal, LayoutGrid, LayoutList } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { format } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Toggle } from '@/components/ui/toggle';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart, 
  Bar, 
  ResponsiveContainer, 
  XAxis,
  Tooltip
} from 'recharts';

// Timeline grouping function
const groupTasksByTimeline = (tasks) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - today.getDay());
  
  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const groups = {
    today: { label: 'Hoje', tasks: [] },
    yesterday: { label: 'Ontem', tasks: [] },
    thisWeek: { label: 'Esta semana', tasks: [] },
    thisMonth: { label: 'Este mês', tasks: [] },
    older: { label: 'Anteriores', tasks: [] },
  };
  
  tasks.forEach(task => {
    const completedDate = new Date(task.completedAt);
    completedDate.setHours(0, 0, 0, 0);
    
    if (completedDate.getTime() === today.getTime()) {
      groups.today.tasks.push(task);
    } else if (completedDate.getTime() === yesterday.getTime()) {
      groups.yesterday.tasks.push(task);
    } else if (completedDate >= thisWeekStart && completedDate < today) {
      groups.thisWeek.tasks.push(task);
    } else if (completedDate >= thisMonthStart && completedDate < thisWeekStart) {
      groups.thisMonth.tasks.push(task);
    } else {
      groups.older.tasks.push(task);
    }
  });
  
  return Object.values(groups).filter(group => group.tasks.length > 0);
};

// Task card component
const CompletedTaskCard = ({ task }) => {
  // Determine dominant pillar based on scores
  const getDominantPillar = () => {
    const scores = [
      { name: 'consequência', value: task.consequenceScore },
      { name: 'orgulho', value: task.prideScore },
      { name: 'construção', value: task.constructionScore },
    ];
    const max = scores.reduce((prev, current) => 
      (prev.value > current.value) ? prev : current
    );
    return max.name;
  };

  const dominantPillar = getDominantPillar();
  const pillarColors = {
    consequência: 'bg-orange-100 text-orange-800 border-orange-200',
    orgulho: 'bg-purple-100 text-purple-800 border-purple-200',
    construção: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  const feedbackColors = {
    transformed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    relief: 'bg-blue-100 text-blue-800 border-blue-200',
    obligation: 'bg-amber-100 text-amber-800 border-amber-200',
  };

  return (
    <Card className="mb-3 border-l-4 border-l-gray-300">
      <CardContent className="pt-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 line-through opacity-70">{task.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Concluída em {format(new Date(task.completedAt), 'dd/MM/yyyy')}
            </p>
          </div>
          <div className="flex gap-2">
            {task.feedback && (
              <Badge className={feedbackColors[task.feedback] || 'bg-gray-100 text-gray-800'} variant="outline">
                {task.feedback === 'transformed' ? 'Transformadora' : 
                 task.feedback === 'relief' ? 'Alívio' : 'Obrigação'}
              </Badge>
            )}
            <Badge className={pillarColors[dominantPillar] || 'bg-gray-100 text-gray-800'} variant="outline">
              {dominantPillar}
            </Badge>
            <Badge variant="outline" className="bg-gray-100 text-gray-800">
              {task.totalScore} pts
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Table row component
const CompletedTaskRow = ({ task }) => {
  // Determine dominant pillar based on scores
  const getDominantPillar = () => {
    const scores = [
      { name: 'consequência', value: task.consequenceScore },
      { name: 'orgulho', value: task.prideScore },
      { name: 'construção', value: task.constructionScore },
    ];
    const max = scores.reduce((prev, current) => 
      (prev.value > current.value) ? prev : current
    );
    return max.name;
  };

  const dominantPillar = getDominantPillar();
  const feedbackLabels = {
    transformed: 'Transformadora',
    relief: 'Alívio',
    obligation: 'Obrigação'
  };

  return (
    <TableRow>
      <TableCell className="line-through opacity-70">{task.title}</TableCell>
      <TableCell>{format(new Date(task.completedAt), 'dd/MM/yyyy')}</TableCell>
      <TableCell>{task.totalScore}</TableCell>
      <TableCell className="capitalize">{dominantPillar}</TableCell>
      <TableCell>{task.feedback ? feedbackLabels[task.feedback] : '-'}</TableCell>
    </TableRow>
  );
};

const TaskHistory = () => {
  const { state } = useAppContext();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [feedbackFilter, setFeedbackFilter] = useState('all');
  const [pillarFilter, setPillarFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);

  // Filter for completed tasks only
  const completedTasks = useMemo(() => {
    return state.tasks.filter(task => task.completed && task.completedAt);
  }, [state.tasks]);

  // Apply filters and search
  const filteredTasks = useMemo(() => {
    return completedTasks.filter(task => {
      // Search filter
      const matchesSearch = !searchQuery || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Period filter
      let matchesPeriod = true;
      const now = new Date();
      const completedDate = new Date(task.completedAt);
      
      if (periodFilter === 'today') {
        matchesPeriod = completedDate.toDateString() === now.toDateString();
      } else if (periodFilter === 'week') {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        matchesPeriod = completedDate >= weekStart;
      } else if (periodFilter === 'month') {
        matchesPeriod = completedDate.getMonth() === now.getMonth() && 
                        completedDate.getFullYear() === now.getFullYear();
      }
      
      // Score filter
      let matchesScore = true;
      if (scoreFilter === 'high') {
        matchesScore = task.totalScore >= 12;
      } else if (scoreFilter === 'medium') {
        matchesScore = task.totalScore >= 8 && task.totalScore < 12;
      } else if (scoreFilter === 'low') {
        matchesScore = task.totalScore < 8;
      }
      
      // Feedback filter
      const matchesFeedback = feedbackFilter === 'all' || task.feedback === feedbackFilter;
      
      // Pillar filter
      let matchesPillar = true;
      if (pillarFilter !== 'all') {
        const dominantScore = Math.max(task.consequenceScore, task.prideScore, task.constructionScore);
        if (pillarFilter === 'consequence') {
          matchesPillar = task.consequenceScore === dominantScore;
        } else if (pillarFilter === 'pride') {
          matchesPillar = task.prideScore === dominantScore;
        } else if (pillarFilter === 'construction') {
          matchesPillar = task.constructionScore === dominantScore;
        }
      }
      
      return matchesSearch && matchesPeriod && matchesScore && matchesFeedback && matchesPillar;
    });
  }, [completedTasks, searchQuery, periodFilter, scoreFilter, feedbackFilter, pillarFilter]);

  // Apply sorting
  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime();
      } else if (sortBy === 'highScore') {
        return b.totalScore - a.totalScore;
      } else if (sortBy === 'lowScore') {
        return a.totalScore - b.totalScore;
      } else if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [filteredTasks, sortBy]);

  // Group by timeline for grid view
  const groupedTasks = useMemo(() => {
    return groupTasksByTimeline(sortedTasks);
  }, [sortedTasks]);

  // Generate data for the trends chart
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      return {
        date: date.toISOString().split('T')[0],
        label: format(date, 'dd/MM'),
        count: 0
      };
    }).reverse();
    
    // Count tasks completed on each day
    completedTasks.forEach(task => {
      const taskDate = new Date(task.completedAt);
      taskDate.setHours(0, 0, 0, 0);
      const dateStr = taskDate.toISOString().split('T')[0];
      
      const dayData = last7Days.find(d => d.date === dateStr);
      if (dayData) {
        dayData.count++;
      }
    });
    
    return last7Days;
  }, [completedTasks]);

  // Calculate average score
  const averageScore = useMemo(() => {
    if (completedTasks.length === 0) return 0;
    const totalScore = completedTasks.reduce((sum, task) => sum + task.totalScore, 0);
    return (totalScore / completedTasks.length).toFixed(1);
  }, [completedTasks]);

  return (
    <div className="container p-4 mx-auto">
      <div className="flex flex-col space-y-4">
        {/* Header with stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-base">Total concluídas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completedTasks.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-base">Média de pontuação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{averageScore}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-base">Tendência (7 dias)</CardTitle>
            </CardHeader>
            <CardContent className="h-16">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="label" fontSize={10} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#9b87f5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        {/* Search and filter bar */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-grow md:max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar tarefas concluídas..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal size={16} />
              Filtros
            </Button>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-auto">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Mais recentes</SelectItem>
                <SelectItem value="oldest">Mais antigas</SelectItem>
                <SelectItem value="highScore">Maior pontuação</SelectItem>
                <SelectItem value="lowScore">Menor pontuação</SelectItem>
                <SelectItem value="alphabetical">Alfabética</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex border rounded-md">
              <Toggle 
                pressed={viewMode === 'grid'} 
                onPressedChange={() => setViewMode('grid')}
                size="sm"
                aria-label="View as grid"
              >
                <LayoutGrid size={16} />
              </Toggle>
              <Toggle 
                pressed={viewMode === 'list'} 
                onPressedChange={() => setViewMode('list')}
                size="sm"
                aria-label="View as list"
              >
                <LayoutList size={16} />
              </Toggle>
            </div>
          </div>
        </div>
        
        {/* Advanced filters */}
        {showFilters && (
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Período</label>
                <Select value={periodFilter} onValueChange={setPeriodFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os períodos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os períodos</SelectItem>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="week">Esta semana</SelectItem>
                    <SelectItem value="month">Este mês</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Pontuação</label>
                <Select value={scoreFilter} onValueChange={setScoreFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas pontuações" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas pontuações</SelectItem>
                    <SelectItem value="high">Alta (≥ 12)</SelectItem>
                    <SelectItem value="medium">Média (8-11)</SelectItem>
                    <SelectItem value="low">Baixa (< 8)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Feedback</label>
                <Select value={feedbackFilter} onValueChange={setFeedbackFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos feedbacks" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos feedbacks</SelectItem>
                    <SelectItem value="transformed">Transformadora</SelectItem>
                    <SelectItem value="relief">Alívio</SelectItem>
                    <SelectItem value="obligation">Obrigação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Pilar dominante</label>
                <Select value={pillarFilter} onValueChange={setPillarFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos pilares" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos pilares</SelectItem>
                    <SelectItem value="consequence">Consequência</SelectItem>
                    <SelectItem value="pride">Orgulho</SelectItem>
                    <SelectItem value="construction">Construção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        )}

        {/* No results message */}
        {sortedTasks.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-lg font-medium">Nenhuma tarefa concluída encontrada</h3>
            <p className="text-gray-500">
              Tente ajustar os filtros ou concluir algumas tarefas primeiro
            </p>
          </div>
        )}
        
        {/* Task list view */}
        {viewMode === 'list' && sortedTasks.length > 0 && (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Concluído em</TableHead>
                    <TableHead>Pontuação</TableHead>
                    <TableHead>Pilar</TableHead>
                    <TableHead>Feedback</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTasks.map(task => (
                    <CompletedTaskRow key={task.id} task={task} />
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
        
        {/* Grid view with timeline grouping */}
        {viewMode === 'grid' && sortedTasks.length > 0 && (
          <div className="space-y-6">
            {groupedTasks.map((group, index) => (
              <div key={index}>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-medium">{group.label}</h3>
                  <Badge variant="outline">{group.tasks.length}</Badge>
                  <Separator className="flex-grow" />
                </div>
                <div className="grid grid-cols-1">
                  {group.tasks.map(task => (
                    <CompletedTaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskHistory;
