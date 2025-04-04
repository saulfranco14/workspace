'use client';

import { useState } from 'react';
import { FiShare2 } from 'react-icons/fi';
import { shareProduct } from '@/utils/shareProduct';
import { ProductIdStyles } from '@/styles/components/ProductIdStyle';

type ButtonSharedProps = {
  productName: string;
  productId: string;
};

export default function ButtonShared({ productName, productId }: ButtonSharedProps) {
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    const success = await shareProduct(productName, productId);

    if (success) {
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <ProductIdStyles.ActionButton aria-label="Compartir producto" onClick={handleShare}>
      <FiShare2 />
      <span className="action-text">{shared ? 'Enlace copiado' : 'Compartir'}</span>
    </ProductIdStyles.ActionButton>
  );
}
