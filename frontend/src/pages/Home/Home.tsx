import { useEffect, useState } from "react";
import api from "../../services/api";
import styles from "./Home.module.scss";
import ProductCard from "../../components/ProductCard/ProductCard";

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
    const [products, setProducts] = useState<Product[]>([]);
    const [categoryFilter, setCategoryFilter] = useState("Todas");
    const [searchTerm, setSearchTerm] = useState("");


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
        </div>
    );
}

export default Home