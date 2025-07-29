'use client';

import { useGetProductByIdQuery } from '@/api/managerApi';
import CreateProduct from '@/pages/Dashboard/Manager/CreateProduct/CreateProduct';
import { useParams } from 'next/navigation';

export default function EditProductPage() {
  const params = useParams();
  const productId = params.productId as string;
  const { data: product, isLoading, error } = useGetProductByIdQuery(productId);

  if (error || !product) {
    return (
      <div className="container">
        <div className="middle-column-container">
          <h1>Error</h1>
          <p>Nu s-a putut încărca produsul. Vă rugăm să încercați din nou.</p>
        </div>
      </div>
    );
  }

  return <CreateProduct product={product} isEditing={true} />;
}