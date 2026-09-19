import { useEffect, useState } from "react";
import {
  getCart,
  updateCartItem,
  removeCartItem,
} from "../services/cartService";

function Cart() {
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
      alert("Unable to update cart.");
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
    return <h2>Loading cart...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div>
      <h1>Your Cart</h1>

      {!cart || cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.items.map((item) => (
            <div key={item.id}>
              <h3>{item.productName}</h3>

              <p>Price: ₹{item.unitPrice}</p>

              <p>Quantity: {item.quantity}</p>

              <p>Subtotal: ₹{item.subTotal}</p>

              <button
                onClick={() =>
                  handleUpdate(item.id, item.quantity + 1)
                }
              >
                +
              </button>

              <button
                onClick={() => {
                  if (item.quantity > 1) {
                    handleUpdate(item.id, item.quantity - 1);
                  }
                }}
              >
                -
              </button>

              <button onClick={() => handleRemove(item.id)}>
                Remove
              </button>
            </div>
          ))}

          <h2>Total: ₹{cart.totalAmount}</h2>
        </div>
      )}
    </div>
  );
}

export default Cart;