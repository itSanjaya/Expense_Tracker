const createUser = `
  INSERT INTO users (email, password)
  VALUES ($1, $2)
  RETURNING id, email, created_at
`;

const findUserByEmail = `
  SELECT * FROM users WHERE email = $1
`;

const findUserById = `
  SELECT id, email, created_at FROM users WHERE id = $1
`;

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};