const db = require("../config/dbConnection");

const walletUpdate = async (req, res) => {
  try {
    const { walletId } = req.body; // Wallet ID from the request body
    const userId = req.user.id; // User ID from the authenticated user

    // Check if walletId is provided
    if (!walletId) {
      return res.status(400).json({ message: 'Wallet ID is required' });
    }

    // Define the SQL query for inserting or updating the wallet
    const query = `
      INSERT INTO wallets (user_id, wallet_id) 
      VALUES (?, ?) 
      ON DUPLICATE KEY UPDATE wallet_id = ?;
    `;

    // Execute the query using the database connection
    const [results] = await db.execute(query, [userId, walletId, walletId]);

    // Check if a wallet was inserted or updated
    if (results.affectedRows > 0) {
      return res.status(200).json({ message: 'Wallet ID successfully updated' });
    } else {
      return res.status(404).json({ message: 'Wallet ID not found' });
    }
  } catch (error) {
    console.error("Database error:", error.message);
    return res.status(500).json({ message: 'Database error: ' + error.message });
  }
};


module.exports = walletUpdate;
