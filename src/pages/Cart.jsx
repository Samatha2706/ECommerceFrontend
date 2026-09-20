import { useEffect, useState } from "react";
import {
  getCart,
  updateCartItem,
  removeCartItem,
} from "../services/cartService";
import { useNavigate, Link } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCart = async () => {
    try {
      const data = await getCart();
      setCart(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleUpdate = async (cartItemId, quantity) => {
    try {
      const data = await updateCartItem(cartItemId, quantity);
      setCart(data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Unable to update cart.");
    }
  };

  const handleRemove = async (cartItemId) => {
    try {
      const data = await removeCartItem(cartItemId);
      setCart(data);
    } catch (err) {
      console.error(err);
      alert("Unable to remove item.");
    }
  };

  if (loading) {
    return <h2 className="page-message">Loading cart...</h2>;
  }

  if (error) {
    return <h2 className="page-message error-message">{error}</h2>;
  }

  const isEmpty = !cart || cart.items.length === 0;

  if (isEmpty) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon">🛒</div>

        <h1>Your Cart is Empty</h1>

        <p>Looks like you haven't added anything to your cart yet.</p>

        <Link to="/products" className="shop-button">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <p>
          {cart.items.length} {cart.items.length === 1 ? "item" : "items"} in
          your cart
        </p>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.items.map((item) => (
            <div className="cart-item" key={item.cartItemId}>
              <div className="cart-item-image">
                <span>Product</span>
              </div>

              <div className="cart-item-info">
                <h2>{item.productName}</h2>

                <p className="cart-item-price">₹{item.unitPrice}</p>

                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button
                      disabled={item.quantity <= 1}
                      onClick={() =>
                        handleUpdate(item.cartItemId, item.quantity - 1)
                      }
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        handleUpdate(item.cartItemId, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove-button"
                    onClick={() => handleRemove(item.cartItemId)}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="cart-item-subtotal">
                <span>Subtotal</span>
                <strong>₹{item.subtotal}</strong>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Items</span>
            <span>{cart.items.length}</span>
          </div>

          <div className="summary-row total-row">
            <span>Total</span>
            <strong>₹{cart.totalAmount}</strong>
          </div>

          <button
            className="checkout-button"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>

          <Link to="/products" className="continue-shopping">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
