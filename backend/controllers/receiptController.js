const db=require('../config/dbConnection');

const generatereferenceNumber = () => {
    return  Math.floor(Math.random() * 1000000000);
}

const createReceipt = async (req, res) => {
    try {
      const { 
        fullName, 
        email, 
        payment_description, 
        amount, 
        total_payment, 
        payment_method, 
        payment_date, // not used below but you may decide to use it if needed
        currency 
      } = req.body;
      
      console.log('Request Body:', req.body);
  
      // Validate required fields
      if (!fullName || !email || !payment_description || !amount || !total_payment || !payment_method || !currency) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }
  
      const userId = req.user.id; // Make sure req.user is set by your auth middleware
  
      const paymentDate = new Date();
      const referenceId = generatereferenceNumber();
  
      const query = `
        INSERT INTO receipts (
          fullName, email, referenceId, userId, payment_description, 
          payment_method, amount, total_payment, payment_date, currency
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
  
      const values = [
        fullName,
        email,
        referenceId,
        userId,
        payment_description,
        payment_method,
        amount,
        total_payment,
        paymentDate,
        currency,
      ];
  
      // Execute the query using the promise-based pool
      const [results] = await db.execute(query, values);
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Failed to create receipt' });
      }
  
      res.status(200).json({
        message: 'Successfully created receipt',
        receipt: {
          id: results.insertId,
          fullName,
          email,
          amount,
          total_payment,
          payment_method,
          payment_date: paymentDate,
          currency,
        },
      });
    } catch (error) {
      console.error('Server error:', error.message);
      res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
  };


  const getReceiptById = async (req, res) => {
    try {
      const receiptId = req.params.id;
      
      // Execute the query with the receiptId as parameter
      const [results] = await db.execute(
        "SELECT * FROM receipts WHERE id = ?",
        [receiptId]
      );
      
      if (results.length === 0) {
        return res.status(404).json({ message: 'No record found' });
      }
      
      res.status(200).json({
        message: 'Record fetched successfully',
        data: results[0]
      });
    } catch (error) {
      console.error("Error fetching receipt:", error);
      res.status(500).json({ message: 'Something went wrong while trying to fetch data' });
    }
  };


  const getAllReceipt = async (req, res) => {
    try {
      const [results] = await db.execute(
        "SELECT *, (SELECT COUNT(*) FROM receipts) AS totalReceipt FROM receipts"
      );
  
      if (results.length === 0) {
        return res.status(200).json({ totalResult: 0, results: [] });
      }
  
      const totalResult = results[0].totalReceipt;
      res.status(200).json({ totalResult, results });
    } catch (err) {
      console.error("Error fetching receipts:", err);
      res.status(500).json({ message: 'Something went wrong while trying to fetch receipts' });
    }
  };

  const updateReceipt = async (req, res) => {
    try {
      const receiptId = req.params.id;
      const { total_payment, payment_date } = req.body;
      
      // Validate required fields:
      if (total_payment === undefined || payment_date === undefined) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      
      // Check if the receipt exists:
      const [results] = await db.execute(
        "SELECT * FROM receipts WHERE TRIM(id) = ?",
        [receiptId]
      );
      if (results.length === 0) {
        return res.status(404).json({ message: 'No record found' });
      }
      const existingReceipt = results[0];
      
      // Define the updated date (using current date, you can also use payment_date if needed)
      const finalDate = new Date();
      
      let updateQuery;
      let queryParams;
      
      // Example: if you want to enforce a certain status when progress reaches 100:
      if (total_payment && total_payment === existingReceipt.total_payment && parseInt(total_payment) > 0) {
        // This is just an example condition; adjust as needed.
        updateQuery = `
          UPDATE receipts 
          SET total_payment = ?, payment_date = ?
          WHERE id = ?`;
        queryParams = [total_payment, finalDate, receiptId];
      } else {
        // Generic update query (you may adjust conditions as needed)
        updateQuery = `
          UPDATE receipts
          SET total_payment = ?, payment_date = ?
          WHERE id = ?`;
        queryParams = [total_payment, finalDate, receiptId];
      }
      
      // Execute the update query:
      const [updateResult] = await db.execute(updateQuery, queryParams);
      
      // Check if the update affected any rows:
      if (updateResult.affectedRows === 0) {
        return res.status(404).json({ message: "No record found" });
      }
      
      return res.status(200).json({ message: 'Successfully updated', updateResult });
      
    } catch (error) {
      console.error("Error updating receipt:", error.message);
      return res.status(500).json({ message: 'Something went wrong while trying to update receipts', error: error.message });
    }
  };

  const deleteReceipt = async (req, res) => {
    try {
      const receiptId = req.params.id;
      const [result] = await db.execute("DELETE FROM receipts WHERE id = ?", [receiptId]);
  
      // Check if any rows were affected (i.e. a record was deleted)
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'No record found' });
      }
      
      res.status(200).json({ message: 'Receipt successfully deleted' });
    } catch (error) {
      console.error("Error deleting receipt:", error.message);
      res.status(500).json({ message: 'Error occurred while trying to delete receipt record' });
    }
  };

module.exports={createReceipt,getAllReceipt,deleteReceipt,updateReceipt,getReceiptById}