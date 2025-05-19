import React, { useRef, useState, useEffect } from 'react';
import { Task, TaskFormData } from '../types';
import TaskFormFields from './TaskFormFields';
import TaskComments from './TaskComments';
import CommentForm from './CommentForm';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useQueryClient } from '@tanstack/react-query';

interface TaskFormTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  formData: TaskFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<TaskFormData>>;
  taskId?: string;
  task?: Task;
  isEditing?: boolean;
}

const TaskFormTabs: React.FC<TaskFormTabsProps> = ({
  activeTab,
  setActiveTab,
  formData,
  handleChange,
  handleDateChange,
  setFormData,
  taskId,
  task,
  isEditing = false
}) => {
  // Reference for the comments container in the DOM
  const commentsContainerRef = useRef<HTMLDivElement | null>(null);
  const [commentCount, setCommentCount] = useState<number>(task?.comments?.length || 0);
  const queryClient = useQueryClient();
  
  // Update comment count when task changes
  useEffect(() => {
    setCommentCount(task?.comments?.length || 0);
    console.log(`[TaskFormTabs] Task comments updated: ${task?.comments?.length || 0} comments`);
  }, [task?.comments]);
  
  // Function to scroll to the bottom of the comments list
  const scrollToBottom = () => {
    if (commentsContainerRef.current) {
      const scrollElement = commentsContainerRef.current.querySelector('.native-scrollbar');
      if (scrollElement) {
        console.log('[TaskFormTabs] Scrolling to bottom of comments');
        scrollElement.scrollTop = scrollElement.scrollHeight;
      } else {
        console.log('[TaskFormTabs] Native scrollbar element not found');
      }
    } else {
      console.log('[TaskFormTabs] Comments container ref not found');
    }
  };
  
  // Effect to scroll to the bottom when the comments tab is selected or comments change
  useEffect(() => {
    if (activeTab === 'comments') {
      console.log(`[TaskFormTabs] Comments tab active, comments count: ${task?.comments?.length || 0}`);
      // Small delay to ensure the DOM has been updated
      setTimeout(scrollToBottom, 100);
    }
  }, [activeTab, commentCount]);
  
  // Handler for when a comment is added
  const handleCommentAdded = (): void => {
    console.log('[TaskFormTabs] Comment added callback triggered');
    
    // Invalidate queries to refresh task data immediately
    if (taskId) {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      
      // Forçar busca dos comentários atualizados
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['tasks'] });
        queryClient.refetchQueries({ queryKey: ['task', taskId] });
        queryClient.refetchQueries({ queryKey: ['comments', taskId] });
        
        // Update comment count to trigger scrollToBottom effect
        if (task?.comments) {
          setCommentCount(prev => prev + 1);
        } else {
          setCommentCount(1);
        }
        
        // Try to scroll to bottom immediately and again after a delay
        scrollToBottom();
        setTimeout(scrollToBottom, 300);
      }, 100);
    }
  };

  // Handler for comment deletion to update local state
  const handleCommentDeleted = (): void => {
    console.log('[TaskFormTabs] Comment deleted callback triggered');
    
    // Invalidate queries to refresh task data immediately
    if (taskId) {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      
      // Forçar busca dos comentários atualizados
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['tasks'] });
        queryClient.refetchQueries({ queryKey: ['task', taskId] });
        queryClient.refetchQueries({ queryKey: ['comments', taskId] });
        
        // Update comment count to reflect deletion
        if (task?.comments && task.comments.length > 0) {
          setCommentCount(prevCount => Math.max(0, prevCount - 1));
        }
      }, 100);
    }
  };
  
  // If we're creating a new task (not editing), only show the basic fields
  if (!isEditing && !taskId) {
    return (
      <div className="space-y-6">
        <TaskFormFields 
          formData={formData} 
          handleChange={handleChange} 
          handleDateChange={handleDateChange} 
          setFormData={setFormData} 
        />
      </div>
    );
  }
  
  // Log rendering info in useEffect to avoid TypeScript error
  useEffect(() => {
    if (taskId && task) {
      console.log('[TaskFormTabs] Rendering comments section', { 
        taskId, 
        hasComments: task.comments && task.comments.length > 0,
        commentsCount: task.comments?.length
      });
    }
  }, [taskId, task]);
  
  // Otherwise, show the full tabs interface when editing
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger 
          value="levels"
          data-testid="levels-tab"
        >
          Níveis
        </TabsTrigger>
        <TabsTrigger 
          value="comments"
          data-testid="comments-tab"
        >
          Comentários {commentCount > 0 && `(${commentCount})`}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent 
        value="levels" 
        className="space-y-6"
      >
        <TaskFormFields 
          formData={formData} 
          handleChange={handleChange} 
          handleDateChange={handleDateChange} 
          setFormData={setFormData} 
        />
      </TabsContent>
      
      <TabsContent value="comments">
        {taskId ? (
          <div ref={commentsContainerRef} className="space-y-4">
            {task && task.comments && task.comments.length > 0 ? (
              <TaskComments 
                taskId={taskId} 
                comments={task.comments} 
                onCommentDeleted={handleCommentDeleted}
              />
            ) : (
              <div className="py-4 text-center text-gray-500 italic">
                Sem comentários para esta tarefa
              </div>
            )}
            
            <CommentForm 
              taskId={taskId}
              onCommentAdded={handleCommentAdded}
            />
          </div>
        ) : (
          <div className="text-gray-500 italic">Salve a tarefa primeiro para adicionar comentários</div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default TaskFormTabs;
