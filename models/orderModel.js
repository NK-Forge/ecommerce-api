const db = require('../db');

const getOrderById = async (id) => {
  const orderResult = await db.query(
    `SELECT id, user_id, status, total, created_at, updated_at
     FROM orders
     WHERE id = $1`,
    [id]
  );

  const order = orderResult.rows[0];

  if (!order) {
    return undefined;
  }

  const itemsResult = await db.query(
    `SELECT
      order_items.id,
      order_items.order_id,
      order_items.product_id,
      order_items.quantity,
      order_items.price_at_purchase,
      products.name,
      products.description
     FROM order_items
     JOIN products ON order_items.product_id = products.id
     WHERE order_items.order_id = $1
     ORDER BY order_items.id ASC`,
    [id]
  );

  return {
    ...order,
    items: itemsResult.rows
  };
};

const getAllOrders = async () => {
  const result = await db.query(
    `SELECT id, user_id, status, total, created_at, updated_at
     FROM orders
     ORDER BY id ASC`
  );

  return result.rows;
};

const getOrdersByUserId = async (userId) => {
  const result = await db.query(
    `SELECT id, user_id, status, total, created_at, updated_at
     FROM orders
     WHERE user_id = $1
     ORDER BY id ASC`,
    [userId]
  );

  return result.rows;
};

const createOrderFromCart = async (userId) => {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    const cartResult = await client.query(
      `SELECT id, user_id
       FROM carts
       WHERE user_id = $1`,
      [userId]
    );

    const cart = cartResult.rows[0];

    if (!cart) {
      await client.query('ROLLBACK');
      return {
        error: 'Cart not found'
      };
    }

    const itemsResult = await client.query(
      `SELECT
        cart_items.product_id,
        cart_items.quantity,
        products.name,
        products.price,
        products.inventory_quantity
       FROM cart_items
       JOIN products ON cart_items.product_id = products.id
       WHERE cart_items.cart_id = $1
       ORDER BY cart_items.id ASC`,
      [cart.id]
    );

    const items = itemsResult.rows;

    if (items.length === 0) {
      await client.query('ROLLBACK');
      return {
        error: 'Cart is empty'
      };
    }

    for (const item of items) {
      if (Number(item.inventory_quantity) < Number(item.quantity)) {
        await client.query('ROLLBACK');
        return {
          error: `Not enough inventory for ${item.name}`
        };
      }
    }

    const total = items.reduce((sum, item) => {
      return sum + Number(item.price) * Number(item.quantity);
    }, 0);

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, status, total)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, status, total, created_at, updated_at`,
      [userId, 'pending', total.toFixed(2)]
    );

    const order = orderResult.rows[0];

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.product_id, item.quantity, item.price]
      );

      await client.query(
        `UPDATE products
         SET inventory_quantity = inventory_quantity - $1,
          updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [item.quantity, item.product_id]
      );
    }

    await client.query(
      `DELETE FROM cart_items
       WHERE cart_id = $1`,
      [cart.id]
    );

    await client.query('COMMIT');

    return getOrderById(order.id);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const updateOrderStatus = async (id, status) => {
  const result = await db.query(
    `UPDATE orders
     SET status = $1,
      updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING id, user_id, status, total, created_at, updated_at`,
    [status, id]
  );

  return result.rows[0];
};

const deleteOrder = async (id) => {
  const order = await getOrderById(id);

  if (!order) {
    return undefined;
  }

  await db.query(
    `DELETE FROM orders
     WHERE id = $1`,
    [id]
  );

  return order;
};

module.exports = {
  getOrderById: getOrderById,
  getAllOrders: getAllOrders,
  getOrdersByUserId: getOrdersByUserId,
  createOrderFromCart: createOrderFromCart,
  updateOrderStatus: updateOrderStatus,
  deleteOrder: deleteOrder
};