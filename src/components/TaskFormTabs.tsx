
import React from 'react';
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
}

const TaskFormTabs: React.FC<TaskFormTabsProps> = ({
  activeTab,
  setActiveTab,
  formData,
  handleChange,
  handleDateChange,
  setFormData,
  taskId,
  task
}) => {
  const handleTabValueChange = (value: string) => {
    console.log('Tab value changed to:', value);
    setActiveTab(value);
  };

  const handleTabClick = (e: React.MouseEvent, value: string) => {
    // Prevent the click from propagating to the modal backdrop
    e.preventDefault();
    e.stopPropagation();
    
    // Set the active tab
    setActiveTab(value);
    console.log('Tab clicked:', value);
  };

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={handleTabValueChange}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger 
          value="levels"
          data-testid="levels-tab"
          onClick={(e) => handleTabClick(e, "levels")}
        >
          Níveis
        </TabsTrigger>
        <TabsTrigger 
          value="comments"
          data-testid="comments-tab"
          onClick={(e) => handleTabClick(e, "comments")}
        >
          Comentários
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="levels" className="space-y-6">
        <TaskFormFields 
          formData={formData} 
          handleChange={handleChange} 
          handleDateChange={handleDateChange} 
          setFormData={setFormData} 
        />
      </TabsContent>
      
      <TabsContent value="comments">
        {taskId ? (
          <div className="space-y-4">
            {task && task.comments && task.comments.length > 0 && (
              <TaskComments taskId={taskId} comments={task.comments} />
            )}
            <CommentForm taskId={taskId} />
          </div>
        ) : (
          <div className="text-gray-500 italic">Salve a tarefa primeiro para adicionar comentários</div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default TaskFormTabs;
