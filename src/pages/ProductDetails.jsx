import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/productService";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) {
    return <h2>Loading product...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Price: ₹{product.price}</p>
      <p>Category: {product.categoryName}</p>
      <p>Available: {product.availableQuantity}</p>

      <button>Add to Cart</button>
    </div>
  );
}

export default ProductDetails;
