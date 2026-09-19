import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../services/orderService";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load order details.");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  if (loading) {
    return <h2>Loading order...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  if (!order) {
    return <h2>Order not found.</h2>;
  }

  return (
    <div>
      <h1>Order #{order.id}</h1>

      <p>Order Date: {new Date(order.orderDate).toLocaleString()}</p>

      <p>Shipping Address: {order.shippingAddress}</p>

      <p>Status: {order.status}</p>

      <p>Total: ₹{order.totalAmount}</p>

      <h2>Items</h2>

      {order.items?.map((item) => (
        <div key={item.id}>
          <h3>{item.productName}</h3>
          <p>Quantity: {item.quantity}</p>
          <p>Unit Price: ₹{item.unitPrice}</p>
          <p>Subtotal: ₹{item.subTotal}</p>
        </div>
      ))}
    </div>
  );
}

export default OrderDetails;