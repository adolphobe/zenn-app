
import React, { useState, useCallback } from 'react';
import { useTaskDataContext } from '@/context/TaskDataProvider';
import { Task } from '@/types';
import { ChevronLeft, ChevronRight, Filter, Clock, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';

const MobileTaskHistoryPage = () => {
  const { completedTasks, completedTasksLoading } = useTaskDataContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Items per page
  const itemsPerPage = 10;
  
  // Filter tasks based on search query and period
  const filteredTasks = useCallback(() => {
    if (!completedTasks.length) return [];
    
    return completedTasks.filter(task => {
      // Apply search filter
      const matchesSearch = !searchQuery || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;
      
      // Apply period filter
      if (periodFilter !== 'all') {
        const completedDate = task.completedAt instanceof Date 
          ? task.completedAt 
          : new Date(task.completedAt || '');
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        
        switch (periodFilter) {
          case 'today':
            return completedDate >= today;
          case 'week':
            return completedDate >= weekStart;
          case 'month':
            return completedDate >= monthStart;
          default:
            return true;
        }
      }
      
      return true;
    });
  }, [completedTasks, searchQuery, periodFilter]);
  
  // Sort filtered tasks
  const sortedTasks = useCallback(() => {
    const filtered = filteredTasks();
    
    return [...filtered].sort((a, b) => {
      const dateA = a.completedAt instanceof Date ? a.completedAt : new Date(a.completedAt || '');
      const dateB = b.completedAt instanceof Date ? b.completedAt : new Date(b.completedAt || '');
      
      return sortDirection === 'desc' 
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });
  }, [filteredTasks, sortDirection]);
  
  // Paginate sorted tasks
  const paginatedTasks = useCallback(() => {
    const sorted = sortedTasks();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sorted.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedTasks, currentPage]);
  
  // Total pages
  const totalPages = Math.max(1, Math.ceil(sortedTasks().length / itemsPerPage));
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
  };
  
  // Format date for display
  const formatDate = (date: Date | string | null) => {
    if (!date) return '';
    const dateObj = date instanceof Date ? date : new Date(date);
    return format(dateObj, "dd MMM, yyyy", { locale: ptBR });
  };
  
  // Loading state
  if (completedTasksLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Carregando histórico...</p>
        </div>
      </div>
    );
  }
  
  // Empty state
  if (!completedTasks || completedTasks.length === 0) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Histórico de Tarefas</h1>
        <div className="bg-muted rounded-lg p-6 text-center">
          <p className="mb-2 text-muted-foreground">Nenhuma tarefa concluída ainda</p>
          <p className="text-sm">Complete tarefas para vê-las aqui</p>
        </div>
      </div>
    );
  }
  
  // Get pillar color
  const getPillarColor = (pillar: string) => {
    switch (pillar) {
      case 'consequence':
        return 'bg-red-500';
      case 'pride':
        return 'bg-blue-500';
      case 'construction':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Get feedback label
  const getFeedbackLabel = (feedback: string | null) => {
    switch (feedback) {
      case 'transformed':
        return 'Transformação';
      case 'relief':
        return 'Alívio';
      case 'obligation':
        return 'Obrigação';
      default:
        return 'Sem feedback';
    }
  };
  
  return (
    <div className="p-4 pb-20 max-w-full">
      <h1 className="text-xl font-bold mb-4">Histórico de Tarefas</h1>
      
      {/* Search and filters */}
      <div className="mb-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar tarefas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-80">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Período</label>
                  <Select
                    value={periodFilter}
                    onValueChange={setPeriodFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="today">Hoje</SelectItem>
                      <SelectItem value="week">Esta semana</SelectItem>
                      <SelectItem value="month">Este mês</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ordenar por data</label>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between"
                    onClick={toggleSortDirection}
                  >
                    {sortDirection === 'desc' ? 'Mais recentes primeiro' : 'Mais antigas primeiro'}
                    {sortDirection === 'desc' ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <Button variant="outline" size="icon" onClick={toggleSortDirection}>
            {sortDirection === 'desc' ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
          </Button>
        </div>
        
        {/* Active filters display */}
        {(searchQuery || periodFilter !== 'all') && (
          <div className="flex items-center gap-2 flex-wrap">
            {searchQuery && (
              <Badge variant="outline" className="flex items-center gap-1">
                Busca: {searchQuery}
                <button 
                  onClick={() => setSearchQuery('')}
                  className="ml-1 rounded-full hover:bg-muted p-0.5"
                >
                  <span className="sr-only">Remover</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                  </svg>
                </button>
              </Badge>
            )}
            {periodFilter !== 'all' && (
              <Badge variant="outline" className="flex items-center gap-1">
                {periodFilter === 'today' && 'Hoje'}
                {periodFilter === 'week' && 'Esta semana'}
                {periodFilter === 'month' && 'Este mês'}
                <button 
                  onClick={() => setPeriodFilter('all')}
                  className="ml-1 rounded-full hover:bg-muted p-0.5"
                >
                  <span className="sr-only">Remover</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                  </svg>
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>
      
      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">
        {sortedTasks().length} {sortedTasks().length === 1 ? 'tarefa concluída' : 'tarefas concluídas'}
      </p>
      
      {/* Task list */}
      <div className="space-y-3">
        {paginatedTasks().map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-card rounded-lg shadow-sm border p-3 relative"
            onClick={() => setSelectedTask(task)}
          >
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium flex-grow">{task.title}</h3>
              <span className="text-xs text-muted-foreground">
                {formatDate(task.completedAt)}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {task.pillar && (
                <div className={`w-2 h-2 rounded-full ${getPillarColor(task.pillar)}`} />
              )}
              <span className="text-xs text-muted-foreground capitalize">
                {task.pillar || 'Sem pilar'}
              </span>
              
              {task.feedback && (
                <>
                  <div className="text-muted-foreground mx-1">•</div>
                  <span className="text-xs text-muted-foreground">
                    {getFeedbackLabel(task.feedback)}
                  </span>
                </>
              )}
              
              {task.totalScore !== undefined && (
                <>
                  <div className="text-muted-foreground mx-1">•</div>
                  <span className="text-xs text-muted-foreground">
                    {task.totalScore} pontos
                  </span>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="text-sm">
            Página {currentPage} de {totalPages}
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {/* Task detail sheet */}
      <Sheet open={!!selectedTask} onOpenChange={(isOpen) => !isOpen && setSelectedTask(null)}>
        <SheetContent side="bottom" className="h-[90%] sm:max-w-full">
          {selectedTask && (
            <div className="space-y-6 h-full overflow-y-auto pb-12">
              <SheetHeader>
                <SheetTitle>{selectedTask.title}</SheetTitle>
              </SheetHeader>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Concluída em {formatDate(selectedTask.completedAt)}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Risco</p>
                    <p className="text-lg font-medium">{selectedTask.consequenceScore || 0}</p>
                  </div>
                  
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Orgulho</p>
                    <p className="text-lg font-medium">{selectedTask.prideScore || 0}</p>
                  </div>
                  
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Crescimento</p>
                    <p className="text-lg font-medium">{selectedTask.constructionScore || 0}</p>
                  </div>
                </div>
                
                {selectedTask.feedback && (
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Feedback após conclusão</p>
                    <p className="font-medium">
                      {getFeedbackLabel(selectedTask.feedback)}
                    </p>
                  </div>
                )}
                
                {/* Restore task button */}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Aqui você adicionaria a lógica para restaurar a tarefa
                    // Por exemplo: restoreTask(selectedTask.id);
                    setSelectedTask(null);
                  }}
                >
                  Restaurar tarefa
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileTaskHistoryPage;
