# E-Commerce API

REST API for an e-commerce application built with Node.js, Express, and PostgreSQL.

This project supports user registration and login, product CRUD, user account CRUD, cart management, order creation, order management, JWT-protected routes, and Swagger API documentation.

## Tech Stack

- Node.js
- Express
- PostgreSQL
- Neon Postgres
- bcrypt
- JSON Web Tokens
- Swagger UI
- OpenAPI YAML

## Features

- User registration
- User login with JWT
- Password hashing with bcrypt
- Protected routes with JWT middleware
- CRUD operations for users
- CRUD operations for products
- Cart creation and cart item management
- Order creation from cart
- Order item snapshots
- Product inventory reduction when orders are placed
- Swagger API documentation

## Project Structure

```text
ecommerce-api/
├─ app.js
├─ server.js
├─ db/
│  ├─ index.js
│  └─ schema.sql
├─ docs/
│  ├─ api-plan.md
│  └─ openapi.yaml
├─ middleware/
│  └─ authMiddleware.js
├─ models/
│  ├─ cartModel.js
│  ├─ orderModel.js
│  ├─ productModel.js
│  └─ userModel.js
├─ routes/
│  ├─ auth.routes.js
│  ├─ cart.routes.js
│  ├─ orders.routes.js
│  ├─ products.routes.js
│  └─ users.routes.js
└─ package.json
```

## Environment Variables

Create a `.env` file in the project root using `.env.example` as a guide.

```env
PORT=4001
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
JWT_SECRET=replace-with-your-own-secret
```

## Installation

```bash
npm install
```

## Running the Server

```bash
npm run dev
```

The API runs at:

```text
http://localhost:4001
```

## Database Setup

The schema is located at:

```text
db/schema.sql
```

Run the SQL in your PostgreSQL database or Neon SQL Editor to create the required tables.

Expected tables:

```text
users
products
carts
cart_items
orders
order_items
```

## API Documentation

Swagger UI is available at:

```text
http://localhost:4001/api-docs/
```

## Main Endpoints

### Health

```text
GET /
GET /health/db
```

### Auth

```text
POST /auth/register
POST /auth/login
GET  /auth/me
```

### Users

```text
GET    /users
GET    /users/:id
PUT    /users/:id
DELETE /users/:id
```

### Products

```text
GET    /products
GET    /products/:id
POST   /products
PUT    /products/:id
DELETE /products/:id
```

### Cart

```text
GET    /cart/:userId
POST   /cart/:userId/items
PUT    /cart/:userId/items/:productId
DELETE /cart/:userId/items/:productId
DELETE /cart/:userId
```

### Orders

```text
POST   /orders/:userId
GET    /orders
GET    /orders/:id
GET    /orders/user/:userId
PUT    /orders/:id
DELETE /orders/:id
```

## Authentication

Protected endpoints require a bearer token.

Example:

```bash
curl --request GET \
--url http://localhost:4001/auth/me \
--header "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Example Register Request

```bash
curl --request POST \
--url http://localhost:4001/auth/register \
--header "Content-Type: application/json" \
--data "{\"username\":\"demo\",\"email\":\"demo@example.com\",\"password\":\"test123\"}"
```

## Example Login Request

```bash
curl --request POST \
--url http://localhost:4001/auth/login \
--header "Content-Type: application/json" \
--data "{\"email\":\"demo@example.com\",\"password\":\"test123\"}"
```

## Status

Core project functionality is complete:

- Express server
- PostgreSQL connection
- Database schema
- Authentication
- User CRUD
- Product CRUD
- Cart CRUD
- Order CRUD
- Swagger documentation
