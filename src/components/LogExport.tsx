
import React from 'react';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { exportLogsToText } from '@/utils/commentLogger';

/**
 * Componente simples para exportar logs de comentários
 */
const LogExport: React.FC = () => {
  const handleExport = () => {
    try {
      const content = exportLogsToText();
      
      // Criar um blob e link para download
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      // Criar elemento de link e simular clique
      const a = document.createElement('a');
      a.href = url;
      a.download = `comentarios_logs_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      
      // Limpar
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Logs exportados",
        description: "Arquivo de logs gerado com sucesso"
      });
    } catch (error) {
      console.error('Erro ao exportar logs:', error);
      toast({
        title: "Erro ao exportar logs",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Button 
      onClick={handleExport}
      variant="outline"
      className="flex items-center gap-2"
    >
      <Download size={16} />
      <span>Exportar Logs de Comentários</span>
    </Button>
  );
};

export default LogExport;
