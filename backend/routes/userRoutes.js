const express = require('express');
const router = express.Router();  // Correctly create the router instance
const { register,login,logout, findUserById, changeUserPassword,refreshAccessToken} = require('./../controllers/usersController');  // Ensure correct destructuring of `register`
const {validate,signupValidation, loginValidation}=require("./../validation/userValidation");
const authenticateUser=require("./../Middleware/authMiddleware");

// Define the route and attach the register controller
router.post('/register',validate(signupValidation()), register);
router.post('/login',validate(loginValidation()),login);
router.get('/getUser/:userId', authenticateUser,findUserById);
router.post("/logout",authenticateUser,logout);
router.post('/change-password',authenticateUser,changeUserPassword);
router.post('/refresh-token',refreshAccessToken);



module.exports = router;