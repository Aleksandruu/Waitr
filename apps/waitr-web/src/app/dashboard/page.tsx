'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user?.role) {
      switch (user.role) {
        case 'admin':
          router.push('/dashboard/admin');
          break;
        case 'manager':
          router.push('/dashboard/manager');
          break;
        case 'cook':
        case 'barman':
        case 'barista':
          router.push('/dashboard/cook');
          break;
        case 'waiter':
          router.push('/dashboard/waiter');
          break;
        default:
          router.push('/');
          break;
      }
    }
  }, [user, router]);

  return <div>Redirecting...</div>;
}