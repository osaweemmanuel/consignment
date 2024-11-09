


// Middleware to authenticate user by verifying the access token

// const { verifyAccessToken, refreshAccessToken } = require("../Middleware/jwtToken");
// const authenticateUser = (req, res, next) => {
//     try {
//         // Retrieve token from 'Authorization' header or cookies
//         const authHeader = req.headers.authorization;
//         let token = null;

//         // Check for the token in the Authorization header
//         if (authHeader && authHeader.startsWith("Bearer ")) {
//             token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
//             console.log('Token found in header:', token); // Debugging log
//         } else if (req.cookies && req.cookies.token) {
//             token = req.cookies.token; // Fallback to cookies if no header
//             console.log('Token found in cookies:', token); // Debugging log
//         }

//         // Check if token is present
//         if (!token) {
//             console.log('No token provided'); // Debugging log
//             return res.status(401).json({ message: 'Access token required' });
//         }

//         // Verify the access token
//         const decoded = verifyAccessToken(token);
//         console.log('Decoded token:', decoded); // Debugging log

//         // Attach decoded user data to the request object
//         req.user = decoded;

//         // Proceed to the next middleware or route handler
//         next();
//     } catch (err) {
//         console.error('Authentication error:', err.message); // Debugging log
//         return res.status(403).json({ message: 'Invalid or expired token' });
//     }
// };

// module.exports = authenticateUser;


const { verifyAccessToken, refreshAccessToken } = require("../Middleware/jwtToken");

const authenticateUser = async (req, res, next) => {
    try {
        // Retrieve access token from the 'Authorization' header or cookies
        const authHeader = req.headers.authorization;
        let accessToken = null;

        // Check for the access token in the Authorization header
        if (authHeader && authHeader.startsWith("Bearer ")) {
            accessToken = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
        } else if (req.cookies && req.cookies.token) {
            accessToken = req.cookies.token; // Fallback to cookies if no header
            console.log("Access token from cookies:", accessToken);
        }

        // Check if access token is present
        if (!accessToken) {
            return res.status(401).json({ message: 'Access token required' });
        }

        // Verify the access token
        try {
            const decoded = verifyAccessToken(accessToken);
            req.user = decoded; // Attach decoded user data to the request object
            return next(); // Proceed to the next middleware or route handler
        } catch (err) {
            // Check if the error is due to token expiration
            if (err.name === 'TokenExpiredError') {
                console.log('Access token expired. Attempting to refresh...');
                const refreshToken = req.cookies.refreshToken; // Get refresh token from cookies
                console.log('Refresh token:', refreshToken);

                if (!refreshToken) {
                    return res.status(401).json({ message: 'Refresh token required for authentication' });
                }

                // Attempt to generate a new access token using the refresh token
                try {
                    const newAccessToken = await refreshAccessToken(refreshToken); // Generate new token
                    console.log("New access token from authenticateUser:", newAccessToken);

                    // Set the new access token in the response cookie and header
                    res.cookie('token', newAccessToken, {
                        httpOnly: true, // Ensure it's not accessible via JavaScript
                        secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
                        sameSite: 'None', // Allow cross-origin cookie sending
                    });

                    res.setHeader('Authorization', `Bearer ${newAccessToken}`);
                    req.user = verifyAccessToken(newAccessToken); // Verify the new token and attach it to req.user

                    return next(); // Proceed with the new token
                } catch (refreshError) {
                    console.error('Refresh token error:', refreshError.message);
                    return res.status(403).json({ message: 'Invalid or expired refresh token' });
                }
            } else {
                // Other token errors (e.g., malformed token)
                return res.status(403).json({ message: 'Invalid access token' });
            }
        }
    } catch (err) {
        console.error('Authentication error:', err.message);
        return res.status(403).json({ message: 'Authentication failed' });
    }
};

module.exports = authenticateUser;
