
const config = {
    DB_HOST: process.env.DB_HOST || "",
    DB_USER: process.env.DB_USER || "",
    DB_PASSWORD: process.env.DB_PASSWORD || "",
    DB_NAME: process.env.DB_NAME || "",
    JWT_SECRET: process.env.JWT_SECRET || "",
    JWT_EXPIRATION: process.env.JWT_EXPIRATION || "",
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "",
    REFRESH_TOKEN_EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION || "",
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
    SMTP_PASS: process.env.SMTP_PASS || "", 
    SMTP_MAIL: process.env.SMTP_MAIL || ""
}

module.exports=config;