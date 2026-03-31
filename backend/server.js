/**
 * --------------------------------------------------------------------------
 *  Express Server Configuration
 *  High Standard Logistics Backend Engine
 * --------------------------------------------------------------------------
 */

const express = require('express');
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary').v2;
const rateLimit = require('express-rate-limit');

// 🔹 Import Config & Middlewares
const corsOptions = require('./config/corsOptions');
const { errorHandler, notFound } = require('./Middleware/errorMiddleware');

// 🔹 Import Routes
const authRouter = require('./routes/userRoutes');
const parcelRouter = require('./routes/parcelRoutes');
const walletRouter = require('./routes/walletRoute');
const receiptRoute = require('./routes/receiptRoutes');
const contactRouter = require('./routes/contactRoutes');
const protectedRoute = require('./routes/protectedRoute');

const app = express();
app.set('trust proxy', 1); // 💡 Essential for cPanel/LiteSpeed production proxies

// 🔹 Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 🔹 Security & Logging Middleware
app.use(helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://unpkg.com"],
            imgSrc: ["'self'", "data:", "blob:", "https://*.basemaps.cartocdn.com", "https://unpkg.com", "https://res.cloudinary.com"],
            connectSrc: ["'self'", "https://*.basemaps.cartocdn.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
}));
app.use(morgan('dev')); // HTTP request logger
app.use(cors(corsOptions));

// 🔹 Rate Limiting (Prevents Brute Force) - Active only in Production
if (process.env.NODE_ENV === 'production') {
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100,
        message: 'Too many requests from this IP, please try again after 15 minutes'
    });
    app.use('/api/', limiter);
}

// 🔹 Global Middleware
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    // 🚀 Avoid parsing JSON for multipart/form-data (handled by multer)
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('multipart/form-data')) {
        return next();
    }
    
    // Explicitly handle empty or non-JSON bodies to avoid protocol drops
    express.json({ limit: '10mb' })(req, res, (err) => {
        if (err) {
            console.error('❌ JSON Parsing Error:', err.message);
            return res.status(400).json({ status: 'error', message: 'Malformed JSON body' });
        }
        next();
    });
});

app.use(express.static(path.join(__dirname, "dist"))); // 🚀 Serve the built frontend from inside the root folder
app.use(cookieParser());
app.use(compression());

// 🔹 Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🔹 API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/parcels', parcelRouter);
app.use('/api/v1/wallet', walletRouter);
app.use('/api/v1/receipts', receiptRoute);
app.use('/api/v1/contact', contactRouter);
app.use('/api/v1', protectedRoute);

// 🔹 Serve Frontend (Production Mode)
const frontendPath = path.join(__dirname, 'dist');
app.use(express.static(frontendPath));

// 🔹 Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// 🔹 Handle Frontend SPA Routing (Catch-all)
app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api')) return next();
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// 🔹 Error Handling
app.use(notFound);
app.use(errorHandler);

// 🔹 Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`\n🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
    console.log(`🔗 Local: http://localhost:${port}\n`);
});
