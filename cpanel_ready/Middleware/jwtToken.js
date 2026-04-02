const jwt = require("jsonwebtoken");

// Function to create an access token (JWT)
const createAccessToken=(payload)=>{
    const token=jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRATION
    });
   
    return token;
}

module.exports = createAccessToken; // Correct syntax for exporting the function



