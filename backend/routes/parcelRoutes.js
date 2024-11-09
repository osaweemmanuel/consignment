const express=require('express');
const router=express.Router();
const {parcelCreation,getParcelDetail, updateParcelLocation, deleteParcel,getAllParcel}=require('./../controllers/parcelController');

const multer=require('multer');
const authenticateUser=require('../Middleware/authMiddleware');
const path=require('path');





const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // File name format
    }
});

// Set file size limit (e.g., 5MB)
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB in bytes
    },
    fileFilter: (req, file, cb) => {
        // Optionally, you can add a file filter to restrict file types (e.g., images only)
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'), false);
        }
    }
});


router.
post('/create', authenticateUser,upload.single('image'), parcelCreation);
router.get('/:trackingNumber',getParcelDetail);
router.get("/",authenticateUser,getAllParcel);
router.put('/:trackingNumber',authenticateUser,updateParcelLocation);
router.delete('/:trackingNumber',authenticateUser,deleteParcel);




module.exports=router;


