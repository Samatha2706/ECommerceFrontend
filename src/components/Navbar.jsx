import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

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
    setProfileOpen(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo">S</div>

          <div className="navbar-brand-text">
            <span className="navbar-title">ShopEase</span>
            <span className="navbar-tagline">Simple. Secure. Shopping.</span>
          </div>
        </Link>

        {/* Navigation */}
        <div className="navbar-links">
          <Link to="/" className="navbar-link">
            Home
          </Link>

          <Link to="/products" className="navbar-link">
            Products
          </Link>

          {token && (
            <>
              <Link to="/cart" className="navbar-link">
                🛒 Cart
              </Link>

              <Link to="/orders" className="navbar-link">
                My Orders
              </Link>
            </>
          )}

          {/* Admin Navigation */}
          {isAdmin && (
            <div className="navbar-admin-group">
              <span className="navbar-admin-label">Admin</span>

              <Link to="/admin" className="navbar-link">
                Dashboard
              </Link>

              <Link to="/admin/products" className="navbar-link">
                Products
              </Link>

              <Link to="/admin/categories" className="navbar-link">
                Categories
              </Link>

              <Link to="/admin/inventory" className="navbar-link">
                Inventory
              </Link>

              <Link to="/admin/orders" className="navbar-link">
                Orders
              </Link>

              <Link to="/admin/bulk-upload" className="navbar-link">
                Bulk Upload
              </Link>
            </div>
          )}

          {/* Profile */}
          {token && (
            <div className="profile-container">
              <button
                className="profile-button"
                onClick={() => setProfileOpen(!profileOpen)}
                aria-label="Profile menu"
              >
                <span className="profile-icon">👤</span>
              </button>

              {profileOpen && (
                <div className="profile-dropdown">
                  <Link
                    to="/profile"
                    className="profile-dropdown-item"
                    onClick={() => setProfileOpen(false)}
                  >
                    My Profile
                  </Link>

                  <button
                    className="profile-dropdown-logout"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Logged Out */}
          {!token && (
            <div className="navbar-auth">
              <Link to="/login" className="navbar-login">
                Login
              </Link>

              <Link to="/register" className="navbar-register">
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
