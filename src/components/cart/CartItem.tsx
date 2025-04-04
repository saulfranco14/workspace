import Image from 'next/image';
import { useCallback } from 'react';
import { FiTrash2 } from 'react-icons/fi';

import { useCart } from '@/hooks/useCart';
import { CartItem as CartItemType } from '@/interfaces/cart.interface';
import { CartStyle } from '@/styles/components/CartStyle';

type CartItemProps = {
  item: CartItemType;
};

const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCart();

  const handleQuantityChange = useCallback(
    async (newQuantity: number) => {
      if (!item?.product || newQuantity > item.product.stock || newQuantity <= 0) return;
      await updateQuantity(item.id, newQuantity);
    },
    [item, updateQuantity]
  );

  const handleRemove = useCallback(async () => {
    if (!item) return;
    await removeItem(item.id);
  }, [item, removeItem]);

  if (!item.product) return null;

  const { quantity, product } = item;
  const { name, price, image_url, stock } = product;

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
            <CartStyle.QuantityValue>{quantity}</CartStyle.QuantityValue>
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
