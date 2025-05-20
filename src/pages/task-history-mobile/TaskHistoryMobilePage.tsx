
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, FilterIcon, ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';
import { Task } from '@/types';
import { useTaskDataContext } from '@/context/TaskDataProvider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useMediaQuery } from '@/hooks/use-media-query';
import MobileTaskCard from './components/MobileTaskCard';
import MobileTaskFilters from './components/MobileTaskFilters';
import MobileTaskStatsBar from './components/MobileTaskStatsBar';
import { useMobileTaskFilters } from './hooks/useMobileTaskFilters';

const TaskHistoryMobilePage: React.FC = () => {
  const { completedTasks, completedTasksLoading } = useTaskDataContext();
  const isSmallMobile = useMediaQuery("(max-width: 380px)");
  
  // Filter states and hooks
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    filteredTasks,
    searchQuery,
    setSearchQuery,
    periodFilter,
    setPeriodFilter,
    scoreFilter,
    setScoreFilter,
    feedbackFilter,
    setFeedbackFilter,
    sortBy,
    setSortBy,
    clearAllFilters,
    isFiltering
  } = useMobileTaskFilters(completedTasks);
  
  // View task modal state
  const [taskToView, setTaskToView] = useState<Task | null>(null);
  
  // Calculate stats
  const taskCount = filteredTasks.length;
  const highScoreTasks = filteredTasks.filter(task => task.totalScore >= 12).length;
  const averageScore = filteredTasks.length > 0 
    ? filteredTasks.reduce((sum, task) => sum + task.totalScore, 0) / filteredTasks.length
    : 0;
  
  // Loading state
  if (completedTasksLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
        <p className="text-muted-foreground">Carregando histórico...</p>
      </div>
    );
  }
  
  // Empty state
  if (!completedTasks || completedTasks.length === 0) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="text-center max-w-xs mx-auto">
          <h2 className="text-xl font-semibold mb-2">Nenhuma tarefa concluída</h2>
          <p className="text-muted-foreground">
            Quando você concluir tarefas, elas aparecerão aqui.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold">Histórico de Tarefas</h1>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-1.5"
          >
            <FilterIcon size={16} />
            {!isSmallMobile && "Filtros"}
          </Button>
        </div>
        
        {/* Quick search */}
        <div className="relative">
          <input
            type="search"
            placeholder="Buscar tarefas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
      </div>
      
      {/* Stats bar */}
      <MobileTaskStatsBar
        taskCount={taskCount}
        highScoreTasks={highScoreTasks}
        averageScore={averageScore.toFixed(1)}
      />
      
      {/* Active filters indicator */}
      {isFiltering && (
        <div className="px-4 py-2 flex justify-between items-center bg-muted/40">
          <div className="text-sm text-muted-foreground">
            {filteredTasks.length} {filteredTasks.length === 1 ? 'resultado' : 'resultados'}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            className="h-auto py-1 px-2 text-sm text-primary"
          >
            Limpar filtros
          </Button>
        </div>
      )}
      
      {/* Sort control */}
      <div className="px-4 py-2 flex justify-between items-center border-b">
        <div className="text-sm font-medium">Ordenar por</div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-sm bg-transparent border-none focus:outline-none focus:ring-0 pr-8"
        >
          <option value="newest">Mais recentes</option>
          <option value="oldest">Mais antigas</option>
          <option value="highScore">Maior pontuação</option>
          <option value="lowScore">Menor pontuação</option>
        </select>
      </div>
      
      {/* Task list */}
      <div className="p-4 space-y-3">
        {filteredTasks.map(task => (
          <MobileTaskCard 
            key={task.id} 
            task={task}
            onViewTask={() => setTaskToView(task)}
          />
        ))}
        
        {filteredTasks.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Nenhuma tarefa corresponde aos filtros atuais
            </p>
          </div>
        )}
      </div>
      
      {/* Filter sheet */}
      <Sheet open={showFilters} onOpenChange={setShowFilters}>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>Filtrar tarefas</SheetTitle>
          </SheetHeader>
          
          <MobileTaskFilters
            periodFilter={periodFilter}
            setPeriodFilter={setPeriodFilter}
            scoreFilter={scoreFilter}
            setScoreFilter={setScoreFilter}
            feedbackFilter={feedbackFilter}
            setFeedbackFilter={setFeedbackFilter}
            onClose={() => setShowFilters(false)}
          />
        </SheetContent>
      </Sheet>
      
      {/* Task view sheet */}
      {taskToView && (
        <Sheet open={!!taskToView} onOpenChange={() => setTaskToView(null)}>
          <SheetContent side="bottom" className="h-[90vh] p-0">
            <div className="h-full flex flex-col overflow-hidden">
              <SheetHeader className="px-6 py-4 border-b">
                <SheetTitle className="pr-8">{taskToView.title}</SheetTitle>
              </SheetHeader>
              
              <div className="p-6 overflow-y-auto flex-1">
                {/* Task details */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="bg-muted">
                      {taskToView.completedAt ? (
                        new Date(taskToView.completedAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })
                      ) : 'Data desconhecida'}
                    </Badge>
                    
                    <Badge 
                      variant="outline" 
                      className={
                        taskToView.totalScore >= 12 ? 'bg-orange-100 text-orange-700 border-orange-300' : 
                        taskToView.totalScore >= 8 ? 'bg-blue-100 text-blue-700 border-blue-300' : 
                        'bg-slate-100 text-slate-700 border-slate-300'
                      }
                    >
                      {taskToView.totalScore}/15
                    </Badge>
                  </div>
                  
                  {/* Pillar scores */}
                  <div className="space-y-4 mt-6">
                    <h3 className="text-sm font-medium">Níveis</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Risco</span>
                          <span className="font-medium">{taskToView.consequenceScore}/5</span>
                        </div>
                        <div className="h-2 bg-muted rounded overflow-hidden">
                          <div 
                            className="h-full bg-red-500" 
                            style={{ width: `${(taskToView.consequenceScore / 5) * 100}%` }} 
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Orgulho</span>
                          <span className="font-medium">{taskToView.prideScore}/5</span>
                        </div>
                        <div className="h-2 bg-muted rounded overflow-hidden">
                          <div 
                            className="h-full bg-blue-500" 
                            style={{ width: `${(taskToView.prideScore / 5) * 100}%` }} 
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Crescimento</span>
                          <span className="font-medium">{taskToView.constructionScore}/5</span>
                        </div>
                        <div className="h-2 bg-muted rounded overflow-hidden">
                          <div 
                            className="h-full bg-green-500" 
                            style={{ width: `${(taskToView.constructionScore / 5) * 100}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Feedback */}
                  {taskToView.feedback && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium mb-2">Feedback ao concluir</h3>
                      <Badge variant="outline" className={
                        taskToView.feedback === 'transformed' 
                          ? 'bg-green-100 text-green-700 border-green-300' 
                          : taskToView.feedback === 'relief'
                            ? 'bg-blue-100 text-blue-700 border-blue-300'
                            : 'bg-gray-100 text-gray-700 border-gray-300'
                      }>
                        {taskToView.feedback === 'transformed' 
                          ? 'Foi transformador terminar' 
                          : taskToView.feedback === 'relief'
                            ? 'Tive alívio ao finalizar'
                            : 'Terminei por obrigação'}
                      </Badge>
                    </div>
                  )}
                  
                  {/* Comments */}
                  {taskToView.comments && taskToView.comments.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium mb-3">Comentários</h3>
                      <div className="space-y-3">
                        {taskToView.comments.map(comment => (
                          <div key={comment.id} className="bg-muted/50 p-3 rounded-md">
                            <p className="text-sm">{comment.text}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border-t p-4">
                <Button 
                  className="w-full" 
                  variant="outline" 
                  onClick={() => setTaskToView(null)}
                >
                  Fechar
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default TaskHistoryMobilePage;
