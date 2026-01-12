const mongoose = require('mongoose');
const crypto = require('crypto');

const refreshTokenSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
            unique: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for automatic deletion of expired tokens
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Hash token before saving
refreshTokenSchema.pre('save', async function (next) {
    if (!this.isModified('token')) {
        return next();
    }

    try {
        // Hash the token using SHA256
        this.token = crypto.createHash('sha256').update(this.token).digest('hex');
        next();
    } catch (error) {
        next(error);
    }
});

// Static method to hash token for comparison
refreshTokenSchema.statics.hashToken = function (token) {
    return crypto.createHash('sha256').update(token).digest('hex');
};

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
