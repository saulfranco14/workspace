import Image from 'next/image';
import { useCallback } from 'react';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';

import { useCart } from '@/app/hooks/useCart';
import { CartItem as CartItemType } from '@/app/interfaces/cart.interface';
import { CartStyle } from '@/app/styles/components/CartStyle';

type CartItemProps = {
  item: CartItemType;
};

const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCart();

  if (!item.product) return null;

  const { id, quantity, product } = item;
  const { name, price, image_url, stock } = product;

  const handleQuantityChange = useCallback(
    async (newQuantity: number) => {
      if (newQuantity > stock || newQuantity <= 0) return;
      await updateQuantity(id, newQuantity);
    },
    [id, stock, updateQuantity]
  );

  const handleRemove = useCallback(async () => {
    await removeItem(id);
  }, [id, removeItem]);

  return (
    <CartStyle.ItemContainer>
      <CartStyle.ImageContainer>
        {image_url ? (
          <Image src={image_url} alt={name} width={70} height={70} style={{ objectFit: 'cover' }} />
        ) : (
          <CartStyle.PlaceholderImage>
            <span>Sin imagen</span>
          </CartStyle.PlaceholderImage>
        )}
      </CartStyle.ImageContainer>

      <CartStyle.ItemDetails>
        <CartStyle.ItemName>{name}</CartStyle.ItemName>
        <CartStyle.ItemPrice>${price.toFixed(2)}</CartStyle.ItemPrice>

        <CartStyle.QuantityContainer>
          <CartStyle.QuantityControls>
            <CartStyle.QuantityButton onClick={() => handleQuantityChange(quantity - 1)} disabled={quantity <= 1}>
              <FiMinus />
            </CartStyle.QuantityButton>

            <CartStyle.QuantityValue>{quantity}</CartStyle.QuantityValue>

            <CartStyle.QuantityButton onClick={() => handleQuantityChange(quantity + 1)} disabled={quantity >= stock}>
              <FiPlus />
            </CartStyle.QuantityButton>
          </CartStyle.QuantityControls>

          <CartStyle.RemoveButton onClick={handleRemove}>
            <FiTrash2 />
          </CartStyle.RemoveButton>
        </CartStyle.QuantityContainer>
      </CartStyle.ItemDetails>
    </CartStyle.ItemContainer>
  );
};

export default CartItem;
