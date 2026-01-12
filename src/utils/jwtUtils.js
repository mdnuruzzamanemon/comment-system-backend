const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Generate Access Token (short-lived)
 * @param {string} userId - User ID
 * @returns {string} JWT access token
 */
const generateAccessToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE || '15m',
    });
};

/**
 * Generate Refresh Token (long-lived, random string)
 * @returns {string} Random refresh token
 */
const generateRefreshToken = () => {
    return crypto.randomBytes(64).toString('hex');
};

/**
 * Verify JWT token (for access tokens)
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

/**
 * Calculate refresh token expiration date
 * @returns {Date} Expiration date
 */
const getRefreshTokenExpiry = () => {
    const days = parseInt(process.env.REFRESH_TOKEN_EXPIRE) || 7;
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
    getRefreshTokenExpiry,
};
