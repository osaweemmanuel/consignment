const jwt = require("jsonwebtoken");

// Function to create an access token (JWT)
const createAccessToken = (payload) => {
    if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRATION) {
        throw new Error("JWT secret or expiration is not set.");
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
        algorithm: 'HS256', // Specify algorithm
    });

    console.log("Generated Access Token:", token); // Log generated token
    return token;
};




// Function to create a refresh token (JWT)
const createRefreshToken = (payload) => {
    if (!process.env.REFRESH_TOKEN_SECRET || !process.env.REFRESH_TOKEN_EXPIRATION) {
        throw new Error("Refresh token secret or expiration is not set.");
    }

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
        algorithm: 'HS256', // Specify algorithm
    });

    console.log("Generated Refresh Token:", refreshToken); // Log generated token
    return refreshToken;
};




// Function to verify an access token (JWT)
const verifyAccessToken = (token) => {
    if (!token) {
        throw new Error('Access token is required for verification');
    }

    console.log("Verifying Access Token:", token); // Log incoming token

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ['HS256'], // Specify algorithm
        });
        console.log("Decoded Access Token Payload:", decoded); // Log decoded payload
        return decoded; // Return the decoded payload
    } catch (err) {
        console.error('Access token verification error:', err.message);
        throw new Error('Invalid or expired access token');
    }
};

// Function to verify a refresh token (JWT)
const verifyRefreshToken = (token) => {
    if (!token) {
        throw new Error('Refresh token is required for verification');
    }

    console.log("Verifying Refresh Token:", token); // Log incoming token

    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, {
            algorithms: ['HS256'], // Specify algorithm
        });
        console.log("Decoded Refresh Token Payload:", decoded); // Log decoded payload
        return decoded; // Return the decoded payload
    } catch (err) {
        console.error('Refresh token verification error:', err.message);
        throw new Error('Invalid or expired refresh token');
    }
};

// Function to refresh the access token using a valid refresh token
const refreshAccessToken = (refreshToken) => {
    try {
        const decodedRefreshToken = verifyRefreshToken(refreshToken);
        if (!decodedRefreshToken.userId) {
            throw new Error('Invalid token payload');
        }
        // Create new access token using user ID from refresh token
        const newAccessToken = createAccessToken({ userId: decodedRefreshToken.userId });
        return newAccessToken;
    } catch (err) {
        console.error('Error while refreshing access token:', err.message);
        throw new Error('Invalid or expired refresh token');
    }
};

// Logging environment variables safely for debugging (optional)
if (process.env.REFRESH_TOKEN_SECRET) {
    console.log("Refresh token secret is set.");
}
console.log("Refresh token expiration:", process.env.REFRESH_TOKEN_EXPIRATION);
console.log("Access token expiration:", process.env.JWT_EXPIRATION);

// Export the functions for external use
module.exports = {
    createAccessToken,
    createRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    refreshAccessToken
};
