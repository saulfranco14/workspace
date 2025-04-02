'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiX, FiTrash2, FiShoppingBag } from 'react-icons/fi';

import { useCart } from '@/hooks/useCart';
import { CartStyle } from '@/styles/components/CartStyle';
import CartItem from '@/components/cart/CartItem';

const CartDrawer = () => {
  const { items, isOpen, hideCart, totalItems, totalPrice, clearCart } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleClickOutside = (event: React.MouseEvent) => {
    if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
      hideCart();
    }
  };

  const handleCheckout = () => {
    hideCart();
    router.push('/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      <CartStyle.Overlay onClick={handleClickOutside} />
      <CartStyle.DrawerContainer ref={drawerRef} isOpen={isOpen}>
        <CartStyle.DrawerHeader>
          <h3>
            <FiShoppingBag />
            Mi Carrito ({totalItems})
          </h3>
          <CartStyle.CloseButton onClick={hideCart}>
            <FiX />
          </CartStyle.CloseButton>
        </CartStyle.DrawerHeader>

        <CartStyle.DrawerContent>
          {items.length === 0 ? (
            <CartStyle.EmptyCart>
              <FiShoppingBag size={50} />
              <p>Tu carrito está vacío</p>
              <button onClick={hideCart}>Continuar comprando</button>
            </CartStyle.EmptyCart>
          ) : (
            <>
              <CartStyle.ItemsList>
                {items.map((item) => (
                  <CartItem key={`cart-item-${item.id}`} item={item} />
                ))}
              </CartStyle.ItemsList>

              <CartStyle.CartSummary>
                <div>
                  <CartStyle.ClearButton onClick={clearCart}>
                    <FiTrash2 />
                    Vaciar carrito
                  </CartStyle.ClearButton>
                </div>
                <CartStyle.TotalContainer>
                  <div>
                    <span>Subtotal:</span>
                    <strong>${totalPrice.toFixed(2)}</strong>
                  </div>

                  <CartStyle.TotalRow>
                    <span>Total:</span>
                    <strong>${totalPrice.toFixed(2)}</strong>
                  </CartStyle.TotalRow>
                </CartStyle.TotalContainer>

                <CartStyle.ButtonsContainer>
                  <CartStyle.ContinueButton onClick={hideCart}>Seguir comprando</CartStyle.ContinueButton>
                  <CartStyle.CheckoutButton onClick={handleCheckout}>Proceder al pago</CartStyle.CheckoutButton>
                </CartStyle.ButtonsContainer>
              </CartStyle.CartSummary>
            </>
          )}
        </CartStyle.DrawerContent>
      </CartStyle.DrawerContainer>
    </>
  );
};

export default CartDrawer;
