'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function CookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'manager')) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (!user || (user.role === 'admin' || user.role === 'manager')) {
    return <div>Access denied</div>;
  }

  return <>{children}</>;
}