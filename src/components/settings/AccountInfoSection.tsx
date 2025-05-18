
import React from 'react';
import { User } from '@/types/user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AccountInfoSectionProps {
  user: User;
}

const AccountInfoSection: React.FC<AccountInfoSectionProps> = ({ user }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações da conta</CardTitle>
        <CardDescription>
          Detalhes da sua conta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            value={user.name}
            disabled
            className="bg-muted/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            value={user.email}
            disabled
            className="bg-muted/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="created">Conta criada em</Label>
          <Input
            id="created"
            value={new Date(user.createdAt).toLocaleDateString('pt-BR')}
            disabled
            className="bg-muted/50"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountInfoSection;
