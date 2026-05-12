const db = require('../db');

const getOrCreateCartByUserId = async (userId) => {
  const existingCart = await db.query(
    `SELECT id, user_id, created_at, updated_at
     FROM carts
     WHERE user_id = $1`,
    [userId]
  );

  if (existingCart.rows[0]) {
    return existingCart.rows[0];
  }

  const newCart = await db.query(
    `INSERT INTO carts (user_id)
     VALUES ($1)
     RETURNING id, user_id, created_at, updated_at`,
    [userId]
  );

  return newCart.rows[0];
};

const getCartByUserId = async (userId) => {
  const cart = await getOrCreateCartByUserId(userId);

  const result = await db.query(
    `SELECT 
      cart_items.id,
      cart_items.cart_id,
      cart_items.product_id,
      cart_items.quantity,
      products.name,
      products.description,
      products.price,
      products.inventory_quantity,
      cart_items.created_at,
      cart_items.updated_at
     FROM cart_items
     JOIN products ON cart_items.product_id = products.id
     WHERE cart_items.cart_id = $1
     ORDER BY cart_items.id ASC`,
    [cart.id]
  );

  return {
    cart: cart,
    items: result.rows
  };
};

const addItemToCart = async ({ userId, productId, quantity }) => {
  const cart = await getOrCreateCartByUserId(userId);

  const result = await db.query(
    `INSERT INTO cart_items (cart_id, product_id, quantity)
     VALUES ($1, $2, $3)
     ON CONFLICT (cart_id, product_id)
     DO UPDATE SET
      quantity = cart_items.quantity + EXCLUDED.quantity,
      updated_at = CURRENT_TIMESTAMP
     RETURNING id, cart_id, product_id, quantity, created_at, updated_at`,
    [cart.id, productId, quantity]
  );

  return result.rows[0];
};

const updateCartItem = async ({ userId, productId, quantity }) => {
  const cart = await getOrCreateCartByUserId(userId);

  const result = await db.query(
    `UPDATE cart_items
     SET quantity = $1,
      updated_at = CURRENT_TIMESTAMP
     WHERE cart_id = $2 AND product_id = $3
     RETURNING id, cart_id, product_id, quantity, created_at, updated_at`,
    [quantity, cart.id, productId]
  );

  return result.rows[0];
};

const removeCartItem = async ({ userId, productId }) => {
  const cart = await getOrCreateCartByUserId(userId);

  const result = await db.query(
    `DELETE FROM cart_items
     WHERE cart_id = $1 AND product_id = $2
     RETURNING id, cart_id, product_id, quantity, created_at, updated_at`,
    [cart.id, productId]
  );

  return result.rows[0];
};

const clearCart = async (userId) => {
  const cart = await getOrCreateCartByUserId(userId);

  const result = await db.query(
    `DELETE FROM cart_items
     WHERE cart_id = $1
     RETURNING id, cart_id, product_id, quantity, created_at, updated_at`,
    [cart.id]
  );

  return result.rows;
};

module.exports = {
  getOrCreateCartByUserId: getOrCreateCartByUserId,
  getCartByUserId: getCartByUserId,
  addItemToCart: addItemToCart,
  updateCartItem: updateCartItem,
  removeCartItem: removeCartItem,
  clearCart: clearCart
};