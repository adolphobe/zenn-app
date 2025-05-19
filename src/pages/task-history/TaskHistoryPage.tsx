
import React from 'react';
import { useAuth } from '@/context/auth';
import { useTaskDataContext } from '@/context/TaskDataProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

/**
 * Simplified TaskHistoryPage component that displays completed tasks
 */
const TaskHistoryPage = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { completedTasks, completedTasksLoading } = useTaskDataContext();
  
  const isLoading = completedTasksLoading || authLoading;

  if (isLoading) {
    return (
      <div className="container p-4 mx-auto flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando histórico de tarefas...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div className="container p-4 mx-auto">
        <Alert>
          <AlertTitle>Você não está autenticado</AlertTitle>
          <AlertDescription>
            Faça login para ver o histórico de tarefas.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Simplified content - just show a list of completed tasks
  return (
    <div className="container p-4 mx-auto">
      <h1 className="text-2xl font-bold mb-4">Histórico de Tarefas</h1>
      
      <div className="text-muted-foreground mb-4">
        {completedTasks.length > 0 ? 
          `${completedTasks.length} ${completedTasks.length === 1 ? 'tarefa concluída' : 'tarefas concluídas'}` : 
          'Nenhuma tarefa concluída para exibir'
        }
      </div>

      {completedTasks.length === 0 ? (
        <Alert>
          <AlertTitle>Nenhuma tarefa concluída</AlertTitle>
          <AlertDescription>
            Quando você concluir tarefas, elas aparecerão aqui.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {completedTasks.map((task) => (
            <Card key={task.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium">
                  {task.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {task.description || 'Sem descrição'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Concluída em: {task.completedAt ? new Date(task.completedAt).toLocaleDateString('pt-BR') : 'Data desconhecida'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskHistoryPage;
