
import React from 'react';

interface TaskFormActionsProps {
  onClose: () => void;
}

const TaskFormActions: React.FC<TaskFormActionsProps> = ({ onClose }) => {
  return (
    <div className="pt-4 sm:pt-6 flex justify-end space-x-3">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
      >
        Cancelar
      </button>
      <button
        type="submit"
        className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all"
      >
        Salvar
      </button>
    </div>
  );
};

export default TaskFormActions;
