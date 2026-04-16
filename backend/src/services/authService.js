const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const queries = require('../queries/userQueries');

const SALT_ROUNDS = 10;

async function register(email, password) {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const result = await db.query(queries.createUser, [
    email,
    hashedPassword,
  ]);

  return result.rows[0];
}

async function login(email, password) {
  const result = await db.query(queries.findUserByEmail, [email]);

  const user = result.rows[0];
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return { token };
}

module.exports = {
  register,
  login,
};