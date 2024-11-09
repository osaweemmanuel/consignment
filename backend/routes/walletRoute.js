const express=require('express');
const authenticateUser=require("./../Middleware/authMiddleware");
const walletUpdate=require("../controllers/walletController");
const router=express.Router();

router.post('/updateWalletId',authenticateUser,walletUpdate);

module.exports = router;

