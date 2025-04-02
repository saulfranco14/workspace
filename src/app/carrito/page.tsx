'use client';

import Link from 'next/link';
import { FiTrash2, FiArrowLeft } from 'react-icons/fi';

import CartPageItem from '@/app/components/cart/CartPageItem';
import CartEmpty from '@/app/components/cart/CartEmpty';
import { useCart } from '@/hooks/useCart';
import { CartStyle } from '@/styles/components/CartStyle';

export default function CartPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart();

  if (items.length === 0) return <CartEmpty />;

  return (
    <CartStyle.Container>
      <CartStyle.HeaderContainer>
        <h1>Mi Carrito ({totalItems})</h1>
        <CartStyle.ClearButtonPage onClick={clearCart}>
          <FiTrash2 />
          Vaciar carrito
        </CartStyle.ClearButtonPage>
      </CartStyle.HeaderContainer>

      <CartStyle.CartContainer>
        <CartStyle.CartItemsSection>
          {items.map((item) => (
            <CartPageItem key={item.id} item={item} />
          ))}
        </CartStyle.CartItemsSection>

        <CartStyle.CartSummarySection>
          <CartStyle.SummaryCard>
            <h2>Resumen del pedido</h2>

            <CartStyle.SummaryRow>
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </CartStyle.SummaryRow>

            <CartStyle.SummaryTotal>
              <span>Total</span>
              <strong>${totalPrice.toFixed(2)}</strong>
            </CartStyle.SummaryTotal>

            <CartStyle.CheckoutButtonPage>Proceder al pago</CartStyle.CheckoutButtonPage>

            <Link href="/">
              <CartStyle.ContinueShoppingLink>
                <FiArrowLeft />
                Continuar comprando
              </CartStyle.ContinueShoppingLink>
            </Link>
          </CartStyle.SummaryCard>
        </CartStyle.CartSummarySection>
      </CartStyle.CartContainer>
    </CartStyle.Container>
  );
}
