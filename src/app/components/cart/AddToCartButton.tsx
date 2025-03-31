import { useState } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '@/app/hooks/useCart';
import { CartStyle } from '@/app/styles/components/CartStyle';

type AddToCartButtonProps = {
  productId: string;
  stock: number;
};

const AddToCartButton = ({ productId, stock }: AddToCartButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { addProductToCart, showCart } = useCart();

  const handleAddToCart = async () => {
    if (stock <= 0) return;

    setLoading(true);
    try {
      await addProductToCart(productId);
      showCart();
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartStyle.ButtonContainer disabled={loading || stock <= 0} onClick={handleAddToCart}>
      <FiShoppingCart />
      <span>{stock <= 0 ? 'Agotado' : loading ? 'Agregando...' : 'Agregar al carrito'}</span>
    </CartStyle.ButtonContainer>
  );
};

export default AddToCartButton;
