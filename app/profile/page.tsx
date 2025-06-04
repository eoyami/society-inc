'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface User {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
  username: string;
  level: number;
  points: number;
}

export default function ProfileRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      router.replace('/login');
      return;
    }

    const user = session.user as User;
    if (user.username) {
      router.replace(`/profile/${user.username}`);
    }
  }, [session, status, router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
} 