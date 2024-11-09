// const express = require('express');
// require('dotenv').config();
// const cookieParser = require('cookie-parser');
// const path = require('path');
// const cloudinary = require('cloudinary').v2;
// const authRouter = require('./routes/userRoutes');
// const parcelRouter = require('./routes/parcelRoutes');
// const protectedRoute=require('./routes/protectedRoute');
// const walletRouter=require('./routes/walletRoute');
// const cors=require('cors');
// const http=require('http');
// const socketIo=require('socket.io');


// const app = express();
// const server=http.createServer(app);
// const io=socketIo(server);

// // Cloudinary Configuration
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });


// app.get('/', (req, res) => {
//     res.send("The app is working now");
// });

// app.use(express.static(path.resolve(__dirname, './uploads')));

// app.use(express.urlencoded({ extended: true })); // Built-in middleware for URL-encoded data
// app.use(express.json()); // Built-in middleware for JSON data
// app.use(cookieParser());

// app.use(cors({
//     origin: 'http://localhost:5173', // Allow only this origin
//     methods: ['PUT', 'GET', 'DELETE', 'POST'], // Allowed methods
//     allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
//     credentials: true // Allow cookies to be sent and received
// }));

// app.options('*', cors()); // Enable preflight requests for all routes

// //integrating the socket.io connection event
// io.on('connection',(socket)=>{
//     console.log('User is connected');

//     //event to message
//     socket.on('message',(data)=>{
//         console.log('Message received',data);
//         //emit all message to client
//         io.emit('message',data);
//     });

//     socket.on('disconnect',()=>{
//         console.log("User disconnected");
//     });
// })




// // Optional: Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something went wrong!');
    
// });

// app.use('/api/v1/auth', authRouter);
// app.use('/api/v1/parcels',parcelRouter);
// app.use('/api/v1/wallet',walletRouter);
// app.use('/api/v1',protectedRoute);
// app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// // app.get('*', (req, res) => {
// //   res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
// // });

// const port = process.env.PORT || 3000; // Use environment variable for port
// server.listen(port, () => {
//     console.log(`The app is running successfully on port ${port}`);
// });

// Import required modules
const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const authRouter = require('./routes/userRoutes');
const parcelRouter = require('./routes/parcelRoutes');
const protectedRoute = require('./routes/protectedRoute');
const walletRouter = require('./routes/walletRoute');
const receiptRoute=require("./routes/receiptRoutes");

const cors = require('cors');


// Initialize Express app
const app = express();



// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Serve static files from the `uploads` directory
app.use(express.static(path.resolve(__dirname, './uploads')));

// Parse incoming requests with URL-encoded and JSON payloads
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['PUT', 'GET', 'DELETE', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// Pre-flight requests
app.options('*', cors());



// Routes
app.use('/api/v1/auth', authRouter);         // User authentication routes
app.use('/api/v1/parcels', parcelRouter);    // Parcel management routes
app.use('/api/v1/wallet', walletRouter);     // Wallet management routes
app.use('/api/v1', protectedRoute);          // Protected routes
app.use("/api/v1/receipts",receiptRoute);                                      //Receipt

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// Optional: Error handling middleware for catching errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Simple route to test if the app is working
app.get('/', (req, res) => {
    res.send("The app is working now");
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`The app is running successfully on port ${port}`);
});
