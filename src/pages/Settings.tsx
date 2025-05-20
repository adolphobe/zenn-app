
import React, { useState } from 'react';
import { useAuth } from '@/context/auth';
import { useImagePreloader } from '@/hooks/useImagePreloader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { updateUserProfile } from '@/utils/profileUtils';
import AvatarSelector from '@/components/settings/AvatarSelector';
import UserStatsDisplay from '@/components/settings/UserStatsDisplay';
import AccountInfoSection from '@/components/settings/AccountInfoSection';
import DeleteAccountModal from '@/components/settings/DeleteAccountModal';
import PasswordResetSection from '@/components/settings/PasswordResetSection';

// Available avatars - easy to add more later
const availableAvatars = [
  "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?ga=GA1.1.1745944876.1746044229&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-psd/3d-rendering-hair-style-avatar-design_23-2151869153.jpg?ga=GA1.1.1745944876.1746044229&semt=ais_hybrid&w=740",
  "https://img.freepik.com/premium-photo/cartoon-character-with-blue-background-generated-by-ai_1029473-129016.jpg?ga=GA1.1.1745944876.1746044229&semt=ais_hybrid&w=740",
  "https://img.freepik.com/premium-photo/memoji-handsome-asian-guy-chinese-man-white-background-emoji-cartoon-character_826801-7436.jpg?ga=GA1.1.1745944876.1746044229&semt=ais_hybrid&w=740",
  "https://img.freepik.com/premium-photo/3d-rendering-hair-style-avatar-design_23-2151869159.jpg?ga=GA1.1.1745944876.1746044229&semt=ais_hybrid&w=740",
  "https://img.freepik.com/premium-psd/3d-avatar-illustration-pro-gamer-isolated-transparent-background_846458-28.jpg?ga=GA1.1.1745944876.1746044229&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671122.jpg?ga=GA1.1.1745944876.1746044229&semt=ais_hybrid&w=740"
];

const Settings = () => {
  const { currentUser, isLoading } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState<string | undefined>(currentUser?.profileImage);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Preload all avatar images
  const { imagesLoaded } = useImagePreloader({ imageUrls: availableAvatars });
  
  const handleAvatarSelect = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
  };
  
  const handleSave = async () => {
    if (!currentUser || !selectedAvatar) return;
    
    setIsSaving(true);
    try {
      await updateUserProfile(currentUser.id, { profileImage: selectedAvatar });
      
      toast({
        title: "Perfil atualizado",
        description: "Seu avatar foi atualizado com sucesso",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar seu avatar",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando configurações...</p>
        </div>
      </div>
    );
  }
  
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Não autenticado</CardTitle>
            <CardDescription>Você precisa estar logado para acessar as configurações</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-0 md:container md:max-w-3xl md:mx-auto py-4 md:py-8 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Configurações</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Gerencie suas preferências e informações de conta</p>
      </div>
      
      <div className="space-y-6">
        {/* Account Information */}
        <AccountInfoSection user={currentUser} />
        
        {/* User Statistics */}
        <UserStatsDisplay />
        
        {/* Avatar Selection */}
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle>Escolha seu avatar</CardTitle>
            <CardDescription>
              Selecione uma imagem para seu perfil
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {imagesLoaded ? (
              <AvatarSelector 
                avatars={availableAvatars}
                selectedAvatar={selectedAvatar}
                onSelect={handleAvatarSelect}
              />
            ) : (
              <div className="flex justify-center py-4 sm:py-8">
                <div className="w-6 h-6 border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-end pt-2 sm:pt-4">
            <Button 
              onClick={handleSave} 
              disabled={isSaving || selectedAvatar === currentUser.profileImage}
            >
              {isSaving ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Password Reset Section */}
        <PasswordResetSection />
        
        {/* Delete Account Section */}
        <div className="flex justify-start pt-0 pb-12">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-red-400 border-red-100 hover:bg-red-50 hover:text-red-500 font-extralight"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Apagar minha conta
          </Button>
        </div>
      </div>
      
      <DeleteAccountModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
      />
    </div>
  );
};

export default Settings;
