'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Order from '@/pages/Customer/Order/Order';

export default function OrderPage() {
  const router = useRouter();
  const params = useParams();
  const { status } = useSelector((state: RootState) => state.order);

  useEffect(() => {
    if (status === 'empty') {
      router.push(`/${params.locationSlug}/${params.tableNumber}`);
    }
  }, [status, router, params]);

  if (status === 'empty') {
    return null;
  }

  return <Order />;
}