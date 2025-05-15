
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

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={handleTabValueChange}
      className="w-full" 
      onClick={(e) => {
        e.stopPropagation();
        console.log('Tabs container clicked, propagation stopped');
      }}
    >
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger 
          value="levels"
          data-testid="levels-tab"
          onClick={(e) => {
            e.stopPropagation();
            console.log('Levels tab clicked');
          }}
        >
          Níveis
        </TabsTrigger>
        <TabsTrigger 
          value="comments"
          data-testid="comments-tab"
          onClick={(e) => {
            e.stopPropagation();
            console.log('Comments tab clicked');
          }}
        >
          Comentários
        </TabsTrigger>
      </TabsList>
      
      <TabsContent 
        value="levels" 
        className="space-y-6"
        onClick={(e) => {
          e.stopPropagation();
          console.log('Levels content clicked');
        }}
      >
        <TaskFormFields 
          formData={formData} 
          handleChange={handleChange} 
          handleDateChange={handleDateChange} 
          setFormData={setFormData} 
        />
      </TabsContent>
      
      <TabsContent 
        value="comments"
        onClick={(e) => {
          e.stopPropagation();
          console.log('Comments content clicked');
        }}
      >
        {taskId ? (
          <div 
            className="space-y-4"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Comments container clicked');
            }}
          >
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
