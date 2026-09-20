import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);

      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
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

      if (editingId) {
        await updateCategory(editingId, form);
        setMessage("Category updated successfully.");
      } else {
        await createCategory(form);
        setMessage("Category created successfully.");
      }

      resetForm();
      await loadCategories();
    } catch (err) {
      console.error(err);

      setError(err.response?.data?.message || "Unable to save category.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);

    setForm({
      name: category.name || "",
      description: category.description || "",
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
      "Are you sure you want to delete this category?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await deleteCategory(id);

      setMessage("Category deleted successfully.");

      await loadCategories();
    } catch (err) {
      console.error(err);

      setError(err.response?.data?.message || "Unable to delete category.");
    }
  };

  return (
    <div className="admin-categories-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">ADMIN PANEL</p>
          <h1>Categories</h1>
          <p>Organize your products into manageable categories.</p>
        </div>
      </div>

      <div className="admin-category-layout">
        <div className="admin-category-form-card">
          <div className="admin-card-heading">
            <h2>{editingId ? "Edit Category" : "Add Category"}</h2>

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
            <label>Category Name</label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter category name"
              maxLength="100"
              required
            />

            <label>Description</label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter category description"
              rows="5"
              maxLength="300"
            />

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
                  ? "Update Category"
                  : "Create Category"}
            </button>
          </form>
        </div>

        <div className="admin-category-list-card">
          <div className="admin-card-heading">
            <div>
              <h2>Category List</h2>
              <p>{categories.length} categories</p>
            </div>
          </div>

          {loading ? (
            <p className="admin-loading">Loading categories...</p>
          ) : categories.length === 0 ? (
            <p className="admin-empty">No categories found.</p>
          ) : (
            <div className="category-list">
              {categories.map((category) => (
                <div className="category-admin-item" key={category.id}>
                  <div className="category-admin-icon">📁</div>

                  <div className="category-admin-info">
                    <h3>{category.name}</h3>

                    <p>{category.description || "No description provided."}</p>
                  </div>

                  <div className="category-admin-actions">
                    <button
                      className="edit-product-button"
                      onClick={() => handleEdit(category)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-product-button"
                      onClick={() => handleDelete(category.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminCategories;
