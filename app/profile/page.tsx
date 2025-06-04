'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const redirectToUserProfile = async () => {
      console.log('Status da sessão:', status);
      console.log('Dados da sessão:', session);

      if (status === 'unauthenticated') {
        console.log('Usuário não autenticado, redirecionando para login...');
        router.push('/login');
        return;
      }

      if (status === 'authenticated' && session?.user?.id) {
        try {
          console.log('Buscando dados do usuário...', session.user.id);
          const response = await fetch(`/api/users/${session.user.id}`);
          
          if (!response.ok) {
            throw new Error('Erro ao carregar perfil');
          }
          
          const data = await response.json();
          console.log('Dados do usuário recebidos:', data);
          
          if (data?.username) {
            console.log('Redirecionando para perfil do usuário:', data.username);
            router.push(`/profile/${data.username}`);
          } else {
            throw new Error('Username não encontrado');
          }
        } catch (error) {
          console.error('Erro ao redirecionar:', error);
          router.push('/login');
        }
      }
    };

    redirectToUserProfile();
  }, [session, status, router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
} 