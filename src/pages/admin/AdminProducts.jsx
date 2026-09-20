import { useEffect, useState } from "react";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "../../services/adminProductService";
import { getProducts } from "../../services/productService";
import { getCategories } from "../../services/categoryService";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    initialQuantity: "",
    reorderLevel: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);

      const [productData, categoryData] = await Promise.all([
        getProducts({ pageSize: 100 }),
        getCategories(),
      ]);

      setProducts(productData.products || productData);
      setCategories(categoryData);
    } catch (err) {
      console.error(err);
      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      categoryId: "",
      initialQuantity: "",
      reorderLevel: "",
    });

    setEditingId(null);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const productData = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        categoryId: Number(form.categoryId),
        initialQuantity: Number(form.initialQuantity),
        reorderLevel: Number(form.reorderLevel),
      };

      if (editingId) {
        await updateProduct(editingId, productData);
        setMessage("Product updated successfully.");
      } else {
        await createProduct(productData);
        setMessage("Product created successfully.");
      }

      resetForm();
      await loadData();
    } catch (err) {
      console.error(err);

      setError(err.response?.data?.message || "Unable to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      categoryId: product.categoryId || "",
      initialQuantity: product.availableQuantity || 0,
      reorderLevel: product.reorderLevel || 0,
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await deleteProduct(id);

      setMessage("Product deleted successfully.");

      await loadData();
    } catch (err) {
      console.error(err);

      setError(err.response?.data?.message || "Unable to delete product.");
    }
  };

  return (
    <div className="admin-products-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">ADMIN PANEL</p>
          <h1>Products</h1>
          <p>Manage your store's product catalog.</p>
        </div>
      </div>

      <div className="admin-product-layout">
        <div className="admin-product-form-card">
          <div className="admin-card-heading">
            <h2>{editingId ? "Edit Product" : "Add Product"}</h2>

            {editingId && (
              <button
                type="button"
                className="cancel-edit-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />

            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="4"
            />

            <div className="admin-form-row">
              <div>
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label>Category</label>
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="admin-form-row">
              <div>
                <label>Initial Quantity</label>
                <input
                  type="number"
                  name="initialQuantity"
                  value={form.initialQuantity}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div>
                <label>Reorder Level</label>
                <input
                  type="number"
                  name="reorderLevel"
                  value={form.reorderLevel}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
            </div>

            {error && <p className="admin-error">{error}</p>}

            {message && <p className="admin-success">{message}</p>}

            <button
              type="submit"
              className="admin-submit-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Product"
                  : "Create Product"}
            </button>
          </form>
        </div>

        <div className="admin-products-card">
          <div className="admin-card-heading">
            <div>
              <h2>Product Catalog</h2>
              <p>{products.length} products</p>
            </div>
          </div>

          {loading ? (
            <p className="admin-loading">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="admin-empty">No products found.</p>
          ) : (
            <div className="admin-products-table-wrapper">
              <table className="admin-products-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="admin-product-name">
                          <div className="admin-product-image">Product</div>

                          <div>
                            <strong>{product.name}</strong>
                            <span>SKU: {product.sku || "N/A"}</span>
                          </div>
                        </div>
                      </td>

                      <td>{product.categoryName || "—"}</td>

                      <td>₹{product.price}</td>

                      <td>
                        <span
                          className={
                            product.availableQuantity <= product.reorderLevel
                              ? "stock-low"
                              : "stock-good"
                          }
                        >
                          {product.availableQuantity}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            product.isActive
                              ? "product-active"
                              : "product-inactive"
                          }
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td>
                        <div className="admin-table-actions">
                          <button
                            className="edit-product-button"
                            onClick={() => handleEdit(product)}
                          >
                            Edit
                          </button>

                          <button
                            className="delete-product-button"
                            onClick={() => handleDelete(product.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;
