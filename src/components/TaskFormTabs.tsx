
import React, { useRef, useEffect } from 'react';
import { Task, TaskFormData } from '../types';
import TaskFormFields from './TaskFormFields';
import TaskComments from './TaskComments';
import CommentForm from './CommentForm';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

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
  
  // Function to scroll to the bottom of the comments list
  const scrollToBottom = () => {
    if (commentsContainerRef.current) {
      const scrollElement = commentsContainerRef.current.querySelector('.native-scrollbar');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };
  
  // Effect to scroll to the bottom when the comments tab is selected
  useEffect(() => {
    if (activeTab === 'comments' && task?.comments?.length) {
      // Small delay to ensure the DOM has been updated
      setTimeout(scrollToBottom, 100);
    }
  }, [activeTab, task?.comments?.length]);
  
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
          Comentários
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
            {task && task.comments && task.comments.length > 0 && (
              <TaskComments taskId={taskId} comments={task.comments} />
            )}
            <CommentForm 
              taskId={taskId}
              onCommentAdded={scrollToBottom}
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
