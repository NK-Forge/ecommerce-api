const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export async function getProducts() {
  const data = await request('/products');

  return data.products || [];
}