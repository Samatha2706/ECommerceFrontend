import { useEffect, useState } from "react";
import {
  getProducts,
  getProductById,
} from "../../services/productService";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/adminProductService";
import { getCategories } from "../../services/categoryService";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [initialQuantity, setInitialQuantity] = useState("");
  const [reorderLevel, setReorderLevel] = useState(5);
  const [isActive, setIsActive] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const productData = await getProducts({
        pageNumber: 1,
        pageSize: 100,
      });

      const categoryData = await getCategories();

      setProducts(productData.products);
      setCategories(categoryData);
    } catch (err) {
      console.error(err);
      setError("Unable to load admin data.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const clearForm = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setPrice("");
    setCategoryId("");
    setInitialQuantity("");
    setReorderLevel(5);
    setIsActive(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      if (editingId) {
        await updateProduct(editingId, {
          name,
          description,
          price: Number(price),
          categoryId: Number(categoryId),
          isActive,
        });

        setMessage("Product updated successfully.");
      } else {
        await createProduct({
          name,
          description,
          price: Number(price),
          categoryId: Number(categoryId),
          initialQuantity: Number(initialQuantity),
          reorderLevel: Number(reorderLevel),
        });

        setMessage("Product created successfully.");
      }

      clearForm();
      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        "Unable to save product."
      );
    }
  };

  const handleEdit = async (id) => {
    try {
      const product = await getProductById(id);

      setEditingId(product.id);
      setName(product.name);
      setDescription(product.description || "");
      setPrice(product.price);
      setCategoryId(product.categoryId);
      setIsActive(product.isActive);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error(err);
      setError("Unable to load product.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(id);

      setMessage("Product deleted successfully.");

      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        "Unable to delete product."
      );
    }
  };

  return (
    <div>
      <h1>Admin - Products</h1>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <h2>
        {editingId ? "Edit Product" : "Add Product"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={150}
            required
          />
        </div>

        <div>
          <label>Description</label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
          />
        </div>

        <div>
          <label>Price</label>

          <input
            type="number"
            step="0.01"
            min="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Category</label>

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select Category</option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {!editingId && (
          <>
            <div>
              <label>Initial Quantity</label>

              <input
                type="number"
                min="0"
                value={initialQuantity}
                onChange={(e) =>
                  setInitialQuantity(e.target.value)
                }
                required
              />
            </div>

            <div>
              <label>Reorder Level</label>

              <input
                type="number"
                min="0"
                value={reorderLevel}
                onChange={(e) =>
                  setReorderLevel(e.target.value)
                }
                required
              />
            </div>
          </>
        )}

        {editingId && (
          <div>
            <label>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) =>
                  setIsActive(e.target.checked)
                }
              />

              Active
            </label>
          </div>
        )}

        <button type="submit">
          {editingId ? "Update Product" : "Create Product"}
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

      <h2>Products</h2>

      {products.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>

          <p>SKU: {product.sku}</p>

          <p>Price: ₹{product.price}</p>

          <p>Category: {product.categoryName}</p>

          <p>
            Available: {product.availableQuantity}
          </p>

          <p>
            Status: {product.isActive ? "Active" : "Inactive"}
          </p>

          <button
            onClick={() => handleEdit(product.id)}
          >
            Edit
          </button>

          <button
            onClick={() => handleDelete(product.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminProducts;