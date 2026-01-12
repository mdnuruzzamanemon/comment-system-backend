const userDAL = require('../dal/userDAL');
const refreshTokenDAL = require('../dal/refreshTokenDAL');
const {
    generateAccessToken,
    generateRefreshToken,
    getRefreshTokenExpiry,
} = require('../utils/jwtUtils');

/**
 * Service layer for authentication business logic
 */
class AuthService {
    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @returns {Promise<Object>} User and tokens
     */
    async register(userData) {
        const { username, email, password } = userData;

        // Check if email already exists
        const emailExists = await userDAL.emailExists(email);
        if (emailExists) {
            throw new Error('Email already registered');
        }

        // Check if username already exists
        const usernameExists = await userDAL.usernameExists(username);
        if (usernameExists) {
            throw new Error('Username already taken');
        }

        // Create user
        const user = await userDAL.createUser({
            username,
            email,
            password,
        });

        // Generate tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken();

        // Store refresh token in database
        await refreshTokenDAL.createToken({
            token: refreshToken,
            userId: user._id,
            expiresAt: getRefreshTokenExpiry(),
        });

        return {
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
            },
            accessToken,
            refreshToken,
        };
    }

    /**
     * Login user
     * @param {Object} credentials - Login credentials
     * @returns {Promise<Object>} User and tokens
     */
    async login(credentials) {
        const { email, password } = credentials;

        // Find user by email
        const user = await userDAL.findByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Check if user is active
        if (!user.isActive) {
            throw new Error('Account is deactivated');
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        // Generate tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken();

        // Store refresh token in database
        await refreshTokenDAL.createToken({
            token: refreshToken,
            userId: user._id,
            expiresAt: getRefreshTokenExpiry(),
        });

        return {
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
            },
            accessToken,
            refreshToken,
        };
    }

    /**
     * Refresh access token using refresh token
     * @param {string} refreshToken - Refresh token
     * @returns {Promise<Object>} New access token
     */
    async refreshAccessToken(refreshToken) {
        if (!refreshToken) {
            throw new Error('Refresh token is required');
        }

        // Find refresh token in database
        const tokenDoc = await refreshTokenDAL.findByToken(refreshToken);
        if (!tokenDoc) {
            throw new Error('Invalid or expired refresh token');
        }

        // Check if user is still active
        if (!tokenDoc.userId.isActive) {
            throw new Error('Account is deactivated');
        }

        // Generate new access token
        const accessToken = generateAccessToken(tokenDoc.userId._id);

        return {
            accessToken,
            user: {
                id: tokenDoc.userId._id,
                username: tokenDoc.userId.username,
                email: tokenDoc.userId.email,
            },
        };
    }

    /**
     * Logout user
     * @param {string} refreshToken - Refresh token to invalidate
     * @returns {Promise<void>}
     */
    async logout(refreshToken) {
        if (!refreshToken) {
            throw new Error('Refresh token is required');
        }

        // Delete refresh token from database
        await refreshTokenDAL.deleteByToken(refreshToken);
    }

    /**
     * Logout from all devices
     * @param {string} userId - User ID
     * @returns {Promise<void>}
     */
    async logoutAll(userId) {
        await refreshTokenDAL.deleteAllByUser(userId);
    }

    /**
     * Get user profile
     * @param {string} userId - User ID
     * @returns {Promise<Object>} User profile
     */
    async getProfile(userId) {
        const user = await userDAL.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        return {
            id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}

module.exports = new AuthService();
