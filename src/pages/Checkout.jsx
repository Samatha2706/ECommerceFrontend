import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkout } from "../services/orderService";

function Checkout() {
  const [shippingAddress, setShippingAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleCheckout = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const order = await checkout(shippingAddress);

      console.log("Order created:", order);

      navigate(`/orders/${order.id}`);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        "Unable to place order."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Checkout</h1>

      <form onSubmit={handleCheckout}>
        <div>
          <label>Shipping Address</label>

          <textarea
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            maxLength={250}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>

      {error && <p>{error}</p>}
    </div>
  );
}

export default Checkout;