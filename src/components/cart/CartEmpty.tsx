import Link from 'next/link';

import { FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { CartStyle } from '@/styles/components/CartStyle';

export default function CartEmpty() {
  return (
    <CartStyle.Container>
      <h1>Mi Carrito</h1>
      <CartStyle.EmptyCartPage>
        <FiShoppingBag size={60} />
        <h2>Tu carrito está vacío</h2>
        <p>Parece que aún no has agregado productos a tu carrito.</p>
        <Link href="/">
          <CartStyle.ContinueButtonPage>
            <FiArrowLeft />
            Continuar comprando
          </CartStyle.ContinueButtonPage>
        </Link>
      </CartStyle.EmptyCartPage>
    </CartStyle.Container>
  );
}
