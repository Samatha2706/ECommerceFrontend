import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <div>
        <h2>ShopEase</h2>
      </div>

      <div>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;