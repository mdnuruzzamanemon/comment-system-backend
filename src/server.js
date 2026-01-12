require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/database');
const { initializeSocket } = require('./socket/socket');
const socketEvents = require('./socket/socketEvents');

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = initializeSocket(server);
socketEvents.setIO(io);

console.log('✓ Socket.io initialized with authentication');

// Start server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Socket.io ready for real-time updates`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
});
