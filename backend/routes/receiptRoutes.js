const express=require("express");
const authenticateUser=require("../Middleware/authMiddleware");
const {createReceipt,getAllReceipt,deleteReceipt,updateReceipt,getReceiptById}=require("../controllers/receiptController");
const router=express.Router();

router.route("/create")
.post(authenticateUser,createReceipt)
.get(authenticateUser,createReceipt);
router.get("/",authenticateUser,getAllReceipt);
router.get("/:id",authenticateUser,getReceiptById);
router.delete("/:id",authenticateUser,deleteReceipt);

router.put("/:id",authenticateUser,updateReceipt);


module.exports = router;