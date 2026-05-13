import { useEffect, useState } from 'react';
import { getProducts } from './api/apiClient';
import './App.css';

function formatPrice(price) {
  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return '$0.00';
  }

  return numericPrice.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });
}

function App() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        const productData = await getProducts();

        if (isMounted) {
          setProducts(productData);
          setStatus('success');
        }
      } catch (err) {
        if (isMounted) {
          setErrorMessage(err.message);
          setStatus('error');
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Full-Stack E-Commerce</p>
          <h1>Browse products built from the existing API.</h1>
          <p className="hero-copy">
            This React client is now connected to the Node, Express, and Postgres backend.
          </p>
        </div>
      </section>

      <section className="products-section" aria-labelledby="products-heading">
        <div className="section-header">
          <div>
            <p className="eyebrow">Catalog</p>
            <h2 id="products-heading">Products</h2>
          </div>
          <p className="product-count">
            {products.length} {products.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        {status === 'loading' && (
          <p className="status-message">Loading products...</p>
        )}

        {status === 'error' && (
          <p className="status-message error-message">
            Unable to load products: {errorMessage}
          </p>
        )}

        {status === 'success' && products.length === 0 && (
          <p className="status-message">No products are available yet.</p>
        )}

        {status === 'success' && products.length > 0 && (
          <div className="product-grid">
            {products.map((product) => (
              <article className="product-card" key={product.id}>
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.description || 'No description available.'}</p>
                </div>

                <div className="product-meta">
                  <span>{formatPrice(product.price)}</span>
                  <span>
                    Stock: {product.inventory_quantity ?? product.inventoryQuantity ?? 0}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;