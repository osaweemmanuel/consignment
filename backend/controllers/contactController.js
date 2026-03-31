const db = require("./../config/dbConnection");
const sendEmail = require("../utils/sendMail");

/**
 * @desc    Submit a contact/outreach inquiry
 * @route   POST /api/v1/contact
 * @access  Public
 */
const submitInquiry = async (req, res) => {
    try {
        const { firstName, lastName, email, inquiryType, message } = req.body;

        if (!firstName || !lastName || !email || !inquiryType || !message) {
            return res.status(400).json({ 
                success: false, 
                message: "All transmission parameters are mandatory." 
            });
        }

        // 1. Save to Database (Immutable Ledger)
        const query = `
            INSERT INTO contacts (firstName, lastName, email, inquiryType, message) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [firstName, lastName, email, inquiryType, message]);

        // 2. Dispatch Notification to Admin Center
        const subject = `INCOMING OUTREACH: ${inquiryType} [${firstName} ${lastName}]`;
        const text = `New message from ${firstName} ${lastName} (${email}). Inquiry: ${inquiryType}. Message: ${message}`;
        const html = `
            <div style="font-family: sans-serif; color: #0f172a;">
                <h2 style="color: #4D148C; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 2px solid #FF6600; padding-bottom: 10px;">Transmission Received</h2>
                <div style="margin-top: 20px; line-height: 1.8;">
                    <p><strong>Agent Identity:</strong> ${firstName} ${lastName}</p>
                    <p><strong>Digital Gateway:</strong> ${email}</p>
                    <p><strong>Protocol Type:</strong> ${inquiryType}</p>
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin-top: 15px;">
                        <p style="margin: 0; font-size: 14px; color: #475569; font-weight: bold; text-transform: uppercase; margin-bottom: 8px;">Cryptographic Payload:</p>
                        <p style="margin: 0; font-style: italic;">${message}</p>
                    </div>
                </div>
            </div>
        `;
        
        // Use the SMTP user as the recipient for testing/notifications
        await sendEmail(process.env.SMTP_USER, subject, text, html);

        res.status(201).json({ 
            success: true, 
            message: "Transmission verified and logged.",
            id: result.insertId 
        });
    } catch (err) {
        console.error("❌ Transmission Error:", err.message);
        res.status(500).json({ 
            success: false, 
            message: "Protocol Handshake Failed: " + err.message 
        });
    }
};

module.exports = { submitInquiry };
