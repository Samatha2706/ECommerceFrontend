import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Manage your e-commerce application.</p>

      <div>
        <div>
          <h2>Products</h2>
          <p>Create, update and delete products.</p>
          <Link to="/admin/products">Manage Products</Link>
        </div>

        <div>
          <h2>Categories</h2>
          <p>Manage product categories.</p>
          <Link to="/admin/categories">Manage Categories</Link>
        </div>

        <div>
          <h2>Inventory</h2>
          <p>Manage stock and monitor low-stock products.</p>
          <Link to="/admin/inventory">Manage Inventory</Link>
        </div>

        <div>
          <h2>Orders</h2>
          <p>View customer orders and update order status.</p>
          <Link to="/admin/orders">Manage Orders</Link>
        </div>

        <div>
          <h2>Bulk Upload</h2>
          <p>Upload multiple products using Excel.</p>
          <Link to="/admin/bulk-upload">Bulk Upload Products</Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
