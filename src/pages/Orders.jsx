import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyOrders } from "../services/orderService";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const getStatusLabel = (status) => {
    const statusMap = {
      1: "Pending",
      2: "Paid",
      3: "Processing",
      4: "Shipped",
      5: "Delivered",
      6: "Cancelled",
    };

    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    const statusMap = {
      1: "status-pending",
      2: "status-paid",
      3: "status-processing",
      4: "status-shipped",
      5: "status-delivered",
      6: "status-cancelled",
    };

    return statusMap[status] || "";
  };

  if (loading) {
    return (
      <div className="page-message">
        <h2>Loading your orders...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-message error-message">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div>
          <h1>My Orders</h1>
          <p>View and track your recent purchases.</p>
        </div>

        <Link to="/products" className="continue-shopping">
          Continue Shopping
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-orders-icon">📦</div>
          <h2>No orders yet</h2>
          <p>
            You haven't placed any orders yet. Start shopping to see your orders
            here.
          </p>

          <Link to="/products" className="shop-button">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-card-header">
                <div>
                  <span className="order-label">Order</span>
                  <h2>#{order.id}</h2>
                </div>

                <span
                  className={`order-status ${getStatusClass(order.status)}`}
                >
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div className="order-card-details">
                <div>
                  <span>Order Date</span>
                  <strong>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </strong>
                </div>

                <div>
                  <span>Total Amount</span>
                  <strong>₹{order.totalAmount}</strong>
                </div>

                <div>
                  <span>Items</span>
                  <strong>{order.items?.length || 0}</strong>
                </div>
              </div>

              <div className="order-card-footer">
                {order.status === 1 && (
                  <button
                    className="pay-now-button"
                    onClick={() => navigate(`/payment/${order.id}`)}
                  >
                    Pay Now
                  </button>
                )}

                <Link to={`/orders/${order.id}`} className="view-order-button">
                  View Order
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
