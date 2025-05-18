
import React from 'react';
import { TaskToastProvider } from './utils/taskToasts';

interface TaskProvidersProps {
  children: React.ReactNode;
}

const TaskProviders: React.FC<TaskProvidersProps> = ({ children }) => {
  return (
    <TaskToastProvider>
      {children}
    </TaskToastProvider>
  );
};

export default TaskProviders;
