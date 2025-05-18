
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { TaskToastProvider } from './utils/taskToasts';

interface TaskProvidersProps {
  children: React.ReactNode;
}

const TaskProviders: React.FC<TaskProvidersProps> = ({ children }) => {
  return (
    <TaskToastProvider>
      <AnimatePresence mode="wait">
        {children}
      </AnimatePresence>
    </TaskToastProvider>
  );
};

export default TaskProviders;
