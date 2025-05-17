
import React, { useRef } from 'react';
import { Task } from '@/types';
import TaskComments from '@/components/TaskComments';
import CommentForm from '@/components/CommentForm';

interface CommentsContentProps {
  task: Task;
  onCommentAdded: () => void;
}

const CommentsContent: React.FC<CommentsContentProps> = ({ task, onCommentAdded }) => {
  const commentsContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={commentsContainerRef} className="space-y-4">
      {task.comments && task.comments.length > 0 && (
        <TaskComments taskId={task.id} comments={task.comments} />
      )}
      <CommentForm 
        taskId={task.id}
        onCommentAdded={onCommentAdded} 
      />
    </div>
  );
};

export default CommentsContent;
