import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts({
        search,
        categoryId,
        minPrice,
        maxPrice,
        sortBy,
        sortOrder,
        pageNumber,
        pageSize: 10,
      });

      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [pageNumber, sortBy, sortOrder]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPageNumber(1);
    loadProducts();
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Shop Our Products</h1>
        <p>Discover products you'll love.</p>
      </div>

      <form className="filter-panel" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setPageNumber(1);
          }}
        >
          <option value="">All Categories</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPageNumber(1);
          }}
        >
          <option value="">Sort By</option>
          <option value="name">Name</option>
          <option value="price">Price</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setPageNumber(1);
          }}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>

        <button type="submit">Search</button>
      </form>

      {loading && <p className="loading-message">Loading products...</p>}

      {error && <p className="error-message">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="empty-message">No products found.</p>
      )}

      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-image">
              <span>Product</span>
            </div>

            <div className="product-card-content">
              <p className="product-category">{product.categoryName}</p>

              <h2>{product.name}</h2>

              <p className="product-description">{product.description}</p>

              <p className="product-price">₹{product.price}</p>

              <p
                className={
                  product.availableQuantity > 0
                    ? "stock available"
                    : "stock unavailable"
                }
              >
                {product.availableQuantity > 0
                  ? `${product.availableQuantity} in stock`
                  : "Out of stock"}
              </p>

              <Link
                className="view-product-button"
                to={`/products/${product.id}`}
              >
                View Product
              </Link>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={pageNumber === 1}
            onClick={() => setPageNumber(pageNumber - 1)}
          >
            Previous
          </button>

          <span>
            Page {pageNumber} of {totalPages}
          </span>

          <button
            disabled={pageNumber === totalPages}
            onClick={() => setPageNumber(pageNumber + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Products;
