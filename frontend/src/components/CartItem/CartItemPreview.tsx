import styles from "./CartItemPreview.module.scss";
import type { CartItem } from "../../types/CartItem";

type Props = {
  item: CartItem;
};

const CartItemPreview = ({ item }: Props) => {
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
        </div>
      </div>
    </li>
  );
};

export default CartItemPreview;