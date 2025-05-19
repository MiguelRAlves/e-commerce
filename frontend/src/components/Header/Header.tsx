import { Link } from "react-router-dom";
import styles from "./Header.module.scss";
import { useCart } from "../../hooks/useCart";
import { useState, useRef, useEffect } from "react";
import CartItemPreview from "../CartItem/CartItemPreview";
import api from "../../services/api";

const Header = () => {
  const { cart, setCart } = useCart();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const totalQuantity = cart?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const handleCheckout = async () => {
    try {
      const response = await api.post("/orders/");
      const order = response.data;

      const paymentResponse = await api.post(`/payment/create-checkout-session/${order.id}`);
      const { url } = paymentResponse.data;

      setCart([]);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      alert("Ocorreu um erro ao finalizar o pedido. Tente novamente.");
    }
  };

  const handleClearCart = async () => {
    const confirmClear = window.confirm("Tem certeza que deseja esvaziar o carrinho?");
    if (!confirmClear) return;

    try {
      await api.delete("/cart/");
      setCart([]);
      alert("Carrinho esvaziado.");
    } catch (error) {
      console.error("Erro ao esvaziar o carrinho:", error);
      alert("Erro ao esvaziar o carrinho.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <header className={styles.MainHeader}>
      <div className={styles.Container}>
        <Link to="/" className={styles.Title}>
          E-Commerce Rest
        </Link>

        <div className={styles.CartContainer} ref={dropdownRef}>
          <button
            className={styles.CartButton}
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Abrir carrinho"
          >
            🛒
            {totalQuantity > 0 && <span className={styles.CartCount}>{totalQuantity}</span>}
          </button>

          {open && (
            <div className={styles.CartDropdown}>
              {Array.isArray(cart) && cart.length === 0 ? (
                <p className={styles.EmptyMessage}>Seu carrinho está vazio.</p>
              ) : (
                <>
                  <div className={styles.CartHeader}>
                    <p>Carrinho</p>
                    <button onClick={handleClearCart} className={styles.ClearCartButton}>
                      Esvaziar carrinho
                    </button>
                  </div>
                  <ul className={styles.CartItems}>
                    {cart?.map((item) => (
                      <CartItemPreview key={item.product.id} item={item} />
                    ))}
                  </ul>
                  <p className={styles.SubtotalPrice}>Total: R$ {cart?.reduce((acc, item) => acc + item.product.price * item.quantity, 0).toFixed(2)}</p>
                  <button
                    className={styles.CheckoutButton}
                    onClick={handleCheckout}
                    aria-label="Finalizar pedido"
                  >
                    Finalizar pedido
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
