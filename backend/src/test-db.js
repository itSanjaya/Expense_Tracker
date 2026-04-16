require('dotenv').config();
const db = require('./config/db');

async function test() {
  try {
    const result = await db.query('SELECT NOW()');
    console.log('DB TIME:', result.rows[0]);
  } catch (err) {
    console.error('DB ERROR:', err);
  }
}

test();