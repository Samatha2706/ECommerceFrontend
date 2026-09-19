import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import {
  getInventoryByProductId,
  updateInventory,
  getLowStock,
} from "../../services/inventoryService";

function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);

  const [selectedProductId, setSelectedProductId] = useState("");

  const [quantity, setQuantity] = useState("");
  const [reorderLevel, setReorderLevel] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setError("");

      const productData = await getProducts({
        pageNumber: 1,
        pageSize: 100,
      });

      setProducts(productData.products);

      const lowStockData = await getLowStock();
      setLowStockItems(lowStockData);
    } catch (err) {
      console.error(err);
      setError("Unable to load inventory data.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleProductChange = async (e) => {
    const productId = e.target.value;

    setSelectedProductId(productId);
    setMessage("");
    setError("");

    if (!productId) {
      setQuantity("");
      setReorderLevel("");
      return;
    }

    try {
      const data = await getInventoryByProductId(productId);

      setQuantity(data.quantity);
      setReorderLevel(data.reorderLevel);

      setInventory(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load product inventory.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!selectedProductId) {
      setError("Please select a product.");
      return;
    }

    try {
      setMessage("");
      setError("");

      const data = await updateInventory(
        selectedProductId,
        {
          quantity: Number(quantity),
          reorderLevel: Number(reorderLevel),
        }
      );

      setInventory(data);

      setMessage("Inventory updated successfully.");

      const lowStockData = await getLowStock();
      setLowStockItems(lowStockData);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to update inventory."
      );
    }
  };

  return (
    <div>
      <h1>Admin - Inventory</h1>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <h2>Update Inventory</h2>

      <div>
        <label>Select Product</label>

        <select
          value={selectedProductId}
          onChange={handleProductChange}
        >
          <option value="">Select Product</option>

          {products.map((product) => (
            <option
              key={product.id}
              value={product.id}
            >
              {product.name}
            </option>
          ))}
        </select>
      </div>

      {inventory && selectedProductId && (
        <form onSubmit={handleUpdate}>
          <div>
            <label>Quantity</label>

            <input
              type="number"
              min="0"
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value)
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

          <button type="submit">
            Update Inventory
          </button>
        </form>
      )}

      <hr />

      <h2>Low Stock Products</h2>

      {lowStockItems.length === 0 ? (
        <p>No low-stock products.</p>
      ) : (
        <div>
          {lowStockItems.map((item) => (
            <div key={item.productId}>
              <h3>{item.productName}</h3>

              <p>
                Quantity: {item.quantity}
              </p>

              <p>
                Reorder Level: {item.reorderLevel}
              </p>

              <p>
                Status: Low Stock
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminInventory;