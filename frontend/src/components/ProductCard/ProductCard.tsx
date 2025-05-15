import styles from "./ProductCard.module.scss";
type Props = {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
};

const ProductCard = ({ id, name, imageUrl, price }: Props) => {
  return (
    <li key={id} className={styles.Product}>
      <img className={styles.ProductImage} src={imageUrl} alt={name} />
      <div className={styles.ProductInfo}>
        <p className={styles.ProductName}>{name}</p>
        <span>R$ {price}</span>
      </div>
      <button className={styles.ProductButton}>Adicionar ao carrinho</button>
    </li>
  );
};

export default ProductCard;
