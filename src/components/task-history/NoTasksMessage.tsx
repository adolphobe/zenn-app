
import React from 'react';

export const NoTasksMessage: React.FC = () => (
  <div className="text-center py-16">
    <h3 className="text-lg font-medium">Nenhuma tarefa concluída encontrada</h3>
    <p className="text-gray-500">
      Tente ajustar os filtros ou concluir algumas tarefas primeiro
    </p>
  </div>
);
