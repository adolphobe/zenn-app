
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

const StatusBox: React.FC = () => {
  const { currentUser, isAuthenticated, isLoading, session } = useAuth();

  return (
    <Card className="w-full mb-6 border-2 border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20">
      <CardHeader className="pb-2">
        <div className="flex flex-row justify-between items-center">
          <CardTitle className="text-lg font-semibold">Status do Sistema</CardTitle>
          <Badge 
            variant={isAuthenticated ? "default" : "destructive"}
            className={isAuthenticated ? "bg-green-600" : ""}
          >
            {isLoading ? "Carregando..." : isAuthenticated ? "Autenticado" : "Não Autenticado"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-2 text-sm">
        <div className="grid gap-1">
          <div className="flex flex-wrap gap-1 mb-3">
            <Badge variant="outline" className="bg-blue-100/50 dark:bg-blue-900/20">
              Rota: {window.location.pathname}
            </Badge>
            <Badge variant="outline" className="bg-purple-100/50 dark:bg-purple-900/20">
              Hora do Servidor: {new Date().toLocaleString('pt-BR')}
            </Badge>
          </div>

          <Separator className="my-2" />
          
          <h3 className="font-semibold">Informações de Autenticação:</h3>
          <div className="ml-2 mt-1">
            <p><strong>Status:</strong> {isLoading ? "Carregando..." : isAuthenticated ? "Usuário Autenticado" : "Usuário Não Autenticado"}</p>
            {isAuthenticated && currentUser ? (
              <>
                <p><strong>Usuário:</strong> {currentUser?.email}</p>
                <p><strong>Nome:</strong> {currentUser?.name || "N/A"}</p>
                <p><strong>ID do Usuário:</strong> {currentUser?.id || "N/A"}</p>
                <p><strong>Último Login:</strong> {currentUser?.lastLoginAt ? new Date(currentUser.lastLoginAt).toLocaleString('pt-BR') : "N/A"}</p>
              </>
            ) : (
              <p className="text-orange-600 dark:text-orange-400">Nenhum usuário autenticado no momento</p>
            )}
          </div>
          
          <Separator className="my-2" />
          
          <h3 className="font-semibold">Detalhes da Sessão:</h3>
          <div className="ml-2 mt-1">
            {session ? (
              <>
                <p><strong>ID da Sessão:</strong> {session.access_token ? session.access_token.substring(0, 15) + '...' : "N/A"}</p>
                <p><strong>Tipo de Provider:</strong> {session.user?.app_metadata?.provider || "email"}</p>
                <p><strong>Expira em:</strong> {session.expires_at ? new Date(session.expires_at * 1000).toLocaleString('pt-BR') : "N/A"}</p>
                <p><strong>Token Refresh:</strong> {session.refresh_token ? "Disponível" : "Não disponível"}</p>
              </>
            ) : (
              <p className="text-orange-600 dark:text-orange-400">Nenhuma sessão ativa no momento</p>
            )}
          </div>
          
          <Separator className="my-2" />
          
          <h3 className="font-semibold">Informações do Navegador:</h3>
          <div className="ml-2 mt-1">
            <p><strong>User Agent:</strong> {navigator.userAgent}</p>
            <p><strong>Local Storage:</strong> {localStorage.getItem('sb-wbvxnapruffchikhrqrs-auth-token') ? "Token de auth encontrado" : "Nenhum token de auth"}</p>
            <p><strong>Cookies Habilitados:</strong> {navigator.cookieEnabled ? "Sim" : "Não"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusBox;
