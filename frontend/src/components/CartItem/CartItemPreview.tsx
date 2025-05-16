import styles from "./CartItemPreview.module.scss";
import type { CartItem } from "../../types/CartItem";
import api from "../../services/api";
import { getUserCartItems } from "../../services/getUserCartItems";
import { useCart } from "../../hooks/useCart";

type Props = {
  item: CartItem;
};

const CartItemPreview = ({ item }: Props) => {
  const { setCart } = useCart();
  const handleClick = async () => {
    try {
      await api.delete(`/cart/${item.product.id}`);
      const updatedCart = await getUserCartItems();
      setCart(updatedCart);
      alert("Produto removido do carrinho.");
    } catch (error) {
      console.error("Erro ao remover item do carrinho:", error);
    }
  }


  return (
    <li className={styles.CartItem}>
      <img
        className={styles.CartItemImage}
        src={item.product.imageUrl}
        alt={item.product.name}
      />
      <div className={styles.CartItemInfo}>
        <p className={styles.CartItemName}>{item.product.name}</p>
        <div className={styles.CartItemPrice}>
          <p><span>Qtd:</span> {item.quantity}</p>
          <span>R$ {(item.product.price * item.quantity).toFixed(2)}</span>
          <button className={styles.CartItemRemoveButton} onClick={handleClick}>Remover</button>
        </div>
      </div>
    </li>
  );
};

export default CartItemPreview;