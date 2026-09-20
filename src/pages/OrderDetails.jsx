import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "../services/orderService";
import OrderTracking from "../components/OrderTracking";
import { getPaymentByOrderId } from "../services/paymentService";
import {
  startSignalRConnection,
  stopSignalRConnection,
} from "../services/signalService";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrderAndConnect = async () => {
      await loadOrder();

      await startSignalRConnection((data) => {
        if (Number(data.orderId) === Number(id)) {
          setOrder((currentOrder) => ({
            ...currentOrder,
            status: data.status,
          }));
        }
      });
    };

    loadOrderAndConnect();

    return () => {
      stopSignalRConnection();
    };
  }, [id]);

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

  if (loading) {
    return (
      <div className="page-message">
        <h2>Loading order details...</h2>
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

  if (!order) {
    return (
      <div className="page-message">
        <h2>Order not found.</h2>
      </div>
    );
  }

  return (
    <div className="order-details-page">
      <button className="back-link-button" onClick={() => navigate("/orders")}>
        ← Back to Orders
      </button>

      <div className="order-details-header">
        <div>
          <p className="order-label">Order</p>
          <h1>#{order.id}</h1>
          <p>Placed on {new Date(order.createdAt).toLocaleString()}</p>
        </div>

        <span className="order-details-status">
          {getStatusLabel(order.status)}
        </span>
      </div>

      <div className="order-details-grid">
        <div className="order-details-main">
          <div className="order-section">
            <OrderTracking status={order.status} />
          </div>

          <div className="order-section">
            <h2>Items in Your Order</h2>

            <div className="order-items-list">
              {order.items?.map((item) => (
                <div className="order-detail-item" key={item.productId}>
                  <div className="order-item-image">Product</div>

                  <div className="order-item-info">
                    <h3>{item.productName}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <p>Unit Price: ₹{item.unitPrice}</p>
                  </div>

                  <strong>₹{item.subtotal}</strong>
                </div>
              ))}
            </div>
          </div>

          {payment && (
            <div className="order-section">
              <h2>Payment Details</h2>

              <div className="payment-details-grid">
                <div>
                  <span>Payment Method</span>
                  <strong>{payment.paymentMethod}</strong>
                </div>

                <div>
                  <span>Payment Status</span>
                  <strong>{payment.status}</strong>
                </div>

                <div>
                  <span>Amount Paid</span>
                  <strong>₹{payment.amount}</strong>
                </div>

                <div>
                  <span>Transaction ID</span>
                  <strong>{payment.transactionReference}</strong>
                </div>

                <div>
                  <span>Payment Date</span>
                  <strong>
                    {new Date(payment.paymentDate).toLocaleString()}
                  </strong>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="order-details-sidebar">
          {order.status === 1 && (
            <div className="pay-order-card">
              <h2>Payment Pending</h2>
              <p>Complete your payment to confirm this order.</p>

              <button
                className="pay-order-button"
                onClick={() => navigate(`/payment/${order.id}`)}
              >
                Pay ₹{order.totalAmount}
              </button>
            </div>
          )}

          <div className="order-summary-card">
            <h2>Order Summary</h2>

            <div className="order-summary-row">
              <span>Items</span>
              <span>{order.items?.length || 0}</span>
            </div>

            <div className="order-summary-row total">
              <span>Total</span>
              <strong>₹{order.totalAmount}</strong>
            </div>
          </div>

          <div className="shipping-card">
            <h2>Shipping Address</h2>
            <p>{order.shippingAddress}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
