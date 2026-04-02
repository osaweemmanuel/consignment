const express=require('express');
const authenticateUser=require("./../Middleware/authMiddleware");
const walletUpdate=require("../controllers/walletController");
const router=express.Router();

router.route('/updateWalletId')
  .get(authenticateUser, walletUpdate) // Allow GET requests
  .post(authenticateUser, walletUpdate); // Allow POST requests

module.exports = router;

