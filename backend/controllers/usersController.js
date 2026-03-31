const db = require("./../config/dbConnection");
const bcrypt = require('bcryptjs');
const createAccessToken = require("../Middleware/jwtToken");
const { validateEmail, validatePassword } = require("../validation/userValidation");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { firstname, lastname, gender, email, password } = req.body;

  // Validate input fields
  if (!firstname || !lastname || !gender || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  // Validate email and password format
  if (!validateEmail(email)) {
    res.status(400);
    throw new Error('The email format is invalid');
  }
  if (!validatePassword(password)) {
    res.status(400);
    throw new Error("The password does not meet the criteria (min 8 chars, 1 uppercase, 1 special)");
  }

  // Check if email already exists
  const [existingUsers] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
  if (existingUsers.length > 0) {
    res.status(400);
    throw new Error('Email already exists');
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Insert new user
  const insertQuery = `
    INSERT INTO users (firstname, lastname, gender, email, password)
    VALUES (?, ?, ?, ?, ?)
  `;
  const [insertResult] = await db.execute(insertQuery, [firstname, lastname, gender, email, hashedPassword]);

  res.status(201).json({
    status: 'success',
    message: 'Successfully registered',
    userId: insertResult.insertId,
  });
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  // Query the database for a user with the provided email
  const [results] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

  if (results.length === 0) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const user = results[0];

  // Compare the provided password with the hashed password in the database
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Create an access token
  const token = createAccessToken({ id: user.id, email: user.email });

  // Set cookie with token (optional but recommended for security)
  res.cookie('token', token, {
    httpOnly: true,
    secure: true, // Required for sameSite: 'none'
    sameSite: 'none', // Required for cross-domain (DO -> cPanel)
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });

  // Remove password from user object before sending
  delete user.password;

  res.status(200).json({
    status: 'success',
    message: 'Login successful',
    userInfo: user, // Match frontend expectation
    token
  });
});

/**
 * @desc    Get user by ID
 * @route   GET /api/v1/auth/user/:userId
 * @access  Private
 */
const findUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    res.status(400);
    throw new Error('User ID is required');
  }

  const [results] = await db.execute("SELECT id, firstname, lastname, gender, email FROM users WHERE id = ?", [userId]);

  if (results.length === 0) {
    res.status(404);
    throw new Error('No user found');
  }

  res.status(200).json({
    status: 'success',
    user: results[0]
  });
});

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: true, 
    sameSite: 'none',
  });

  res.status(200).json({
    status: 'success',
    message: 'User logged out successfully'
  });
});

/**
 * @desc    Change user password
 * @route   POST /api/v1/auth/change-password
 * @access  Private
 */
const changeUserPassword = asyncHandler(async (req, res) => {
  const { newPassword, oldPassword } = req.body;
  const userId = req.user.id; // From authMiddleware

  if (!newPassword || !oldPassword) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const [results] = await db.execute("SELECT * FROM users WHERE id = ?", [userId]);
  if (results.length === 0) {
    res.status(404);
    throw new Error('No user found');
  }
  const user = results[0];

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error('The old password is incorrect');
  }

  // Validate new password strength
  if (!validatePassword(newPassword)) {
    res.status(400);
    throw new Error("The new password does not meet the security criteria");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const [updateResult] = await db.execute("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, userId]);

  if (updateResult.affectedRows === 0) {
    res.status(500);
    throw new Error('Failed to update password');
  }

  res.status(200).json({
    status: 'success',
    message: 'Password updated successfully'
  });
});

module.exports = { register, login, logout, findUserById, changeUserPassword };
