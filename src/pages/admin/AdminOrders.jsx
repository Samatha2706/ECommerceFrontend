import { useEffect, useState } from "react";
import {
  getAllOrders,
  getOrderForAdmin,
  updateOrderStatus,
} from "../../services/adminOrderService";

const statusMap = {
  1: "Pending",
  2: "Paid",
  3: "Processing",
  4: "Shipped",
  5: "Delivered",
  6: "Cancelled",
};

const statusClassMap = {
  1: "status-pending",
  2: "status-paid",
  3: "status-processing",
  4: "status-shipped",
  5: "status-delivered",
  6: "status-cancelled",
};

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleViewOrder = async (orderId) => {
    try {
      setDetailsLoading(true);
      setError("");
      setMessage("");

      const data = await getOrderForAdmin(orderId);

      setSelectedOrder(data);
      setSelectedStatus(String(data.status));
    } catch (err) {
      console.error(err);
      setError("Unable to load order details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    try {
      setUpdating(true);
      setMessage("");
      setError("");

      const updatedOrder = await updateOrderStatus(
        selectedOrder.id,
        selectedStatus,
      );

      setSelectedOrder(updatedOrder);
      setSelectedStatus(String(updatedOrder.status));

      setMessage("Order status updated successfully.");

      await loadOrders();
    } catch (err) {
      console.error(err);

      setError(err.response?.data?.message || "Unable to update order status.");
    } finally {
      setUpdating(false);
    }
  };

  const closeDetails = () => {
    setSelectedOrder(null);
    setMessage("");
    setError("");
  };

  return (
    <div className="admin-orders-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">ADMIN PANEL</p>
          <h1>Order Management</h1>
          <p>Monitor customer orders and manage their delivery status.</p>
        </div>

        <div className="admin-order-count">
          <span>{orders.length}</span>
          <small>Total Orders</small>
        </div>
      </div>

      {message && (
        <div className="admin-success admin-orders-message">{message}</div>
      )}

      {error && <div className="admin-error admin-orders-message">{error}</div>}

      <div className="admin-orders-card">
        <div className="admin-card-heading">
          <div>
            <h2>All Orders</h2>
            <p>Review and manage customer orders.</p>
          </div>
        </div>

        {loading ? (
          <div className="admin-orders-loading">
            <div className="orders-spinner"></div>
            <p>Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="admin-orders-empty">
            <div className="admin-orders-empty-icon">🛍️</div>
            <h3>No orders found</h3>
            <p>Customer orders will appear here once they are placed.</p>
          </div>
        ) : (
          <div className="admin-orders-table-wrapper">
            <table className="admin-orders-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>#{order.id}</strong>
                    </td>

                    <td>
                      <span className="customer-id">
                        Customer #{order.userId}
                      </span>
                    </td>

                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>

                    <td>
                      <strong>
                        ₹{Number(order.totalAmount).toLocaleString()}
                      </strong>
                    </td>

                    <td>
                      <span
                        className={`admin-status-badge ${
                          statusClassMap[order.status] || "status-pending"
                        }`}
                      >
                        {statusMap[order.status] || order.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="admin-view-order-button"
                        onClick={() => handleViewOrder(order.id)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="admin-order-details-card">
          <div className="admin-order-details-header">
            <div>
              <p className="admin-eyebrow">ORDER DETAILS</p>

              <h2>Order #{selectedOrder.id}</h2>

              <span
                className={`admin-status-badge ${
                  statusClassMap[selectedOrder.status] || "status-pending"
                }`}
              >
                {statusMap[selectedOrder.status] || selectedOrder.status}
              </span>
            </div>

            <button className="admin-close-button" onClick={closeDetails}>
              ✕
            </button>
          </div>

          {detailsLoading ? (
            <div className="admin-orders-loading">
              <div className="orders-spinner"></div>
              <p>Loading order details...</p>
            </div>
          ) : (
            <>
              <div className="admin-order-summary-grid">
                <div>
                  <span>Customer</span>
                  <strong>Customer #{selectedOrder.userId}</strong>
                </div>

                <div>
                  <span>Order Date</span>
                  <strong>
                    {new Date(selectedOrder.orderDate).toLocaleString()}
                  </strong>
                </div>

                <div>
                  <span>Total Amount</span>
                  <strong>
                    ₹{Number(selectedOrder.totalAmount).toLocaleString()}
                  </strong>
                </div>

                <div>
                  <span>Shipping Address</span>
                  <strong>{selectedOrder.shippingAddress}</strong>
                </div>
              </div>

              <div className="admin-order-items-section">
                <h3>Order Items</h3>

                <div className="admin-order-items">
                  {selectedOrder.items?.map((item) => (
                    <div className="admin-order-item" key={item.id}>
                      <div className="admin-order-item-icon">📦</div>

                      <div className="admin-order-item-info">
                        <h4>{item.productName}</h4>
                        <p>Quantity: {item.quantity}</p>
                      </div>

                      <div className="admin-order-item-price">
                        <span>Unit Price</span>
                        <strong>
                          ₹{Number(item.unitPrice).toLocaleString()}
                        </strong>
                      </div>

                      <div className="admin-order-item-price">
                        <span>Subtotal</span>
                        <strong>
                          ₹{Number(item.subTotal).toLocaleString()}
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="admin-status-update-section">
                <div>
                  <h3>Update Order Status</h3>
                  <p>Change the current status of this order.</p>
                </div>

                <div className="admin-status-update-controls">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="1">Pending</option>
                    <option value="2">Paid</option>
                    <option value="3">Processing</option>
                    <option value="4">Shipped</option>
                    <option value="5">Delivered</option>
                    <option value="6">Cancelled</option>
                  </select>

                  <button
                    className="admin-update-status-button"
                    onClick={handleUpdateStatus}
                    disabled={updating}
                  >
                    {updating ? "Updating..." : "Update Status"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
