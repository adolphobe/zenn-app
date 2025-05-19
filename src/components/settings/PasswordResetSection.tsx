
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
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const PasswordResetSection = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordLongEnough, setPasswordLongEnough] = useState(true);
  const [currentPasswordError, setCurrentPasswordError] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [samePasswordError, setSamePasswordError] = useState(false);

  const validateForm = () => {
    let valid = true;
    
    // Reset errors
    setPasswordsMatch(true);
    setPasswordLongEnough(true);
    setCurrentPasswordError(false);
    setSamePasswordError(false);
    
    // Check if new passwords match
    if (newPassword !== confirmPassword) {
      setPasswordsMatch(false);
      valid = false;
    }

    // Check password length (minimum 6 characters for Supabase)
    if (newPassword.length < 6) {
      setPasswordLongEnough(false);
      valid = false;
    }

    // Check if new password is the same as current password
    if (newPassword === currentPassword && newPassword !== '') {
      setSamePasswordError(true);
      valid = false;
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
    setCurrentPasswordError(false);
    setShowSuccessMessage(false);
    setSamePasswordError(false);
    
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
        console.error("Erro na verificação de senha:", signInError.message);
        
        // Show error for current password
        setCurrentPasswordError(true);
        
        toast({
          title: "Senha atual incorreta",
          description: "Por favor, verifique sua senha atual e tente novamente.",
          variant: "destructive"
        });
        
        setIsDialogOpen(false);
        setIsLoading(false);
        return;
      }

      // Check if new password is the same as current password
      if (newPassword === currentPassword) {
        setSamePasswordError(true);
        
        toast({
          title: "Senha igual à atual",
          description: "A nova senha não pode ser igual à senha atual.",
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
        // Handle specific error for same password (from Supabase)
        if (updateError.message.includes('different from the old password')) {
          setSamePasswordError(true);
          toast({
            title: "Senha igual à atual",
            description: "A nova senha não pode ser igual à senha atual.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Erro ao atualizar senha",
            description: updateError.message,
            variant: "destructive"
          });
        }
      } else {
        // Show success message with a more noticeable toast
        toast({
          title: "Senha alterada com sucesso",
          description: "Sua senha foi atualizada. Sua sessão continua ativa.",
          icon: <CheckCircle className="h-5 w-5 text-green-500" />
        });

        // Show success message in the UI
        setShowSuccessMessage(true);

        // Clear form inputs
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // Keep success message visible for 5 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 5000);
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
          {showSuccessMessage && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700">
                Senha alterada com sucesso! Sua sessão continua ativa.
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Senha atual</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="Digite sua senha atual"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setCurrentPasswordError(false);
                  setSamePasswordError(false);
                }}
                required
                className={currentPasswordError ? "border-red-500" : ""}
              />
              {currentPasswordError && (
                <p className="text-xs text-red-500 flex items-center mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Senha atual incorreta
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova senha</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Digite sua nova senha"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setSamePasswordError(false);
                }}
                required
                className={!passwordLongEnough || samePasswordError ? "border-red-500" : ""}
              />
              {!passwordLongEnough && (
                <p className="text-xs text-red-500 flex items-center mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  A senha deve ter no mínimo 6 caracteres
                </p>
              )}
              {samePasswordError && (
                <p className="text-xs text-red-500 flex items-center mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  A nova senha não pode ser igual à senha atual
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
