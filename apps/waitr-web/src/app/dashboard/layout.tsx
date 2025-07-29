'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Navbar from '../../pages/Dashboard/Navbar/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { token, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
  }, [token, router]);

  if (!token) {
    return null; // or loading spinner
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}