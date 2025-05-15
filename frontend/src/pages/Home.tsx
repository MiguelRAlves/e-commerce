import { useEffect, useState } from "react";
import api from "../services/api";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Home.module.scss";
import ProductCard from "../components/ProductCard/ProductCard";
import { useCart } from "../hooks/useCart";

interface Product {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
    category: {
        name: string;
    };
}

const Home = () => {
    const logout = useAuthStore(state => state.logout);
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [categoryFilter, setCategoryFilter] = useState("Todas");
    const [searchTerm, setSearchTerm] = useState("");
    const { setCart } = useCart();
    const onClick = async () => {
        try {
            await api.post('/api/auth/logout')
        } catch (err) {
            console.error("Erro ao fazer logout", err)
        } finally {
            logout(setCart);
            localStorage.removeItem('token');
            navigate('/signin');
        }
    }

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesCategory = categoryFilter === "Todas" || product.category.name === categoryFilter;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className={styles.Container}>
            <div className={styles.Filters}>
                <select aria-label="Filtrar por categoria" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                    <option value="Todas">Todas</option>
                    <option value="Eletrônicos">Eletrônicos</option>
                    <option value="Roupas">Roupas</option>
                </select>

                <input
                    type="text"
                    placeholder="Buscar produto"
                    aria-label="Buscar produto por nome"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            <div className={styles.HomeContainer} >
                <ul className={styles.ProductsContainer}>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                imageUrl={product.imageUrl}
                                price={product.price}
                            />
                    )))
                    : (
                        <p className={styles.NoProducts}>Nenhum produto encontrado</p>
                    )}
                </ul>
            </div>
            <button className={styles.LogoutButton} onClick={onClick}>Logout</button>
        </div>
    );
}

export default Home