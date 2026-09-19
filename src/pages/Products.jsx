import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";

function Products() {
  const [products, setProducts] = useState([]);

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
  const [categories, setCategories] = useState([]);

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
    const loadInitialData = async () => {
      try {
        const categoryData = await getCategories();
        setCategories(categoryData);
      } catch (err) {
        console.error(err);
        setError("Unable to load Categories.");
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [pageNumber]);

  const handleApplyFilters = () => {
    setPageNumber(1);
    loadProducts();
  };

  const handleClearFilters = () => {
    setSearch("");
    setCategoryId("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("");
    setSortOrder("asc");
    setPageNumber(1);

    setTimeout(() => {
      loadProducts();
    }, 0);
  };

  if (loading) {
    return <h2>Loading products...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div>
      <h1>Products</h1>

      {/* Filters */}
      <div>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
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
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="">Sort By</option>
          <option value="name">Name</option>
          <option value="price">Price</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>

        <button onClick={handleApplyFilters}>Apply Filters</button>

        <button onClick={handleClearFilters}>Clear</button>
      </div>

      {/* Products */}
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="product-container">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <h3>{product.name}</h3>

              <p>{product.description}</p>

              <p>₹{product.price}</p>

              <p>Category: {product.categoryName}</p>

              <p>Available: {product.availableQuantity}</p>

              <Link to={`/products/${product.id}`}>View Details</Link>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div>
        <button
          disabled={pageNumber === 1}
          onClick={() => setPageNumber(pageNumber - 1)}
        >
          Previous
        </button>

        <span>
          {" "}
          Page {pageNumber} of {totalPages}{" "}
        </span>

        <button
          disabled={pageNumber === totalPages}
          onClick={() => setPageNumber(pageNumber + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Products;
