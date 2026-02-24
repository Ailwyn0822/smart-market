const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'smart_market',
  password: 'password',
  port: 5432,
});

async function run() {
  await client.connect();
  try {
    const users = await client.query('SELECT id FROM users LIMIT 1');
    const user = users.rows[0];
    console.log('User id:', user.id);
    
    await client.query('INSERT INTO favorite ("userId", "productId") VALUES ($1, $2)', [user.id, 1]);
    console.log('Insert success!');
  } catch (err) {
    console.log('--- ERROR DETAILS ---');
    console.log(err.message);
    console.log(err.detail);
  } finally {
    await client.end();
  }
}
run().catch(console.error);
