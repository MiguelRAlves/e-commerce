import styles from "./CartItemPreview.module.scss";
import type { CartItem } from "../../types/CartItem";
import api from "../../services/api";
import { getUserCartItems } from "../../services/getUserCartItems";
import { useCart } from "../../hooks/useCart";
import { useNavigate } from "react-router-dom";

type Props = {
  item: CartItem;
};

const CartItemPreview = ({ item }: Props) => {
  const { setCart } = useCart();
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/product/${item.product.id}`);
  }
  const handleRemoveItemFromCart = async () => {
    try {
      await api.delete(`/cart/${item.product.id}`);
      alert("Produto removido do carrinho.");
      const updatedCart = await getUserCartItems();
      setCart(updatedCart);
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
        <p onClick={handleNavigate} className={styles.CartItemName}>{item.product.name}</p>
        <div className={styles.CartItemPrice}>
          <p><span>Qtd:</span> {item.quantity}</p>
          <span>R$ {(item.product.price * item.quantity).toFixed(2)}</span>
          <button className={styles.CartItemRemoveButton} onClick={handleRemoveItemFromCart}>Remover</button>
        </div>
      </div>
    </li>
  );
};

export default CartItemPreview;