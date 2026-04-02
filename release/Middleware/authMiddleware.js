

const { verifyAccessToken, refreshAccessToken } = require("../Middleware/jwtToken");

// const authenticateUser = async (req, res, next) => {
//     try {
//         // Retrieve access token from the 'Authorization' header or cookies
//         const authHeader = req.headers.authorization;
//         let accessToken = null;

//         // Check for the access token in the Authorization header
//         if (authHeader && authHeader.startsWith("Bearer ")) {
//             accessToken = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
//         } else if (req.cookies && req.cookies.token) {
//             accessToken = req.cookies.token; // Fallback to cookies if no header
//             console.log("Access token from cookies:", accessToken);
//         }

//         // Check if access token is present
//         if (!accessToken) {
//             return res.status(401).json({ message: 'Access token required' });
//         }

//         // Verify the access token
//         try {
//             const decoded = verifyAccessToken(accessToken);
//             req.user = decoded; // Attach decoded user data to the request object
//             return next(); // Proceed to the next middleware or route handler
//         } catch (err) {
//             // Check if the error is due to token expiration
//             if (err.name === 'TokenExpiredError') {
//                 console.log('Access token expired. Attempting to refresh...');
//                 const refreshToken = req.cookies.refreshToken; // Get refresh token from cookies
//                 console.log('Refresh token:', refreshToken);

//                 if (!refreshToken) {
//                     return res.status(401).json({ message: 'Refresh token required for authentication' });
//                 }

//                 // Attempt to generate a new access token using the refresh token
//                 try {
//                     const newAccessToken = await refreshAccessToken(refreshToken); // Generate new token
//                     console.log("New access token from authenticateUser:", newAccessToken);

//                     // Set the new access token in the response cookie and header
//                     res.cookie('token', newAccessToken, {
//                         httpOnly: true, // Ensure it's not accessible via JavaScript
//                         secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
//                         sameSite: 'None', // Allow cross-origin cookie sending
//                     });

//                     res.setHeader('Authorization', `Bearer ${newAccessToken}`);
//                     req.user = verifyAccessToken(newAccessToken); // Verify the new token and attach it to req.user

//                     return next(); // Proceed with the new token
//                 } catch (refreshError) {
//                     console.error('Refresh token error:', refreshError.message);
//                     return res.status(403).json({ message: 'Invalid or expired refresh token' });
//                 }
//             } else {
//                 // Other token errors (e.g., malformed token)
//                 return res.status(403).json({ message: 'Invalid access token' });
//             }
//         }
//     } catch (err) {
//         console.error('Authentication error:', err.message);
//         return res.status(403).json({ message: 'Authentication failed' });
//     }
// };



const jwt=require('jsonwebtoken')

 const authenticateUser = (req,res,next) => {
  // Check for 'token' (used in controller) or 'jwt'
  const token = req.cookies?.token || req.cookies?.jwt || (req.headers['authorization'] && req.headers['authorization'].startsWith('Bearer ') ? req.headers['authorization'].split(' ')[1] : null);
  
    if (!token) {
      console.log('Verification failed: No token detected in cookies or headers');
      res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied',
      });
      return;
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) ;
      req.user = decoded; 
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid token, authorization denied',
      });
    }
  };


module.exports = authenticateUser;
