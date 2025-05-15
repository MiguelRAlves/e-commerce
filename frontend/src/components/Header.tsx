import { Link } from "react-router-dom";
import styles from "../styles/Header.module.scss";
import { useCart } from "../hooks/useCart";
import { useState, useRef, useEffect } from "react";
import CartItemPreview from "./CartItem/CartItemPreview";

const Header = () => {
  const { cart } = useCart();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const totalQuantity = cart?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  // Fecha dropdown clicando fora
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
                  <ul className={styles.CartItems}>
                    {cart?.map((item) => (
                      <CartItemPreview key={item.product.id} item={item} />
                    ))}
                  </ul>
                  <button
                    className={styles.CheckoutButton}
                    onClick={() => alert("Finalizar pedido")}
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
