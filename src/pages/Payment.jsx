import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "../services/orderService";
import { processPayment } from "../services/paymentService";

function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await getOrderById(orderId);

        if (data.status !== 1 && data.status !== "Pending") {
          navigate(`/orders/${orderId}`);
          return;
        }

        setOrder(data);
        setStatus("idle");
      } catch (err) {
        console.error(err);
        setError("Unable to load order.");
        setStatus("failed");
      }
    };

    loadOrder();
  }, [orderId, navigate]);

  const handlePayment = async () => {
    try {
      setStatus("processing");
      setError("");

      const result = await processPayment(orderId, paymentMethod);

      setPayment(result);
      setStatus("success");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "We couldn't process your payment. Please try again.",
      );

      setStatus("failed");
    }
  };

  if (status === "loading") {
    return (
      <div className="payment-message">
        <div className="payment-spinner"></div>
        <h2>Loading payment...</h2>
      </div>
    );
  }

  if (status === "processing") {
    return (
      <div className="payment-message">
        <div className="payment-spinner"></div>

        <h1>Processing Payment</h1>

        <p>Please wait while we securely confirm your payment.</p>

        <p className="payment-warning">Do not close or refresh this page.</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="payment-success-page">
        <div className="success-icon">✓</div>

        <h1>Payment Successful</h1>

        <p className="success-message">
          Your payment has been successfully processed.
        </p>

        <div className="payment-confirmation">
          <div>
            <span>Order</span>
            <strong>#{payment.orderId}</strong>
          </div>

          <div>
            <span>Amount Paid</span>
            <strong>₹{payment.amount}</strong>
          </div>

          <div>
            <span>Payment Method</span>
            <strong>{payment.paymentMethod}</strong>
          </div>

          <div>
            <span>Transaction ID</span>
            <strong>{payment.transactionReference}</strong>
          </div>

          <div>
            <span>Payment Date</span>
            <strong>{new Date(payment.paymentDate).toLocaleString()}</strong>
          </div>
        </div>

        <button
          className="view-order-button"
          onClick={() => navigate(`/orders/${orderId}`)}
        >
          View Order
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="payment-message">
        <h2>{error || "Order not found."}</h2>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-header">
        <h1>Complete Your Payment</h1>
        <p>Order #{order.id}</p>
      </div>

      <div className="payment-layout">
        <div className="payment-method-card">
          <h2>Payment Method</h2>

          <label
            className={`payment-option ${
              paymentMethod === "UPI" ? "selected" : ""
            }`}
          >
            <input
              type="radio"
              value="UPI"
              checked={paymentMethod === "UPI"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />

            <div>
              <strong>UPI</strong>
              <span>Google Pay, PhonePe, Paytm and more</span>
            </div>
          </label>

          <label
            className={`payment-option ${
              paymentMethod === "Credit/Debit Card" ? "selected" : ""
            }`}
          >
            <input
              type="radio"
              value="Credit/Debit Card"
              checked={paymentMethod === "Credit/Debit Card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />

            <div>
              <strong>Credit / Debit Card</strong>
              <span>Visa, Mastercard and other cards</span>
            </div>
          </label>

          <label
            className={`payment-option ${
              paymentMethod === "Net Banking" ? "selected" : ""
            }`}
          >
            <input
              type="radio"
              value="Net Banking"
              checked={paymentMethod === "Net Banking"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />

            <div>
              <strong>Net Banking</strong>
              <span>Pay securely through your bank</span>
            </div>
          </label>

          <label
            className={`payment-option ${
              paymentMethod === "Cash on Delivery" ? "selected" : ""
            }`}
          >
            <input
              type="radio"
              value="Cash on Delivery"
              checked={paymentMethod === "Cash on Delivery"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />

            <div>
              <strong>Cash on Delivery</strong>
              <span>Pay when your order arrives</span>
            </div>
          </label>

          {error && <p className="payment-error">{error}</p>}
        </div>

        <div className="payment-summary">
          <h2>Order Summary</h2>

          <div className="payment-summary-row">
            <span>Order</span>
            <span>#{order.id}</span>
          </div>

          <div className="payment-summary-row">
            <span>Items</span>
            <span>{order.items?.length || 0}</span>
          </div>

          <div className="payment-total">
            <span>Amount Payable</span>
            <strong>₹{order.totalAmount}</strong>
          </div>

          <button className="pay-button" onClick={handlePayment}>
            Pay ₹{order.totalAmount}
          </button>

          <p className="secure-payment-note">
            🔒 Your payment is securely processed.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Payment;
