import { useEffect, useState } from "react";
import { getCategories } from "../../services/categoryService";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/adminCategoryService";

function AdminCategories() {
  const [categories, setCategories] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load categories.");
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const clearForm = () => {
    setEditingId(null);
    setName("");
    setDescription("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      if (editingId) {
        await updateCategory(editingId, {
          name,
          description,
        });

        setMessage("Category updated successfully.");
      } else {
        await createCategory({
          name,
          description,
        });

        setMessage("Category created successfully.");
      }

      clearForm();
      await loadCategories();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to save category."
      );
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setName(category.name);
    setDescription(category.description || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    try {
      setMessage("");
      setError("");

      await deleteCategory(id);

      setMessage("Category deleted successfully.");

      await loadCategories();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to delete category."
      );
    }
  };

  return (
    <div>
      <h1>Admin - Categories</h1>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <h2>
        {editingId ? "Edit Category" : "Add Category"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            required
          />
        </div>

        <div>
          <label>Description</label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={300}
          />
        </div>

        <button type="submit">
          {editingId
            ? "Update Category"
            : "Create Category"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={clearForm}
          >
            Cancel Edit
          </button>
        )}
      </form>

      <hr />

      <h2>Categories</h2>

      {categories.map((category) => (
        <div key={category.id}>
          <h3>{category.name}</h3>

          <p>
            {category.description || "No description"}
          </p>

          <button
            onClick={() => handleEdit(category)}
          >
            Edit
          </button>

          <button
            onClick={() => handleDelete(category.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminCategories;