import { Link } from "react-router-dom";

function AdminDashboard() {
  const adminSections = [
    {
      title: "Products",
      description: "Create, update and manage your products.",
      link: "/admin/products",
      icon: "🛍️",
    },
    {
      title: "Categories",
      description: "Manage product categories.",
      link: "/admin/categories",
      icon: "📂",
    },
    {
      title: "Inventory",
      description: "Manage stock and monitor low-stock products.",
      link: "/admin/inventory",
      icon: "📦",
    },
    {
      title: "Orders",
      description: "View customer orders and update order status.",
      link: "/admin/orders",
      icon: "🧾",
    },
    {
      title: "Bulk Upload",
      description: "Upload multiple products using Excel.",
      link: "/admin/bulk-upload",
      icon: "📊",
    },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <div>
          <p className="admin-eyebrow">ADMIN PANEL</p>
          <h1>Admin Dashboard</h1>
          <p>
            Manage products, inventory, categories and customer orders from one
            place.
          </p>
        </div>
      </div>

      <div className="admin-dashboard-grid">
        {adminSections.map((section) => (
          <div className="admin-dashboard-card" key={section.title}>
            <div className="admin-card-icon">{section.icon}</div>

            <h2>{section.title}</h2>

            <p>{section.description}</p>

            <Link to={section.link} className="admin-card-button">
              Manage {section.title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
