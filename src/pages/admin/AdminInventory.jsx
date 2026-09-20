import { useEffect, useState } from "react";
import {
  getInventoryByProductId,
  updateInventory,
  getLowStock,
} from "../../services/inventoryService";

function AdminInventory() {
  const [productId, setProductId] = useState("");
  const [inventory, setInventory] = useState(null);
  const [lowStockItems, setLowStockItems] = useState([]);

  const [quantity, setQuantity] = useState("");
  const [reorderLevel, setReorderLevel] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadInventory = async () => {
    if (!productId) {
      setError("Please enter a product ID.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const data = await getInventoryByProductId(productId);

      setInventory(data);
      setQuantity(data.quantity ?? "");
      setReorderLevel(data.reorderLevel ?? "");
    } catch (err) {
      console.error(err);
      setInventory(null);
      setError(
        err.response?.data?.message ||
          "Unable to load inventory for this product.",
      );
    } finally {
      setLoading(false);
    }
  };

  const loadLowStock = async () => {
    try {
      const data = await getLowStock();
      setLowStockItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadLowStock();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!inventory) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const updated = await updateInventory(productId, {
        quantity: Number(quantity),
        reorderLevel: Number(reorderLevel),
      });

      setInventory(updated);
      setMessage("Inventory updated successfully.");

      await loadLowStock();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Unable to update inventory.");
    } finally {
      setSaving(false);
    }
  };

  const getStockStatus = (item) => {
    if (item.quantity <= item.reorderLevel) {
      return "Low Stock";
    }

    return "In Stock";
  };

  return (
    <div className="admin-inventory-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">ADMIN PANEL</p>
          <h1>Inventory Management</h1>
          <p>Monitor product stock levels and update inventory details.</p>
        </div>
      </div>

      <div className="inventory-layout">
        {/* Update Inventory */}
        <div className="inventory-form-card">
          <div className="admin-card-heading">
            <div>
              <h2>Update Inventory</h2>
              <p>Enter a product ID to manage its stock.</p>
            </div>
          </div>

          <div className="inventory-search">
            <label>Product ID</label>

            <div className="inventory-search-row">
              <input
                type="number"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                placeholder="e.g. 1"
                min="1"
              />

              <button
                type="button"
                className="admin-primary-button"
                onClick={loadInventory}
                disabled={loading}
              >
                {loading ? "Loading..." : "Load"}
              </button>
            </div>
          </div>

          {inventory && (
            <form className="inventory-update-form" onSubmit={handleUpdate}>
              <div className="inventory-product-info">
                <span>Product ID</span>
                <strong>{productId}</strong>
              </div>

              <label>Available Quantity</label>
              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />

              <label>Reorder Level</label>
              <input
                type="number"
                min="0"
                value={reorderLevel}
                onChange={(e) => setReorderLevel(e.target.value)}
                required
              />

              {error && <p className="admin-error">{error}</p>}
              {message && <p className="admin-success">{message}</p>}

              <button
                type="submit"
                className="admin-submit-button"
                disabled={saving}
              >
                {saving ? "Updating..." : "Update Inventory"}
              </button>
            </form>
          )}

          {!inventory && !loading && (
            <div className="inventory-empty-state">
              <div className="inventory-empty-icon">📦</div>
              <h3>No inventory selected</h3>
              <p>Enter a product ID above to view and update its inventory.</p>
            </div>
          )}

          {error && !inventory && (
            <p className="admin-error inventory-main-error">{error}</p>
          )}
        </div>

        {/* Low Stock */}
        <div className="inventory-low-stock-card">
          <div className="admin-card-heading">
            <div>
              <h2>Low Stock</h2>
              <p>Products that need inventory attention.</p>
            </div>

            <span className="inventory-count-badge">
              {lowStockItems.length}
            </span>
          </div>

          {lowStockItems.length === 0 ? (
            <div className="inventory-no-low-stock">
              <div className="inventory-success-icon">✓</div>
              <h3>Stock levels look good</h3>
              <p>No products are currently below their reorder level.</p>
            </div>
          ) : (
            <div className="low-stock-list">
              {lowStockItems.map((item) => (
                <div className="low-stock-item" key={item.productId || item.id}>
                  <div className="low-stock-icon">⚠</div>

                  <div className="low-stock-info">
                    <h3>
                      {item.productName ||
                        item.name ||
                        `Product #${item.productId}`}
                    </h3>

                    <p>Product ID: {item.productId || item.id}</p>
                  </div>

                  <div className="low-stock-values">
                    <span className="stock-label">Current</span>
                    <strong>{item.quantity}</strong>

                    <span className="stock-label">Reorder at</span>
                    <strong>{item.reorderLevel}</strong>
                  </div>

                  <span className="low-stock-status">
                    {getStockStatus(item)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminInventory;
