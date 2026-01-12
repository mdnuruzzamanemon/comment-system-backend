const RefreshToken = require('../models/RefreshToken');

/**
 * Data Access Layer for RefreshToken operations
 */
class RefreshTokenDAL {
    /**
     * Create a new refresh token
     * @param {Object} tokenData - Token data
     * @returns {Promise<Object>} Created refresh token
     */
    async createToken(tokenData) {
        const refreshToken = new RefreshToken(tokenData);
        return await refreshToken.save();
    }

    /**
     * Find refresh token by token value
     * @param {string} token - Token value (will be hashed)
     * @returns {Promise<Object|null>} RefreshToken object or null
     */
    async findByToken(token) {
        const hashedToken = RefreshToken.hashToken(token);
        return await RefreshToken.findOne({
            token: hashedToken,
            expiresAt: { $gt: new Date() }, // Only return non-expired tokens
        }).populate('userId');
    }

    /**
     * Delete refresh token by token value
     * @param {string} token - Token value (will be hashed)
     * @returns {Promise<Object|null>} Deleted token
     */
    async deleteByToken(token) {
        const hashedToken = RefreshToken.hashToken(token);
        return await RefreshToken.findOneAndDelete({ token: hashedToken });
    }

    /**
     * Delete all refresh tokens for a user
     * @param {string} userId - User ID
     * @returns {Promise<Object>} Delete result
     */
    async deleteAllByUser(userId) {
        return await RefreshToken.deleteMany({ userId });
    }

    /**
     * Delete expired tokens (cleanup)
     * @returns {Promise<Object>} Delete result
     */
    async deleteExpired() {
        return await RefreshToken.deleteMany({
            expiresAt: { $lt: new Date() },
        });
    }
}

module.exports = new RefreshTokenDAL();
