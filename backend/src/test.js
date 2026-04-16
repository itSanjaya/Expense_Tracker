const db = require('./config/db');

db.query('SELECT NOW()', [])
  .then(res => console.log(res.rows))
  .catch(err => console.error(err));