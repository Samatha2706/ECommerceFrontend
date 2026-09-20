import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-content">
          <p className="home-eyebrow">WELCOME TO SHOPEASE</p>

          <h1>
            Everything you need,
            <span> all in one place.</span>
          </h1>

          <p className="home-hero-description">
            Discover quality products, explore great deals, and enjoy a simple
            and secure shopping experience.
          </p>

          <div className="home-hero-actions">
            <Link to="/products" className="home-primary-button">
              Shop Now
            </Link>

            <Link to="/products" className="home-secondary-button">
              Explore Products
            </Link>
          </div>
        </div>

        <div className="home-hero-card">
          <div className="hero-card-icon">🛍️</div>
          <h3>Shop with confidence</h3>
          <p>
            Browse products, manage your cart, and track your orders from one
            place.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="home-features">
        <div className="home-section-heading">
          <p className="home-eyebrow">WHY SHOPEASE</p>
          <h2>A better way to shop</h2>
          <p>
            Everything you need for a smooth and convenient shopping experience.
          </p>
        </div>

        <div className="home-feature-grid">
          <div className="home-feature-card">
            <div className="home-feature-icon">📦</div>
            <h3>Wide Selection</h3>
            <p>
              Explore products across multiple categories and find what suits
              you best.
            </p>
          </div>

          <div className="home-feature-card">
            <div className="home-feature-icon">🔒</div>
            <h3>Secure Shopping</h3>
            <p>
              Your account and shopping experience are protected with secure
              authentication.
            </p>
          </div>

          <div className="home-feature-card">
            <div className="home-feature-icon">🚚</div>
            <h3>Track Your Orders</h3>
            <p>
              Follow your order status from placement to delivery with real-time
              updates.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <div>
          <p className="home-eyebrow">READY TO SHOP?</p>
          <h2>Find something you'll love.</h2>
          <p>
            Start exploring our collection and discover your next favorite
            product.
          </p>
        </div>

        <Link to="/products" className="home-primary-button">
          Start Shopping
        </Link>
      </section>
    </div>
  );
}

export default Home;
