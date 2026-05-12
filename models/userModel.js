const db = require('../db');

const createUser = async ({ username, email, passwordHash }) => {
  const result = await db.query(
    `INSERT INTO users (username, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, username, email, created_at, updated_at`,
    [username, email, passwordHash]
  );

  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await db.query(
    `SELECT id, username, email, password_hash, created_at, updated_at
     FROM users
     WHERE email = $1`,
    [email]
  );

  return result.rows[0];
};

module.exports = {
  createUser: createUser,
  findUserByEmail: findUserByEmail
};