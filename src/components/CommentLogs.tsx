
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { clearLogs, exportLogsToText, getLogs, LogEntry, LogLevel } from '@/utils/commentLogger';
import { Download, Trash2, RefreshCw } from 'lucide-react';

/**
 * Componente para exibir e gerenciar logs do sistema de comentários
 */
const CommentLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<LogLevel | 'ALL'>('ALL');
  
  // Carregar logs do localStorage
  const loadLogs = () => {
    const allLogs = getLogs();
    setLogs(allLogs);
  };
  
  // Carregar logs inicialmente
  useEffect(() => {
    loadLogs();
  }, []);
  
  // Filtrar logs com base no nível selecionado
  const filteredLogs = filter === 'ALL' 
    ? logs 
    : logs.filter(log => log.level === filter);
  
  // Exportar logs para um arquivo de texto
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
  
  // Limpar todos os logs
  const handleClear = () => {
    if (confirm("Tem certeza que deseja apagar todos os logs? Esta ação não pode ser desfeita.")) {
      clearLogs();
      setLogs([]);
      toast({
        title: "Logs limpos",
        description: "Todos os logs foram removidos"
      });
    }
  };
  
  // Formatar timestamp para exibição
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (e) {
      return timestamp;
    }
  };
  
  // Determinar cor do nível de log
  const getLevelColor = (level: LogLevel): string => {
    switch (level) {
      case LogLevel.DEBUG: return 'text-gray-500';
      case LogLevel.INFO: return 'text-blue-500';
      case LogLevel.WARN: return 'text-yellow-500';
      case LogLevel.ERROR: return 'text-red-500';
      default: return 'text-gray-700';
    }
  };
  
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Logs do Sistema de Comentários</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadLogs} 
            title="Atualizar logs"
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Atualizar</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport} 
            title="Exportar logs para arquivo"
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClear}
            title="Limpar todos os logs"
            className="flex items-center gap-1 text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
            <span>Limpar</span>
          </Button>
        </div>
      </div>
      
      {/* Filtros de nível de log */}
      <div className="flex gap-2 mb-4">
        <Button 
          size="sm" 
          variant={filter === 'ALL' ? "default" : "outline"}
          onClick={() => setFilter('ALL')}
        >
          Todos
        </Button>
        {Object.values(LogLevel).map((level) => (
          <Button 
            key={level}
            size="sm"
            variant={filter === level ? "default" : "outline"}
            onClick={() => setFilter(level)}
            className={filter === level ? "" : getLevelColor(level)}
          >
            {level}
          </Button>
        ))}
        <div className="ml-auto text-sm text-gray-500">
          {filteredLogs.length} {filteredLogs.length === 1 ? 'entrada' : 'entradas'}
        </div>
      </div>
      
      {/* Lista de logs */}
      <ScrollArea className="h-[400px] border rounded">
        {filteredLogs.length > 0 ? (
          <div className="space-y-2 p-2">
            {filteredLogs.map((log, index) => (
              <div 
                key={index} 
                className="border-b pb-2 last:border-b-0"
              >
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{formatTimestamp(log.timestamp)}</span>
                  <span className={`font-medium ${getLevelColor(log.level)}`}>
                    {log.level}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-xs font-mono bg-gray-100 rounded px-1 py-0.5 mr-2">
                    {log.category}
                  </span>
                  <span className="text-sm">{log.message}</span>
                </div>
                {log.data && (
                  <pre className="text-xs bg-gray-50 p-1 mt-1 rounded overflow-auto max-h-28">
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Nenhum log encontrado
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};

export default CommentLogs;
