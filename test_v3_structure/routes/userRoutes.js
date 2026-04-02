const express = require('express');
const router = express.Router(); 

// Import controllers and middlewares
const { 
    register, 
    login, 
    logout, 
    findUserById, 
    changeUserPassword, 
  
} = require('../controllers/usersController');

const authenticateUser = require('../Middleware/authMiddleware');

// Routes for user authentication
router.post("/register", register);           // Registration
router.post("/login", login);                 // Login
router.post("/logout", authenticateUser, logout); // Logout

// Route to get user details (requires authentication)
router.get('/user/:userId', authenticateUser, findUserById);

// Route for changing password
router.post("/change-password", authenticateUser, changeUserPassword);



module.exports = router;
