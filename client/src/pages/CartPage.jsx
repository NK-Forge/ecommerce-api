import { useEffect, useMemo, useState } from 'react';
import { getCart } from '../api/apiClient';
import { useAuth } from '../auth/useAuth';

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

function CartPage() {
  const { token, user } = useAuth();
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');

  const total = useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + Number(item.price) * Number(item.quantity);
    }, 0);
  }, [items]);

  useEffect(() => {
    let isMounted = true;

    async function loadCart() {
      try {
        const cartData = await getCart(user.id, token);

        if (isMounted) {
          setItems(cartData.items || []);
          setStatus('success');
        }
      } catch (err) {
        if (isMounted) {
          setErrorMessage(err.message);
          setStatus('error');
        }
      }
    }

    loadCart();

    return () => {
      isMounted = false;
    };
  }, [token, user.id]);

  return (
    <main>
      <section className="panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">Shopping Cart</p>
            <h1>Your Cart</h1>
          </div>

          <p className="product-count">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        {status === 'loading' && (
          <p className="status-message">Loading cart...</p>
        )}

        {status === 'error' && (
          <p className="status-message error-message">
            Unable to load cart: {errorMessage}
          </p>
        )}

        {status === 'success' && items.length === 0 && (
          <p className="status-message">
            Your cart is empty. Visit the products page to add something.
          </p>
        )}

        {status === 'success' && items.length > 0 && (
          <div className="cart-layout">
            <div className="cart-items">
              {items.map((item) => (
                <article className="cart-item" key={item.id}>
                  <div>
                    <h2>{item.name}</h2>
                    <p>{item.description || 'No description available.'}</p>
                  </div>

                  <div className="cart-item-meta">
                    <span>Qty: {item.quantity}</span>
                    <span>{formatPrice(item.price)}</span>
                    <span>{formatPrice(Number(item.price) * Number(item.quantity))}</span>
                  </div>
                </article>
              ))}
            </div>

            <aside className="cart-summary" aria-label="Cart summary">
              <p className="eyebrow">Summary</p>
              <h2>Total</h2>
              <p className="cart-total">{formatPrice(total)}</p>
              <button className="primary-button" type="button">
                Continue to Checkout
              </button>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}

export default CartPage;