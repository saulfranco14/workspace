import Image from 'next/image';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';

import { CartItem as CartItemType } from '@/interfaces/cart.interface';
import { useCart } from '@/hooks/useCart';
import { CartStyle } from '@/styles/components/CartStyle';

type CartPageItemProps = {
  item: CartItemType;
};

const CartPageItem = ({ item }: CartPageItemProps) => {
  const { updateQuantity, removeItem } = useCart();

  if (!item.product) return null;

  const { id, quantity, product } = item;
  const { name, price, image_url, stock } = product;
  const subtotal = price * quantity;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > stock) return;
    updateQuantity(id, newQuantity);
  };

  const handleRemove = () => {
    removeItem(id);
  };

  return (
    <CartStyle.ItemContainerItem>
      <CartStyle.ItemImage>
        {image_url ? (
          <Image src={image_url} alt={name} width={100} height={100} objectFit="cover" />
        ) : (
          <CartStyle.PlaceholderImageItem>Sin imagen</CartStyle.PlaceholderImageItem>
        )}
      </CartStyle.ItemImage>

      <CartStyle.ItemDetailsItem>
        <CartStyle.ItemNameItem>{name}</CartStyle.ItemNameItem>
        <CartStyle.ItemPriceItem>${price.toFixed(2)}</CartStyle.ItemPriceItem>
        <CartStyle.StockInfo>En stock: {stock}</CartStyle.StockInfo>
      </CartStyle.ItemDetailsItem>

      <CartStyle.QuantityContainerItem>
        <CartStyle.QuantityButtonItem onClick={() => handleQuantityChange(quantity - 1)} disabled={quantity <= 1}>
          <FiMinus />
        </CartStyle.QuantityButtonItem>

        <CartStyle.QuantityInput
          type="number"
          value={quantity}
          min={1}
          max={stock}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
        />

        <CartStyle.QuantityButtonItem onClick={() => handleQuantityChange(quantity + 1)} disabled={quantity >= stock}>
          <FiPlus />
        </CartStyle.QuantityButtonItem>
      </CartStyle.QuantityContainerItem>

      <CartStyle.SubtotalContainer>
        <CartStyle.SubtotalLabel>Subtotal:</CartStyle.SubtotalLabel>
        <CartStyle.SubtotalAmount>${subtotal.toFixed(2)}</CartStyle.SubtotalAmount>
      </CartStyle.SubtotalContainer>

      <CartStyle.RemoveButtonItem onClick={handleRemove}>
        <FiTrash2 />
      </CartStyle.RemoveButtonItem>
    </CartStyle.ItemContainerItem>
  );
};

export default CartPageItem;
