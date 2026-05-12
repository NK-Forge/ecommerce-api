# E-Commerce API Endpoint Plan

## Health

| Method | Endpoint | Description |
|---|---|---|
| GET | / | Confirms API is running |
| GET | /health/db | Confirms database connection |

## Auth / Users

| Method | Endpoint | Description |
|---|---|---|
| POST | /auth/register | Register a new user |
| POST | /auth/login | Log in an existing user |
| GET | /users | Get all users |
| GET | /users/:id | Get one user by ID |
| PUT | /users/:id | Update one user |
| DELETE | /users/:id | Delete one user |

## Products

| Method | Endpoint | Description |
|---|---|---|
| GET | /products | Get all products |
| GET | /products/:id | Get one product by ID |
| POST | /products | Create a product |
| PUT | /products/:id | Update a product |
| DELETE | /products/:id | Delete a product |

## Cart

| Method | Endpoint | Description |
|---|---|---|
| GET | /cart/:userId | Get a user's cart |
| POST | /cart/:userId/items | Add item to cart |
| PUT | /cart/:userId/items/:productId | Update item quantity |
| DELETE | /cart/:userId/items/:productId | Remove item from cart |
| DELETE | /cart/:userId | Clear cart |

## Orders

| Method | Endpoint | Description |
|---|---|---|
| POST | /orders/:userId | Create order from user cart |
| GET | /orders | Get all orders |
| GET | /orders/:id | Get one order by ID |
| GET | /orders/user/:userId | Get all orders for a user |
| PUT | /orders/:id | Update order status |
| DELETE | /orders/:id | Delete/cancel order |