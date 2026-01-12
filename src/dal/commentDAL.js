const Comment = require('../models/Comment');

/**
 * Data Access Layer for Comment operations
 */
class CommentDAL {
    /**
     * Create a new comment
     * @param {Object} commentData - Comment data
     * @returns {Promise<Object>} Created comment
     */
    async createComment(commentData) {
        const comment = new Comment(commentData);
        await comment.save();
        return await this.findById(comment._id);
    }

    /**
     * Find comment by ID with author populated
     * @param {string} commentId - Comment ID
     * @returns {Promise<Object|null>} Comment object or null
     */
    async findById(commentId) {
        return await Comment.findById(commentId)
            .populate('author', 'username email')
            .populate('replyCount');
    }

    /**
     * Find root comments (no parent) with pagination
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Comments and pagination info
     */
    async findRootComments(options = {}) {
        const {
            page = 1,
            limit = 20,
            sortBy = 'newest',
        } = options;

        const skip = (page - 1) * limit;

        // Determine sort order
        let sort = {};
        switch (sortBy) {
            case 'oldest':
                sort = { createdAt: 1 };
                break;
            case 'most_liked':
                sort = { likes: -1, createdAt: -1 };
                break;
            case 'newest':
            default:
                sort = { createdAt: -1 };
        }

        const query = { parentComment: null, isDeleted: false };

        const [comments, total] = await Promise.all([
            Comment.find(query)
                .populate('author', 'username email')
                .populate('replyCount')
                .sort(sort)
                .skip(skip)
                .limit(limit),
            Comment.countDocuments(query),
        ]);

        return {
            comments,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Find replies for a comment
     * @param {string} parentId - Parent comment ID
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Replies and pagination info
     */
    async findReplies(parentId, options = {}) {
        const {
            page = 1,
            limit = 20,
            sortBy = 'oldest', // Replies usually shown oldest first
        } = options;

        const skip = (page - 1) * limit;

        let sort = {};
        switch (sortBy) {
            case 'newest':
                sort = { createdAt: -1 };
                break;
            case 'most_liked':
                sort = { likes: -1, createdAt: 1 };
                break;
            case 'oldest':
            default:
                sort = { createdAt: 1 };
        }

        const query = { parentComment: parentId, isDeleted: false };

        const [comments, total] = await Promise.all([
            Comment.find(query)
                .populate('author', 'username email')
                .populate('replyCount')
                .sort(sort)
                .skip(skip)
                .limit(limit),
            Comment.countDocuments(query),
        ]);

        return {
            comments,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Update comment content
     * @param {string} commentId - Comment ID
     * @param {string} content - New content
     * @returns {Promise<Object|null>} Updated comment
     */
    async updateComment(commentId, content) {
        const comment = await Comment.findByIdAndUpdate(
            commentId,
            { content },
            { new: true, runValidators: true }
        )
            .populate('author', 'username email')
            .populate('replyCount');

        return comment;
    }

    /**
     * Soft delete comment
     * @param {string} commentId - Comment ID
     * @returns {Promise<Object|null>} Deleted comment
     */
    async deleteComment(commentId) {
        return await Comment.findByIdAndUpdate(
            commentId,
            { isDeleted: true },
            { new: true }
        );
    }

    /**
     * Add user to likes array
     * @param {string} commentId - Comment ID
     * @param {string} userId - User ID
     * @returns {Promise<Object|null>} Updated comment
     */
    async likeComment(commentId, userId) {
        const comment = await Comment.findByIdAndUpdate(
            commentId,
            { $addToSet: { likes: userId } },
            { new: true }
        )
            .populate('author', 'username email')
            .populate('replyCount');

        return comment;
    }

    /**
     * Remove user from likes array
     * @param {string} commentId - Comment ID
     * @param {string} userId - User ID
     * @returns {Promise<Object|null>} Updated comment
     */
    async unlikeComment(commentId, userId) {
        const comment = await Comment.findByIdAndUpdate(
            commentId,
            { $pull: { likes: userId } },
            { new: true }
        )
            .populate('author', 'username email')
            .populate('replyCount');

        return comment;
    }

    /**
     * Check if comment exists and is not deleted
     * @param {string} commentId - Comment ID
     * @returns {Promise<boolean>} True if exists and not deleted
     */
    async exists(commentId) {
        const comment = await Comment.findOne({
            _id: commentId,
            isDeleted: false,
        });
        return !!comment;
    }

    /**
     * Get comment with minimal data (for ownership check)
     * @param {string} commentId - Comment ID
     * @returns {Promise<Object|null>} Comment with author field
     */
    async findByIdMinimal(commentId) {
        return await Comment.findById(commentId).select('author isDeleted');
    }
}

module.exports = new CommentDAL();
