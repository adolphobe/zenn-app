import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext'; // Direct import
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { format, isSameDay, startOfDay, endOfDay } from 'date-fns';
import { PeriodType } from '@/components/strategic-review/types';
import { getDateRangeByPeriod, filterTasksByDateRange } from '@/components/strategic-review/utils';
import TaskSummaryCard from '@/components/strategic-review/TaskSummaryCard';
import PillarsAnalysisCard from '@/components/strategic-review/PillarsAnalysisCard';
import FeedbackAnalysisCard from '@/components/strategic-review/FeedbackAnalysisCard';
import { toast } from '@/hooks/use-toast';
import { useTaskPillars } from '@/context/hooks';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, CalendarRange } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Strategic Review Page Component
 * Enhanced with detailed authentication logging and fixed authentication handling
 */
const StrategicReview: React.FC = () => {
  // Create instance ID for better tracking
  const instanceId = Math.random().toString(36).substring(2, 7);
  const timestamp = new Date().toISOString();
  
  // Authentication state tracking
  console.log(`[StrategicReview:${instanceId}] INICIALIZADO em ${timestamp}`);
  
  const { state } = useAppContext();
  const { isAuthenticated, isLoading, currentUser, session } = useAuth();
  const [period, setPeriod] = useState<PeriodType>('week');
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(undefined);
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  
  // Verificação detalhada de autenticação com timestamp
  useEffect(() => {
    console.log(`[StrategicReview:${instanceId}] Efeito de verificação de auth executado em: ${new Date().toISOString()}`);
    console.log(`[StrategicReview:${instanceId}] Estado de autenticação: ${isAuthenticated ? "Autenticado" : "Não autenticado"}`);
    console.log(`[StrategicReview:${instanceId}] Estado de carregamento: ${isLoading ? "Carregando" : "Carregamento concluído"}`);
    console.log(`[StrategicReview:${instanceId}] Usuário atual: ${currentUser?.email || "Nenhum usuário"}`);
    console.log(`[StrategicReview:${instanceId}] Tem sessão: ${!!session ? "Sim" : "Não"}`);
    
    // Verificação adicional para depuração
    const hasTokenInStorage = !!localStorage.getItem('sb-wbvxnapruffchikhrqrs-auth-token');
    console.log(`[StrategicReview:${instanceId}] Token no localStorage: ${hasTokenInStorage ? "Presente" : "Ausente"}`);
    
    return () => {
      console.log(`[StrategicReview:${instanceId}] Componente será desmontado em ${new Date().toISOString()}`);
    };
  }, [isAuthenticated, isLoading, currentUser, session, instanceId]);
  
  // Use the task pillars hook to ensure all tasks have pillars assigned
  const { assignMissingPillars } = useTaskPillars();
  
  useEffect(() => {
    // Log that we're initializing tasks
    console.log(`[StrategicReview:${instanceId}] Inicializando tarefas do componente em ${new Date().toISOString()}`);
    
    // Ensure all tasks have pillars assigned - explicitly call this
    assignMissingPillars();
    
    // Show a toast to indicate the page is loaded
    toast({
      title: "Revisão Estratégica",
      description: "Mostrando análise das tarefas concluídas."
    });
    
    // Log tasks data
    console.log(`[StrategicReview:${instanceId}] Total de tarefas disponíveis: ${state.tasks.length}`);
  }, [assignMissingPillars, state.tasks.length, instanceId]);
  
  // Reset custom dates when changing to a non-custom period
  useEffect(() => {
    if (period !== 'custom-range') {
      setShowCustomDatePicker(false);
    } else {
      setShowCustomDatePicker(true);
      // Initialize with last 7 days if not set
      if (!customStartDate) {
        const today = new Date();
        setCustomStartDate(new Date(today.setDate(today.getDate() - 7)));
        setCustomEndDate(new Date());
      }
    }
  }, [period]);
  
  // Calculate date range based on selected period
  const dateRange = useMemo(() => {
    if (period === 'custom-range' && customStartDate && customEndDate) {
      return [startOfDay(customStartDate), endOfDay(customEndDate)] as [Date, Date];
    }
    return getDateRangeByPeriod(period);
  }, [period, customStartDate, customEndDate]);
  
  // Filter tasks based on date range
  const filteredTasks = useMemo(() => {
    const filtered = filterTasksByDateRange(state.tasks, dateRange);
    console.log(`[StrategicReview:${instanceId}] Filtradas ${filtered.length} tarefas para análise`);
    return filtered;
  }, [state.tasks, dateRange, instanceId]);
  
  // Format date range for display
  const dateRangeDisplay = useMemo(() => {
    const [start, end] = dateRange;
    
    if (period === 'today') {
      return `Hoje (${format(start, 'dd/MM/yyyy')})`;
    }
    
    if (period === 'yesterday') {
      return `Ontem (${format(start, 'dd/MM/yyyy')})`;
    }
    
    if (period === 'custom-range' && customStartDate && customEndDate) {
      return `${format(customStartDate, 'dd/MM/yyyy')} - ${format(customEndDate, 'dd/MM/yyyy')}`;
    }
    
    if (isSameDay(start, end)) {
      return format(start, 'dd/MM/yyyy');
    }
    
    return `${format(start, 'dd/MM/yyyy')} - ${format(end, 'dd/MM/yyyy')}`;
  }, [dateRange, period, customStartDate, customEndDate]);

  const hasCompletedTasks = filteredTasks.length > 0;
  
  // Se estiver carregando ou não estiver autenticado, exibe mensagem apropriada
  if (isLoading) {
    console.log(`[StrategicReview:${instanceId}] Ainda verificando autenticação... ${new Date().toISOString()}`);
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <div className="ml-4">Verificando autenticação... {new Date().toISOString()}</div>
    </div>;
  }
  
  // Extra logging before showing error
  if (!isAuthenticated) {
    console.error(`[StrategicReview:${instanceId}] ERRO: Tentativa de acessar página protegida sem autenticação ${new Date().toISOString()}`);
    console.error(`[StrategicReview:${instanceId}] DETALHES EM PORTUGUÊS: Você precisa estar logado para acessar esta página`);
    
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-red-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full border-l-4 border-red-500">
          <h1 className="text-2xl font-bold text-red-700 mb-4">Acesso Restrito</h1>
          <p className="mb-4 text-gray-700">
            Você não está autenticado e está tentando acessar a página de Revisão Estratégica.
          </p>
          <p className="mb-4 text-gray-700">
            Em uma versão normal, você seria redirecionado para a página de login, 
            mas o redirecionamento automático foi desativado.
          </p>
          
          <div className="mt-6">
            <a 
              href="/login" 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Ir para Login manualmente
            </a>
          </div>
          
          <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
            <p className="font-semibold">Informações técnicas:</p>
            <p>Instance ID: {instanceId}</p>
            <p>Timestamp: {timestamp}</p>
            <p>Estado de autenticação: {isAuthenticated ? "Autenticado" : "Não autenticado"}</p>
            <p>Estado de carregamento: {isLoading ? "Carregando" : "Concluído"}</p>
            <p>Usuário: {currentUser?.email || "Nenhum"}</p>
            <p>Token no localStorage: {!!localStorage.getItem('sb-wbvxnapruffchikhrqrs-auth-token') ? "Presente" : "Ausente"}</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Final verification before rendering main content
  console.log(`[StrategicReview:${instanceId}] RENDERIZANDO CONTEÚDO PRINCIPAL - Autenticação validada ${new Date().toISOString()}`);
  
  // Rest of the component remains unchanged
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Insights das suas tarefas</h1>
        <p className="text-muted-foreground">Período: {dateRangeDisplay}</p>
      </div>
      
      {/* Just to confirm authentication status */}
      <div className="mb-4 px-4 py-2 bg-green-100 text-green-800 rounded-md">
        <p>Usuário autenticado: {currentUser?.email || "Sem email"}</p>
        <p className="text-xs">ID da instância: {instanceId}</p>
        <p className="text-xs">Hora de renderização: {timestamp}</p>
      </div>
      
      <Tabs defaultValue="week" value={period} onValueChange={(value) => setPeriod(value as PeriodType)} className="space-y-6">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="today">Hoje</TabsTrigger>
          <TabsTrigger value="yesterday">Ontem</TabsTrigger>
          <TabsTrigger value="week">Esta Semana</TabsTrigger>
          <TabsTrigger value="month">Este Mês</TabsTrigger>
          <TabsTrigger value="custom">Últimos 30 dias</TabsTrigger>
          <TabsTrigger value="custom-range">Personalizado</TabsTrigger>
        </TabsList>
        
        {/* Custom Date Range Picker */}
        {showCustomDatePicker && (
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Data inicial</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full sm:w-[200px] justify-start text-left font-normal",
                      !customStartDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {customStartDate ? format(customStartDate, 'dd/MM/yyyy') : <span>Selecionar data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={customStartDate}
                    onSelect={setCustomStartDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Data final</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full sm:w-[200px] justify-start text-left font-normal",
                      !customEndDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {customEndDate ? format(customEndDate, 'dd/MM/yyyy') : <span>Selecionar data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={customEndDate}
                    onSelect={setCustomEndDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                    disabled={(date) => 
                      customStartDate ? date < customStartDate : false
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex items-end">
              <Button 
                className="mb-0.5"
                variant="secondary" 
                onClick={() => {
                  if (!customStartDate || !customEndDate) {
                    toast({
                      title: "Datas inválidas",
                      description: "Por favor, selecione ambas as datas.",
                      variant: "destructive"
                    });
                    return;
                  }
                  
                  if (customEndDate < customStartDate) {
                    toast({
                      title: "Intervalo inválido",
                      description: "A data final deve ser posterior à data inicial.",
                      variant: "destructive"
                    });
                    return;
                  }
                  
                  // Refresh will happen based on the dateRange calculation
                  toast({
                    title: "Filtro aplicado",
                    description: `Mostrando dados de ${format(customStartDate, 'dd/MM/yyyy')} a ${format(customEndDate, 'dd/MM/yyyy')}`
                  });
                }}
              >
                <CalendarRange className="h-4 w-4 mr-2" />
                Aplicar intervalo
              </Button>
            </div>
          </div>
        )}
        
        {/* Single TabsContent that updates based on the filter */}
        <TabsContent value={period} className="space-y-6">
          <TaskSummaryCard tasks={filteredTasks} />
          
          {/* Only show analysis cards if there are tasks */}
          {hasCompletedTasks && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex">
                <FeedbackAnalysisCard tasks={filteredTasks} />
              </div>
              
              <div className="flex">
                <PillarsAnalysisCard tasks={filteredTasks} />
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StrategicReview;
