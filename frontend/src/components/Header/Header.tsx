import { Link } from "react-router-dom";
import styles from "./Header.module.scss";
import { useCart } from "../../hooks/useCart";
import { useState, useRef, useEffect } from "react";
import CartItemPreview from "../CartItem/CartItemPreview";
import api from "../../services/api";
import useAuthStore from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { cart, setCart } = useCart();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const [cartOpen, setCartOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const cartDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

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
      alert("Carrinho esvaziado.");
      setCart([]);
    } catch (error) {
      console.error("Erro ao esvaziar o carrinho:", error);
      alert("Erro ao esvaziar o carrinho.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target as Node)) {
        setCartOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
          await api.post('/api/auth/logout')
        } catch (err) {
            console.error("Erro ao fazer logout", err)
        } finally {
            logout(setCart);
            localStorage.removeItem('token');
            navigate('/signin');
        }
  };

  return (
    <header className={styles.MainHeader}>
      <div className={styles.Container}>
        <Link to="/" className={styles.Title}>
          E-Commerce Rest
        </Link>

        <div className={styles.RightSection}>
          <div className={styles.CartContainer} ref={cartDropdownRef}>
            <button
              className={styles.CartButton}
              onClick={() => setCartOpen((prev) => !prev)}
              aria-label="Abrir carrinho"
            >
              🛒
              {totalQuantity > 0 && <span className={styles.CartCount}>{totalQuantity}</span>}
            </button>

            {cartOpen && (
              <div className={styles.CartDropdown}>
                {Array.isArray(cart) && cart.length === 0 ? (
                  <p className={styles.EmptyMessage}>Seu carrinho está vazio.</p>
                ) : (
                  <>
                    <div className={styles.CartHeader}>
                      <p>Carrinho</p>
                      <button className={styles.ClearCartButton} onClick={handleClearCart}>Esvaziar carrinho</button>
                    </div>
                    <ul className={styles.CartItems}>
                      {cart?.map((item) => (
                        <CartItemPreview key={item.product.id} item={item} />
                      ))}
                    </ul>
                    <p className={styles.SubtotalPrice}>
                      Total: R$ {cart?.reduce((acc, item) => acc + item.product.price * item.quantity, 0).toFixed(2)}
                    </p>
                    <button
                      className={styles.CheckoutButton}
                      onClick={handleCheckout}
                    >
                      Finalizar pedido
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <div className={`${styles.UserDropdown} ${userDropdownOpen ? styles.Open : ""}`} ref={userDropdownRef}>
            <button
              className={styles.UserButton}
              onClick={() => setUserDropdownOpen((prev) => !prev)}
            >
              Olá, {user?.name || "usuário"} ⬇
            </button>

            <div className={styles.UserDropdownContent}>
              <Link to="/meus-pedidos">Meus pedidos</Link>
              <button className={styles.LogoutButton} onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
