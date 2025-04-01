import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '@/app/hooks/useCart';
import { CartStyle } from '@/app/styles/components/CartStyle';

const CartButton = () => {
  const { showCart, totalItems } = useCart();

  return (
    <CartStyle.Button onClick={showCart}>
      <FiShoppingCart />
      {totalItems > 0 && <CartStyle.Badge>{totalItems}</CartStyle.Badge>}
    </CartStyle.Button>
  );
};

export default CartButton;
