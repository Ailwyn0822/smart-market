const { Client } = require('pg');
require('dotenv').config();

async function resetOrdersStatus() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await client.connect();
    const result = await client.query(`UPDATE orders SET status = 'processing'`);
    console.log(`Successfully reset status for ${result.rowCount} orders to 'processing'`);
  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
  }
}

resetOrdersStatus();
