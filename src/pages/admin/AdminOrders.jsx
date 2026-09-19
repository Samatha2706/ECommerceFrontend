import { useEffect, useState } from "react";
import {
  getAllOrders,
  getOrderForAdmin,
  updateOrderStatus,
} from "../../services/adminOrderService";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      setError("");

      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load orders.");
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleViewOrder = async (orderId) => {
    try {
      setError("");

      const data = await getOrderForAdmin(orderId);

      setSelectedOrder(data);
      setSelectedStatus(data.status);
    } catch (err) {
      console.error(err);
      setError("Unable to load order details.");
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    try {
      setMessage("");
      setError("");

      const updatedOrder = await updateOrderStatus(
        selectedOrder.id,
        selectedStatus
      );

      setSelectedOrder(updatedOrder);

      setMessage("Order status updated successfully.");

      await loadOrders();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to update order status."
      );
    }
  };

  return (
    <div>
      <h1>Admin - Orders</h1>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <h2>All Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div>
          {orders.map((order) => (
            <div key={order.id}>
              <h3>Order #{order.id}</h3>

              <p>
                Customer ID: {order.userId}
              </p>

              <p>
                Date:{" "}
                {new Date(
                  order.orderDate
                ).toLocaleString()}
              </p>

              <p>
                Total: ₹{order.totalAmount}
              </p>

              <p>
                Status: {order.status}
              </p>

              <button
                onClick={() =>
                  handleViewOrder(order.id)
                }
              >
                View Details
              </button>

              <hr />
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <div>
          <h2>
            Order #{selectedOrder.id}
          </h2>

          <p>
            Shipping Address:{" "}
            {selectedOrder.shippingAddress}
          </p>

          <p>
            Total: ₹{selectedOrder.totalAmount}
          </p>

          <h3>Items</h3>

          {selectedOrder.items?.map((item) => (
            <div key={item.id}>
              <p>
                Product: {item.productName}
              </p>

              <p>
                Quantity: {item.quantity}
              </p>

              <p>
                Unit Price: ₹{item.unitPrice}
              </p>

              <p>
                Subtotal: ₹{item.subTotal}
              </p>
            </div>
          ))}

          <h3>Update Status</h3>

          <select
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(e.target.value)
            }
          >
            <option value="1">Pending</option>
            <option value="2">Paid</option>
            <option value="3">Processing</option>
            <option value="4">Shipped</option>
            <option value="5">Delivered</option>
            <option value="6">Cancelled</option>
          </select>

          <button onClick={handleUpdateStatus}>
            Update Status
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;