const db = require("../config/dbConnection");

// Function to create or update a wallet
const walletUpdate = async (req, res) => {
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

  // Execute the query
  db.query(query, [userId, walletId, walletId], (err, results) => {
    if (err) {
      // Handle database errors
      return res.status(500).json({ message: 'Database error: ' + err.message });
    }

    // Check if a wallet was inserted or updated
    if (results.affectedRows > 0) {
      res.status(200).json({ message: 'Wallet ID successfully updated' });
    } else {
      res.status(404).json({ message: 'Wallet ID not found' });
    }
  });
};

module.exports = walletUpdate;
