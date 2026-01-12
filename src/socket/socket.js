const { Server } = require('socket.io');
const { verifyToken } = require('../utils/jwtUtils');
const userDAL = require('../dal/userDAL');

/**
 * Initialize Socket.io server
 * @param {Object} httpServer - HTTP server instance
 * @returns {Object} Socket.io instance
 */
const initializeSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:3000',
            credentials: true,
        },
    });

    // Authentication middleware for socket connections
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error('Authentication error: No token provided'));
            }

            // Verify token
            const decoded = verifyToken(token);

            // Get user from database
            const user = await userDAL.findById(decoded.id);

            if (!user || !user.isActive) {
                return next(new Error('Authentication error: Invalid user'));
            }

            // Attach user info to socket
            socket.userId = user._id.toString();
            socket.username = user.username;

            next();
        } catch (error) {
            next(new Error('Authentication error: ' + error.message));
        }
    });

    // Connection handler
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.username} (${socket.userId})`);

        // Join user to their own room for private notifications
        socket.join(`user:${socket.userId}`);

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.username}`);
        });
    });

    return io;
};

module.exports = { initializeSocket };
