import { Link } from "react-router-dom";
import styles from "../styles/Header.module.scss";

const Header = () => {
  return (
    <header className={styles.MainHeader}>
      <div className={styles.Container}>
        <Link to="/" className={styles.Title}>
          E-Commerce Rest
        </Link>
      </div>
    </header>
  );
};

export default Header;
