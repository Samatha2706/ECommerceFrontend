import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  let isAdmin = false;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      const role =
        payload[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] || payload.role;

      isAdmin = role === "Admin";
    } catch (error) {
      console.error("Invalid token");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav>
      <div>
        <h2>ShopEase</h2>
      </div>

      <div>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>

        {token && (
          <>
            <Link to="/cart">Cart</Link>
            <Link to="/orders">My Orders</Link>
          </>
        )}

        {isAdmin && (
          <>
            <Link to="/admin">Admin Dashboard</Link>

            <Link to="/admin/products">Admin Products</Link>

            <Link to="/admin/categories">Categories</Link>

            <Link to="/admin/inventory">Inventory</Link>

            <Link to="/admin/orders">Orders</Link>

            <Link to="/admin/bulk-upload">Bulk Upload</Link>
          </>
        )}

        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
