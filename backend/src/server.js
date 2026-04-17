// import dotenv from "dotenv";
// dotenv.config();

// console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
// import app from "./app.js";

// const PORT = process.env.PORT || 5000;

// import pool from "./config/db.js";

// pool.query('SELECT 1', (err, res) => {
//   if (err) {
//     console.error('DB connection error:', err.message);
//   } else {
//     console.log('DB connected successfully!');
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


// import dotenv from "dotenv";
// dotenv.config();

import app from "./app.js";
import pool from "./config/db.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});