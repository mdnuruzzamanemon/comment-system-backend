const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, 'Comment content is required'],
            trim: true,
            minlength: [1, 'Comment must be at least 1 character'],
            maxlength: [2000, 'Comment cannot exceed 2000 characters'],
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        parentComment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
            default: null,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for performance
commentSchema.index({ parentComment: 1, createdAt: -1 });
commentSchema.index({ author: 1 });
commentSchema.index({ isDeleted: 1 });

// Virtual for like count
commentSchema.virtual('likeCount').get(function () {
    return this.likes.length;
});

// Virtual for reply count (will be populated separately)
commentSchema.virtual('replyCount', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'parentComment',
    count: true,
});

// Ensure virtuals are included in JSON
commentSchema.set('toJSON', { virtuals: true });
commentSchema.set('toObject', { virtuals: true });

// Method to check if user has liked
commentSchema.methods.hasUserLiked = function (userId) {
    return this.likes.some((likeUserId) => likeUserId.equals(userId));
};

module.exports = mongoose.model('Comment', commentSchema);
