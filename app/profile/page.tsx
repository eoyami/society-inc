'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role?: string;
  username: string;
  level: number;
  points: number;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const user = session?.user as User | undefined;

    if (!user?.username) {
      router.replace('/login');
      return;
    }

    router.replace(`/profile/${user.username}`);
  }, [session?.user, router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
} 