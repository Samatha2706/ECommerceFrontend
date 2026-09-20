import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkout } from "../services/orderService";

function Checkout() {
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!shippingAddress.trim()) {
      setError("Please enter your shipping address.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const order = await checkout(shippingAddress);

      console.log("Order created:", order);

      navigate(`/payment/${order.id}`);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to place your order. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <p>Complete your order securely.</p>
      </div>

      <div className="checkout-layout">
        <div className="checkout-form-card">
          <h2>Shipping Information</h2>

          <form onSubmit={handleCheckout}>
            <label htmlFor="shippingAddress">Shipping Address</label>

            <textarea
              id="shippingAddress"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Enter your complete shipping address"
              rows="6"
              maxLength="250"
            />

            <p className="address-hint">
              Please include your house number, street, city, state and PIN
              code.
            </p>

            {error && <p className="checkout-error">{error}</p>}

            <button
              type="submit"
              className="place-order-button"
              disabled={loading}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </div>

        <div className="checkout-summary">
          <h2>Order Summary</h2>

          <div className="checkout-summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <div className="checkout-summary-total">
            <span>Total</span>
            <strong>Calculated at checkout</strong>
          </div>

          <p className="checkout-note">
            Your order will be created and you will be redirected to the secure
            payment page.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
