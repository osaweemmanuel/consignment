const {createAccessToken,
createRefreshToken,
verifyRefreshToken}=require("../Middleware/jwtToken");
const db = require("./../config/dbConnection");
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');

const register = async (req, res) => {
    console.log(req.body);
    const { firstname, lastname, gender, email, password } = req.body;
    try {
        // Check if email already exists
        db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Something went wrong while processing your request' });
            }

            if (results.length > 0) {
                return res.status(400).json({ message: 'Email already exists' });
            }

            try {
                // Generate salt and hash the password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                // Insert new user into the database
                db.query("INSERT INTO users (firstname, lastname, gender, email, password) VALUES (?, ?, ?, ?, ?)", 
                [firstname, lastname, gender, email, hashedPassword], (err, results) => {
                    if (err) {
                        return res.status(500).json({ message: 'Something went wrong while processing your request' });
                    }
                    res.status(201).json({ message: 'Registered successfully', results });
                });
            } catch (err) {
                console.error('Error hashing password:', err);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    } catch (err) {
        console.error('Error in registration process:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const refreshAccessToken = async (req, res) => {
    try {
        // Retrieve the refresh token from cookies
        const refreshToken = req.cookies.refreshToken;

        // Check if the refresh token is provided
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token is required' });
        }

        // Verify the refresh token
        const decodedRefreshToken = verifyRefreshToken(refreshToken);
        if (!decodedRefreshToken || !decodedRefreshToken.id) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        // Create a new access token using the ID from the decoded refresh token
        const newAccessToken = createAccessToken({ id: decodedRefreshToken.id }); // Ensure you use 'id'
        
        // Optionally, create a new refresh token if you want to rotate tokens
        const newRefreshToken = createRefreshToken({ id: decodedRefreshToken.id }); // Ensure you use 'id'

        // Set the new refresh token in cookies
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'Strict', // Helps mitigate CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
        });

        // Send the new access token to the client
        return res.json({ accessToken: newAccessToken });
    } catch (err) {
        console.error('Error while refreshing token:', err.message);
        // Handle cases where the refresh token is invalid or expired
        return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};




    

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Database query error' });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const user = results[0];

            // Compare password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const token = createAccessToken({ id: user.id, email: user.email });
            const refreshToken = createRefreshToken({ id: user.id, email: user.email });
        
            // Set the access token as an HttpOnly cookie
            res.cookie('token', token, {
                httpOnly: true,      // Prevent JavaScript access
                secure: false,       // Set to true if using HTTPS
                sameSite: 'Strict',  // Prevent CSRF
                maxAge: 30 * 24  * 60 * 60 * 1000 // 15 minutes for access token
            });

            // Send the refresh token as an HttpOnly cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,      // Prevent JavaScript access
                secure: false,       // Set to true if using HTTPS
                sameSite: 'Strict',  // Prevent CSRF
                maxAge: 60 * 24 * 60 * 60 * 1000 // 7 days
            });

            // Respond without sending token in JSON
            res.status(200).json({
                message: 'Login successful',
                user,token,refreshToken
            });
        });
    } catch (err) {
        console.error('Error during login:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const findUserById = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        db.query("SELECT * FROM users WHERE id = ?", [userId], (err, results) => {
            if (err) {
                console.error('Database query error:', err); // Improved error logging
                return res.status(500).json({ message: 'Something went wrong while processing your request' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'No user found' });
            }

            const user = results[0];
            res.status(200).json({ user });
        });
    } catch (err) {
        console.error('Error in findUserById function:', err.message); // Improved error logging
        res.status(500).json({ message: 'Internal server error' });
    }
};




    const logout = (req, res) => {
      
        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(0), 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
        });
    
    
        res.cookie('refreshToken', '', {
            httpOnly: true,
            expires: new Date(0), 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
        });
    
     
        res.status(200).json({ message: 'User logged out successfully' });
    };
    
    
    
     
    const changeUserPassword=async(req,res)=>{
        const {newPassword,oldPassword}=req.body;
         const userId=req.user.id;
         if(!newPassword || !oldPassword){
            return res.status(400).json({message:'All fileds is required'});
         }

         db.query("SELECT * FROM users WHERE id=?",[userId],async(err,results)=>{
            if(err){
                return res.status(500).json({message:'Internal server error'});
            }
            if(results.length === 0){
                return res.status(404).json({message:'No user found'});
            }
            const user=results[0];

            //compare password
            const isMatch=bcrypt.compare(oldPassword,user.password);
            if(!isMatch){
                return res.status(401).json({message:'The old password is incorrect'});
            }

            //hash the new password
            const hashedPassword=await bcrypt.hash(newPassword,10);

            //update the user password
            db.query("UPDATE users SET password=? WHERE id=?",[hashedPassword,userId],(err,updateResult)=>{
                if(err){
                    return res.status(500).json({message:'Failed to update password'});
                }
                res.status(200).json({message:'Password updated successfully',updateResult});
            })
         })
    }




module.exports = { register,login,logout,findUserById,changeUserPassword,refreshAccessToken};
