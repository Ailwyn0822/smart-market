const { Client } = require('pg');
const fs = require('fs');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'smart_market',
  password: 'password',
  port: 5432,
});

async function main() {
  try {
    await client.connect();
    const res = await client.query('SELECT * FROM users ORDER BY "createdAt" DESC LIMIT 5');
    const users = res.rows.map(u => ({ id: u.id, email: u.email, name: u.name }));
    
    const orders = await client.query('SELECT * FROM orders ORDER BY id DESC LIMIT 5');
    const ordersData = orders.rows.map(o => ({ id: o.id, userId: o.userId }));
    
    const items = await client.query('SELECT id, "orderId", "sellerId" FROM order_items ORDER BY id DESC LIMIT 5');
    const itemsData = items.rows;
    
    fs.writeFileSync('query_result.json', JSON.stringify({ users, orders: ordersData, items: itemsData }, null, 2));
    console.log("Written to query_result.json");
  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
  }
}

main();
