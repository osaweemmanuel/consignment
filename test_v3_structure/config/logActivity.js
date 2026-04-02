const db = require('./dbConnection');

/**
 * Logs an administrative action to the database for audit purposes.
 */
const logActivity = async (userId, action, details, ip_address = 'Internal') => {
  try {
    const query = `
      INSERT INTO activity_logs (userId, action, details, ip_address) 
      VALUES (?, ?, ?, ?)
    `;
    await db.execute(query, [userId, action, JSON.stringify(details), ip_address]);
  } catch (err) {
    console.error("Failed to log activity:", err.message);
  }
};

module.exports = logActivity;
