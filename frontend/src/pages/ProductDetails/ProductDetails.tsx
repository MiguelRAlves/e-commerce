import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import styles from "./ProductDetails.module.scss";
import "../../App.css"
import { useCart } from "../../hooks/useCart";
import { getUserCartItems } from "../../services/getUserCartItems";
import { toast } from "react-toastify";

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    categoryId: number;
    category: Category;
}

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const { setCart } = useCart();

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleIncrease = () => {
        if (product && quantity < product?.stock) {
            setQuantity(quantity + 1);
        }
    };

    const handleAddToCart = async () => {
        if (!product) return;
        if (product.stock < quantity) {
            toast.error("Quantidade indisponível");
            return;
        }

        try {
            await api.post(`/cart/${product.id}`, { quantity });
            const updatedCart = await getUserCartItems();
            setCart(updatedCart);
            toast.success("Produto adicionado ao carrinho com sucesso!");
        } catch (error) {
            console.error("Erro ao adicionar ao carrinho:", error);
            alert("Erro ao adicionar ao carrinho.");
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error("Erro ao buscar produto:", error);
            }
        };

        fetchProduct();
    }, [id]);

    if (!product) return <p>Carregando...</p>;

    return (
        <div className={styles.Container}>
            <img src={product.imageUrl} alt={product.name} className={styles.Image} />
            <div className={styles.InfoContainer}>
                <h2 className={styles.Name}>{product.name}</h2>
                <div className={styles.ProductInfo}>
                    <p className={styles.Description}>{product.description}</p>
                    <p>Categoria: {product.category.name}</p>
                    <p>Estoque: {product.stock}</p>
                </div>
                <div className={styles.QuantityContainer}>
                    <button onClick={handleDecrease} className={styles.QuantityButton}>-</button>
                    <input
                        type="number"
                        className={styles.QuantityInput}
                        value={quantity}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if (value >= 1 && value <= product.stock) {
                                setQuantity(value);
                            }
                        }}
                    />
                    <button onClick={handleIncrease} className={styles.QuantityButton}>+</button>
                </div>
                <p className={styles.Subtotal}>Subtotal: R$ {(product.price * quantity).toFixed(2)}</p>
                <p className={styles.Price}>R$ {product.price.toFixed(2)}</p>
                <button className={styles.AddToCart} onClick={handleAddToCart}>Adicionar ao carrinho</button>
            </div>
        </div>
    );
};

export default ProductDetails;