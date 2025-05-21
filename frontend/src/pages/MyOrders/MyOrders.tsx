// src/pages/MeusPedidos.tsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import styles from "./MyOrders.module.scss";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  product: Product;
}

interface Order {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  orderItems: OrderItem[];
}

export default function MeusPedidos() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders/", {
        });
        setOrders(response.data);
      } catch (err) {
        console.error("Erro ao buscar pedidos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Carregando pedidos...</p>;
  if (!orders.length) return <p>Você ainda não fez nenhum pedido.</p>;

  return (
    <div className={styles.MyOrders}>
      <h1>Meus Pedidos</h1>
      {orders.map((order) => (
        <div key={order.id} className={styles.Order}>
          <div className={styles.OrderHeader}>
            <span><strong>Data:</strong> {new Date(order.createdAt).toLocaleDateString()}</span>
            <span><strong>Status:</strong> {order.status}</span>
            <span><strong>Total:</strong> R$ {order.total.toFixed(2)}</span>
          </div>
          <div className={styles.OrderProducts}>
            {order.orderItems.map((item) => (
              <div key={item.id} className={styles.Product}>
                <img className={styles.ProductImage} src={item.product.imageUrl} alt={item.product.name} />
                <div className={styles.ProductInfo}>
                  <h4 className={styles.ProductName}>{item.product.name}</h4>
                  <p className={styles.ProductDescription}>{item.product.description}</p>
                  <p className={styles.ProductQuantity}>Quantidade: {item.quantity}</p>
                  <p className={styles.ProductPrice}>
                    {item.quantity}x R$ {item.unitPrice.toFixed(2)} = R${" "}
                    {(item.quantity * item.unitPrice).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}