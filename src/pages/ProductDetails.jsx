import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { addToCart } from "../services/cartService";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load product.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const updatedCart = await addToCart(product.id, 1);

      console.log("Cart updated:", updatedCart);
      setMessage("Product added to cart!");
    } catch (err) {
      console.error(err);
      setMessage("Unable to add product to cart.");
    }
  };

  if (loading) {
    return <h2>Loading product...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  if (!product) {
    return <h2>Product not found.</h2>;
  }

  return (
    <div>
      <h1>{product.name}</h1>

      <p>{product.description}</p>

      <p>Price: ₹{product.price}</p>

      <p>Category: {product.categoryName}</p>

      <p>Available: {product.availableQuantity}</p>

      <button onClick={handleAddToCart}>
        Add to Cart
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}

export default ProductDetails;