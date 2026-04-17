// import { Pool } from 'pg';

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// pool.on('connect', () => {
//   console.log('Connected to PostgreSQL');
// });

// pool.on('error', (err) => {
//   console.error('Database error:', err);
//   process.exit(1);
// });

// export default {
//   query: (text, params) => pool.query(text, params),
// };

import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export default pool;