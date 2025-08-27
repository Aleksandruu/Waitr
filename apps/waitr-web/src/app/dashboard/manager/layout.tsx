'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@store';
import { useGetLocationQuery } from '@api/managerApi';

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Fetch location data for manager
  useGetLocationQuery();

  useEffect(() => {
    if (user && user.role !== 'manager') {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (!user || user.role !== 'manager') {
    return <div>Access denied</div>;
  }

  return <>{children}</>;
}