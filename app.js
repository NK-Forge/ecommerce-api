require('dotenv').config();

const express = require('express');
const db = require('./db');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'E-Commerce API is running'
  });
});

app.get('/health/db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');

    res.status(200).json({
      status: 'ok',
      databaseTime: result.rows[0].now
    });
  } catch (err) {
    console.error('Database health check failed:', err);

    res.status(500).json({
      status: 'error',
      name: err.name,
      code: err.code,
      message: err.message,
      stack: err.stack
    });
  }
});

module.exports = app;