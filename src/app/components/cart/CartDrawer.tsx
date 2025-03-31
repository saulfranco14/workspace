'use client';

import { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiX, FiTrash2, FiShoppingBag } from 'react-icons/fi';

import { useCart } from '@/app/hooks/useCart';
import { CartStyle } from '@/app/styles/components/CartStyle';
import CartItem from '@/app/components/cart/CartItem';

const CartDrawer = () => {
  const { items, isOpen, hideCart, totalItems, totalPrice, clearCart } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        hideCart();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, hideCart]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }

    return () => {
      document.body.style.overflow = 'visible';
    };
  }, [isOpen]);

  const handleCheckout = () => {
    hideCart();
    router.push('/checkout');
  };

  return (
    <>
      {isOpen && <CartStyle.Overlay />}
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
                  <CartItem key={item.id} item={item} />
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
                  <div>
                    <span>Envío:</span>
                    <strong>Calculado en el checkout</strong>
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
