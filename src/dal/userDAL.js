const User = require('../models/User');

/**
 * Data Access Layer for User operations
 */
class UserDAL {
    /**
     * Create a new user
     * @param {Object} userData - User data
     * @returns {Promise<Object>} Created user
     */
    async createUser(userData) {
        const user = new User(userData);
        return await user.save();
    }

    /**
     * Find user by email
     * @param {string} email - User email
     * @returns {Promise<Object|null>} User object or null
     */
    async findByEmail(email) {
        return await User.findOne({ email }).select('+password');
    }

    /**
     * Find user by username
     * @param {string} username - Username
     * @returns {Promise<Object|null>} User object or null
     */
    async findByUsername(username) {
        return await User.findOne({ username });
    }

    /**
     * Find user by ID
     * @param {string} userId - User ID
     * @returns {Promise<Object|null>} User object or null
     */
    async findById(userId) {
        return await User.findById(userId);
    }

    /**
     * Update user
     * @param {string} userId - User ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object|null>} Updated user
     */
    async updateUser(userId, updateData) {
        return await User.findByIdAndUpdate(userId, updateData, {
            new: true,
            runValidators: true,
        });
    }

    /**
     * Delete user
     * @param {string} userId - User ID
     * @returns {Promise<Object|null>} Deleted user
     */
    async deleteUser(userId) {
        return await User.findByIdAndDelete(userId);
    }

    /**
     * Check if email exists
     * @param {string} email - Email to check
     * @returns {Promise<boolean>} True if exists
     */
    async emailExists(email) {
        const user = await User.findOne({ email });
        return !!user;
    }

    /**
     * Check if username exists
     * @param {string} username - Username to check
     * @returns {Promise<boolean>} True if exists
     */
    async usernameExists(username) {
        const user = await User.findOne({ username });
        return !!user;
    }
}

module.exports = new UserDAL();
