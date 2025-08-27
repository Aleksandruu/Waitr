'use client';

import { useParams } from 'next/navigation';
import { useGetLocationSettingsQuery } from '../../api/managerApi';
import BottomBar from '../../pages/Customer/BottomBar/BottomBar';
import Navbar from '../../pages/Customer/Navbar/Navbar';

export default function LocationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const locationSlug = params?.locationSlug as string;
  
  useGetLocationSettingsQuery(locationSlug);

  return (
    <>
      <Navbar />
      {children}
      <BottomBar />
    </>
  );
}