import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { addToCart } from "../services/cartService";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
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
      setAdding(true);
      setMessage("");
      setError("");

      await addToCart(product.id, quantity);

      setMessage("Product added to your cart!");
    } catch (err) {
      console.error(err);

      setError(err.response?.data?.message || "Unable to add product to cart.");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <h2 className="page-message">Loading product...</h2>;
  }

  if (error && !product) {
    return <h2 className="page-message error-message">{error}</h2>;
  }

  if (!product) {
    return <h2 className="page-message">Product not found.</h2>;
  }

  const isOutOfStock = product.availableQuantity <= 0;

  return (
    <div className="product-details-page">
      <Link to="/products" className="back-link">
        ← Back to Products
      </Link>

      <div className="product-details-card">
        <div className="product-details-image">
          <span>Product Image</span>
        </div>

        <div className="product-details-content">
          <p className="product-category">{product.categoryName}</p>

          <h1>{product.name}</h1>

          <p className="product-details-description">{product.description}</p>

          <div className="product-details-price">₹{product.price}</div>

          <p className={isOutOfStock ? "stock unavailable" : "stock available"}>
            {isOutOfStock
              ? "Out of stock"
              : `${product.availableQuantity} units available`}
          </p>

          {!isOutOfStock && (
            <div className="quantity-section">
              <label>Quantity</label>

              <div className="quantity-controls">
                <button
                  onClick={() =>
                    setQuantity((current) => Math.max(1, current - 1))
                  }
                >
                  −
                </button>

                <span>{quantity}</span>

                <button
                  onClick={() =>
                    setQuantity((current) =>
                      Math.min(product.availableQuantity, current + 1),
                    )
                  }
                >
                  +
                </button>
              </div>
            </div>
          )}

          {error && <p className="product-error">{error}</p>}

          {message && <p className="product-success">{message}</p>}

          <div className="product-actions">
            <button
              className="add-cart-button"
              onClick={handleAddToCart}
              disabled={isOutOfStock || adding}
            >
              {adding ? "Adding..." : "Add to Cart"}
            </button>

            {message && (
              <button
                className="buy-now-button"
                onClick={() => navigate("/cart")}
              >
                Go to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
