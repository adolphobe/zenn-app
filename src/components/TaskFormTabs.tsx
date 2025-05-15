
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
  // Prevenir a propagação de eventos para o modal
  const handleTabClick = (e: React.MouseEvent, value: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Tab clicked:', value);
    setActiveTab(value);
  };

  // Prevenir a propagação de eventos para o conteúdo da tab
  const handleTabContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Tab content clicked');
  };

  return (
    <Tabs 
      defaultValue="levels" 
      className="w-full" 
      value={activeTab} 
      onValueChange={setActiveTab}
      onClick={(e) => e.stopPropagation()}
    >
      <TabsList className="grid w-full grid-cols-2 mb-4" onClick={(e) => e.stopPropagation()}>
        <TabsTrigger 
          value="levels" 
          onClick={(e) => handleTabClick(e, "levels")}
        >
          Níveis
        </TabsTrigger>
        <TabsTrigger 
          value="comments" 
          onClick={(e) => handleTabClick(e, "comments")}
        >
          Comentários
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="levels" className="space-y-6" onClick={handleTabContentClick}>
        <TaskFormFields 
          formData={formData} 
          handleChange={handleChange} 
          handleDateChange={handleDateChange} 
          setFormData={setFormData} 
        />
      </TabsContent>
      
      <TabsContent value="comments" onClick={handleTabContentClick}>
        {taskId && (
          <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
            {task && task.comments && task.comments.length > 0 && (
              <div onClick={(e) => e.stopPropagation()}>
                <TaskComments taskId={taskId} comments={task.comments} />
              </div>
            )}
            <div onClick={(e) => e.stopPropagation()}>
              <CommentForm taskId={taskId} />
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default TaskFormTabs;
