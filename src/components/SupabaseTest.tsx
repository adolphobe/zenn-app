
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function SupabaseTest() {
  const [status, setStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [message, setMessage] = useState('Verificando conexão com Supabase...');

  useEffect(() => {
    async function testConnection() {
      try {
        // Try to get the current time from Supabase
        const { data, error } = await supabase.from('_validate_connection_').select('*').limit(1).single();
        
        // Specific error when the table doesn't exist, but the connection is ok
        if (error && error.code === 'PGRST116') {
          setStatus('success');
          setMessage('Conexão com Supabase estabelecida com sucesso!');
          return;
        }

        if (error) {
          throw error;
        }

        setStatus('success');
        setMessage('Conexão com Supabase estabelecida com sucesso!');
      } catch (error: any) {
        console.error('Erro ao conectar com Supabase:', error);
        
        // Check if it's a connection error or another type
        if (error.message?.includes('fetch')) {
          setStatus('error');
          setMessage(`Erro de conexão: Não foi possível conectar ao Supabase. Verifique a URL e a chave.`);
        } else {
          setStatus('error');
          setMessage(`Erro: ${error.message || 'Desconhecido'}`);
        }
      }
    }

    testConnection();
  }, []);

  return (
    <div className="p-4 rounded-md mb-4" 
         style={{ 
           backgroundColor: status === 'checking' ? '#f0f9ff' : 
                           status === 'success' ? '#f0fdf4' : '#fef2f2',
           border: `1px solid ${
             status === 'checking' ? '#bae6fd' : 
             status === 'success' ? '#bbf7d0' : '#fecaca'
           }`
         }}>
      <h3 className="text-lg font-medium">
        {status === 'checking' ? '🔄' : status === 'success' ? '✅' : '❌'} 
        Status do Supabase
      </h3>
      <p>{message}</p>
    </div>
  );
}
