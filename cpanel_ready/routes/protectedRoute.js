const express=require('express');
const router=express.Router();
const authenticateUser=require('../Middleware/authMiddleware');

router.get('/protected-route',authenticateUser,(req,res)=>{
    res.json({message:'This is protected data', user: req.user.id});
});

module.exports= router;