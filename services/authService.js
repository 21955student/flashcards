const fs = require('fs').promises;
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const usersFilePath = path.join(__dirname, '../data/users.json');

// Helper function to read users from the JSON file
const readUsers = async () => {
  try {
    const data = await fs.readFile(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// Helper function to insert users to the JSON file
const writeUsers = async (users) => {
  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
};

const registerUser = async (username, hashedPassword) => {
  const users = await readUsers();

  // Checking if user already exists
  if (users.find(user => user.username === username)) {
    throw new Error('Username already exists');
  }

  // Adding new user
  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1, // Simple ID increment
    username,
    password: hashedPassword,
  };
  users.push(newUser);
  await writeUsers(users);

  // Generating JWT
  const token = jwt.sign({ id: newUser.id, username: newUser.username }, process.env.JWT, { expiresIn: '1h' });
  return { user: newUser, token };
};

const loginUser = async (username, password) => {
  const users = await readUsers();

  // Finding user
  const user = users.find(user => user.username === username);
  if (!user) {
    throw new Error('Invalid username or password');
  }

  // Comparing password with hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid username or password');
  }

  // Generating JWT again after login
  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT, { expiresIn: '1h' });
  return { user, token };
};

module.exports = { registerUser, loginUser };