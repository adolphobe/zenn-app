import React, { useState } from 'react';
import { Task } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Clock, ListChecks } from 'lucide-react';
import TaskComments from '@/components/TaskComments';
import CommentForm from '@/components/CommentForm';
import { useAuth } from '@/context/auth';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import TaskHistory from './task/TaskHistory';
import TaskChecklist from './task/TaskChecklist';

interface TaskFormTabsProps {
  task: Task;
  className?: string;
  onCommentAdded?: () => void;
  onChecklistChange?: () => void;
}

const TaskFormTabs: React.FC<TaskFormTabsProps> = ({
  task,
  className,
  onCommentAdded,
  onChecklistChange
}) => {
  const [activeTab, setActiveTab] = useState<string>('comments');
  const { isAuthenticated } = useAuth();

  const handleCommentAdded = () => {
    if (onCommentAdded) {
      onCommentAdded();
    }
  };

  const handleChecklistChange = () => {
    if (onChecklistChange) {
      onChecklistChange();
    }
  };

  return (
    <Tabs
      defaultValue="comments"
      value={activeTab}
      onValueChange={setActiveTab}
      className={cn("w-full", className)}
    >
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="comments" className="flex items-center gap-2">
          <MessageSquare size={16} />
          <span>Comentários</span>
        </TabsTrigger>
        <TabsTrigger value="history" className="flex items-center gap-2">
          <Clock size={16} />
          <span>Histórico</span>
        </TabsTrigger>
        <TabsTrigger value="checklist" className="flex items-center gap-2">
          <ListChecks size={16} />
          <span>Checklist</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="comments" className="space-y-4">
        <Comments task={task} onCommentAdded={handleCommentAdded} />
      </TabsContent>

      <TabsContent value="history">
        <TaskHistory taskId={task.id} />
      </TabsContent>

      <TabsContent value="checklist">
        <TaskChecklist 
          task={task} 
          onChange={handleChecklistChange}
        />
      </TabsContent>
    </Tabs>
  );
};

const Comments: React.FC<{
  task: Task;
  onCommentAdded?: () => void;
}> = ({ task, onCommentAdded }) => {
  const { isAuthenticated } = useAuth();
  
  const handleCommentAdded = () => {
    if (onCommentAdded) {
      onCommentAdded();
    }
  };
  
  return (
    <div className="h-full overflow-y-auto">
      {task.id ? (
        <TaskComments 
          taskId={task.id} 
          comments={task.comments || []} 
        />
      ) : (
        <div className="p-4 text-center text-gray-500">
          Salve a tarefa para adicionar comentários
        </div>
      )}
      
      {task.id ? (
        <div className="mt-4">
          <CommentForm 
            taskId={task.id} 
            onCommentAdded={handleCommentAdded} 
          />
        </div>
      ) : (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-sm rounded text-center">
          Salve a tarefa para adicionar comentários
        </div>
      )}
      
      {!isAuthenticated && task.id && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 text-sm rounded text-center">
          <a href="/#/login" className="font-medium hover:underline">
            Faça login
          </a>{' '}
          para adicionar comentários
        </div>
      )}
    </div>
  );
};

export default TaskFormTabs;
