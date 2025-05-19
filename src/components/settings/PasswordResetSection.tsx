
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertCircle } from 'lucide-react';

const PasswordResetSection = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordLongEnough, setPasswordLongEnough] = useState(true);

  const validateForm = () => {
    let valid = true;
    
    // Check if new passwords match
    if (newPassword !== confirmPassword) {
      setPasswordsMatch(false);
      valid = false;
    } else {
      setPasswordsMatch(true);
    }

    // Check password length (minimum 6 characters for Supabase)
    if (newPassword.length < 6) {
      setPasswordLongEnough(false);
      valid = false;
    } else {
      setPasswordLongEnough(true);
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsDialogOpen(true);
  };

  const handlePasswordChange = async () => {
    setIsLoading(true);
    
    try {
      // First get the current session to retrieve the email
      const { data: sessionData } = await supabase.auth.getSession();
      const userEmail = sessionData.session?.user.email;
      
      if (!userEmail) {
        toast({
          title: "Erro ao recuperar informações",
          description: "Não foi possível obter seu email. Por favor, faça login novamente.",
          variant: "destructive"
        });
        setIsDialogOpen(false);
        setIsLoading(false);
        return;
      }
      
      // Now verify the current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: currentPassword,
      });

      if (signInError) {
        toast({
          title: "Senha atual incorreta",
          description: "Por favor, verifique sua senha atual e tente novamente.",
          variant: "destructive"
        });
        setIsDialogOpen(false);
        setIsLoading(false);
        return;
      }

      // If current password is correct, update to the new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        toast({
          title: "Erro ao atualizar senha",
          description: updateError.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Senha alterada com sucesso",
          description: "Sua senha foi atualizada."
        });

        // Clear form inputs
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      toast({
        title: "Erro inesperado",
        description: "Não foi possível alterar sua senha. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsDialogOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Alterar senha</CardTitle>
          <CardDescription>
            Atualize sua senha para manter sua conta segura
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Senha atual</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="Digite sua senha atual"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova senha</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Digite sua nova senha"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className={!passwordLongEnough ? "border-red-500" : ""}
              />
              {!passwordLongEnough && (
                <p className="text-xs text-red-500 flex items-center mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  A senha deve ter no mínimo 6 caracteres
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirme a nova senha</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Digite novamente sua nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={!passwordsMatch ? "border-red-500" : ""}
              />
              {!passwordsMatch && (
                <p className="text-xs text-red-500 flex items-center mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  As senhas não coincidem
                </p>
              )}
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-end">
          <Button 
            onClick={handleSubmit}
            disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
          >
            {isLoading ? "Processando..." : "Alterar senha"}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar alteração de senha</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja alterar sua senha? Você precisará usar a nova senha em seu próximo login.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={handlePasswordChange} disabled={isLoading}>
              {isLoading ? "Processando..." : "Alterar senha"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PasswordResetSection;
