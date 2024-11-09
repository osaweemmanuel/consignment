const db=require('../config/dbConnection');

const generatereferenceNumber = () => {
    return  Math.floor(Math.random() * 1000000000);
}

const createReceipt=async(req,res)=>{
    const {fullName,email,payment_description,amount,total_payment,payment_method,payment_date,currency}=req.body;
    const userId=req.user.id;
    const paymentDate=new Date();
    const referenceId=generatereferenceNumber();

    db.query(`INSERT INTO receipts (fullName,email,referenceId,userId,payment_description, payment_method,amount,total_payment,payment_date,currency)
        VALUES(?,?,?,?,?,?,?,?,?,?)`,[fullName,email,referenceId,userId,payment_description,payment_method,amount,total_payment,paymentDate,currency],(err,results)=>{
            if(err){
                return res.status(500).json({message:'An error occurred while creating receipt'});
            }
            if(results.length === 0){
                return res.status(404).json({message:'No record found'});
            }
             res.status(200).json({message:'Successfully created',results});
        })
}

const getReceiptById = async (req, res) => {
    const  receiptId  = req.params.id; 
    

    db.query(`SELECT * FROM receipts WHERE id = ?`, [receiptId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Something went wrong while trying to fetch data' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'No record found' });
        }
        
        const newResult = results[0];
        res.status(200).json({ message: 'Record fetched successfully', data: newResult }); // Updated response key to 'data' for clarity
    });
};
const getAllReceipt=async(req,res)=>{
   db.query(`SELECT *,(SELECT COUNT(*) FROM receipts) AS totalReceipt FROM receipts`,(err,results)=>{
     if(err){
        return res.status(500).json({message:'Something went wrong while trying to fetch receipts'});
     }
     if(results.length === 0){
        return res.status(404).json({message:'No record found'});
     }
     const totalResult=results[0].totalReceipt;
     res.status(200).json({totalResult,results});
   })
}

const updateReceipt=async(req,res)=>{
    const receiptId=req.params.id;
    const {total_payment,payment_date}=req.body;
    if(!total_payment === undefined || !payment_date === undefined ){
        return res.status(400).json({message:'All fields are required'});
    }

    db.query(`SELECT * FROM receipts WHERE id=? `,[receiptId],(err,results)=>{
        if(err){
            res.status(500).json({message:'Something went wrong'});
        }
        if(results.length === 0){
            return res.status(404).json({message:'No record found'});
        }
        const finalDate=new Date();
        db.query(`UPDATE receipts SET total_payment=?, payment_date=? WHERE id=?`,[total_payment,finalDate,receiptId],(err,updateResult)=>{
            if(err){
                return res.status(500).json({message:'Something went wrong while trying to update receipts'});
            }
            if(updateResult.lenght === 0){
                return res.status(404).json({message:"No record found"});
            }
            res.status(200).json({message:'Successfully update'})
        })
    })

}

const deleteReceipt=async(req,res)=>{
    const receiptId=req.params.id;
    db.query(`DELETE FROM receipts WHERE id=?`,[receiptId],(err,receiptResult)=>{
        if(err){
            return res.status(500).json({message:'Error Occurred while trying to delete receipt record'});
        }
        if(receiptResult.lenght === 0){
            return res.status(404).json({message:'No record found'});
        }
        res.status(200).json({message:'Receipt Successfully deleted'});
    })
}

module.exports={createReceipt,getAllReceipt,deleteReceipt,updateReceipt,getReceiptById}