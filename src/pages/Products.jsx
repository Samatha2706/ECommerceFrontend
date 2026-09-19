import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/productService";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return <h2>Loading products...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div>
      <h1>Products</h1>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="product-container">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="product-price">₹{product.price}</p>
              <p>Category: {product.categoryName}</p>
              <p>Available: {product.availableQuantity}</p>
              <Link to={`/products/${product.id}`}>View Details</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
