import { useState } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '@/hooks/useCart';
import { CartStyle } from '@/styles/components/CartStyle';

type AddToCartButtonProps = {
  productId: string;
  stock: number;
};

const AddToCartButton = ({ productId, stock }: AddToCartButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addProductToCart, showCart } = useCart();

  const handleAddToCart = async () => {
    if (stock <= 0) {
      setError('Producto sin stock disponible');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (!addProductToCart) {
        throw new Error('No se pudo acceder al servicio del carrito');
      }

      const result = await addProductToCart(productId);

      if (result) {
        showCart();
      } else {
        throw new Error('No se pudo añadir el producto al carrito');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al agregar al carrito';

      setError(errorMessage);
      console.error('Error al agregar al carrito:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CartStyle.ButtonContainer disabled={loading || stock <= 0} onClick={handleAddToCart}>
        <FiShoppingCart />
        <span>{stock <= 0 ? 'Agotado' : loading ? 'Agregando...' : 'Agregar al carrito'}</span>
      </CartStyle.ButtonContainer>
      {error && <CartStyle.ErrorMessage>{error}</CartStyle.ErrorMessage>}
    </>
  );
};

export default AddToCartButton;
