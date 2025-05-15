
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

  // This function is critical for preventing propagation
  const handleTabClick = (e: React.MouseEvent, value: string) => {
    console.log('Tab clicked:', value);
    
    // Stop all event propagation
    e.preventDefault();
    e.stopPropagation();
    
    // Set the active tab
    setActiveTab(value);
  };

  // This ensures clicks within tab content don't bubble up
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Tab content clicked, preventing propagation');
  };

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={handleTabValueChange}
      className="w-full"
      onClick={(e) => {
        e.stopPropagation();
        console.log('Tabs container clicked, preventing propagation');
      }}
    >
      <TabsList 
        className="grid w-full grid-cols-2 mb-4"
        onClick={(e) => {
          e.stopPropagation();
          console.log('TabsList clicked, preventing propagation');
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          console.log('TabsList mousedown, preventing propagation');
        }}
      >
        <TabsTrigger 
          value="levels"
          data-testid="levels-tab"
          onClick={(e) => handleTabClick(e, "levels")}
          onMouseDown={(e) => {
            e.stopPropagation();
            console.log('Levels tab mousedown, preventing propagation');
          }}
        >
          Níveis
        </TabsTrigger>
        <TabsTrigger 
          value="comments"
          data-testid="comments-tab"
          onClick={(e) => handleTabClick(e, "comments")}
          onMouseDown={(e) => {
            e.stopPropagation();
            console.log('Comments tab mousedown, preventing propagation');
          }}
        >
          Comentários
        </TabsTrigger>
      </TabsList>
      
      <TabsContent 
        value="levels" 
        className="space-y-6"
        onClick={handleContentClick}
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
        onClick={handleContentClick}
      >
        {taskId ? (
          <div 
            className="space-y-4"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Comments content div clicked, preventing propagation');
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
