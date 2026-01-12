const commentDAL = require('../dal/commentDAL');

/**
 * Service layer for comment business logic
 */
class CommentService {
    /**
     * Create a new comment or reply
     * @param {string} userId - User ID
     * @param {string} content - Comment content
     * @param {string|null} parentId - Parent comment ID (null for root)
     * @returns {Promise<Object>} Created comment
     */
    async createComment(userId, content, parentId = null) {
        // Validate parent comment if provided
        if (parentId) {
            const parentExists = await commentDAL.exists(parentId);
            if (!parentExists) {
                throw new Error('Parent comment not found or has been deleted');
            }
        }

        const comment = await commentDAL.createComment({
            content,
            author: userId,
            parentComment: parentId,
        });

        return this.formatComment(comment, userId);
    }

    /**
     * Get root comments with pagination
     * @param {Object} options - Query options
     * @param {string} userId - Current user ID (for hasLiked)
     * @returns {Promise<Object>} Comments and pagination
     */
    async getComments(options, userId = null) {
        const result = await commentDAL.findRootComments(options);

        return {
            comments: result.comments.map((comment) =>
                this.formatComment(comment, userId)
            ),
            pagination: result.pagination,
        };
    }

    /**
     * Get replies for a comment
     * @param {string} commentId - Parent comment ID
     * @param {Object} options - Query options
     * @param {string} userId - Current user ID
     * @returns {Promise<Object>} Replies and pagination
     */
    async getReplies(commentId, options, userId = null) {
        // Check if parent comment exists
        const parentExists = await commentDAL.exists(commentId);
        if (!parentExists) {
            throw new Error('Comment not found or has been deleted');
        }

        const result = await commentDAL.findReplies(commentId, options);

        return {
            comments: result.comments.map((comment) =>
                this.formatComment(comment, userId)
            ),
            pagination: result.pagination,
        };
    }

    /**
     * Update comment content
     * @param {string} commentId - Comment ID
     * @param {string} userId - User ID
     * @param {string} content - New content
     * @returns {Promise<Object>} Updated comment
     */
    async updateComment(commentId, userId, content) {
        // Check ownership
        const comment = await commentDAL.findByIdMinimal(commentId);
        if (!comment) {
            throw new Error('Comment not found');
        }

        if (comment.isDeleted) {
            throw new Error('Cannot update deleted comment');
        }

        if (!comment.author.equals(userId)) {
            throw new Error('You can only update your own comments');
        }

        const updatedComment = await commentDAL.updateComment(
            commentId,
            content
        );

        return this.formatComment(updatedComment, userId);
    }

    /**
     * Delete comment (soft delete)
     * @param {string} commentId - Comment ID
     * @param {string} userId - User ID
     * @returns {Promise<void>}
     */
    async deleteComment(commentId, userId) {
        // Check ownership
        const comment = await commentDAL.findByIdMinimal(commentId);
        if (!comment) {
            throw new Error('Comment not found');
        }

        if (comment.isDeleted) {
            throw new Error('Comment already deleted');
        }

        if (!comment.author.equals(userId)) {
            throw new Error('You can only delete your own comments');
        }

        await commentDAL.deleteComment(commentId);
    }

    /**
     * Toggle like on a comment (mutually exclusive with dislike)
     * @param {string} commentId - Comment ID
     * @param {string} userId - User ID
     * @returns {Promise<Object>} Updated comment with like status
     */
    async toggleLike(commentId, userId) {
        const comment = await commentDAL.findById(commentId);

        if (!comment) {
            throw new Error('Comment not found');
        }

        if (comment.isDeleted) {
            throw new Error('Cannot like deleted comment');
        }

        let updatedComment;
        let action;

        // Check if user has disliked - remove dislike first
        if (comment.hasUserDisliked(userId)) {
            await commentDAL.undislikeComment(commentId, userId);
        }

        if (comment.hasUserLiked(userId)) {
            // Unlike
            updatedComment = await commentDAL.unlikeComment(commentId, userId);
            action = 'unliked';
        } else {
            // Like
            updatedComment = await commentDAL.likeComment(commentId, userId);
            action = 'liked';
        }

        return {
            comment: this.formatComment(updatedComment, userId),
            action,
        };
    }

    /**
     * Toggle dislike on a comment (mutually exclusive with like)
     * @param {string} commentId - Comment ID
     * @param {string} userId - User ID
     * @returns {Promise<Object>} Updated comment with dislike status
     */
    async toggleDislike(commentId, userId) {
        const comment = await commentDAL.findById(commentId);

        if (!comment) {
            throw new Error('Comment not found');
        }

        if (comment.isDeleted) {
            throw new Error('Cannot dislike deleted comment');
        }

        let updatedComment;
        let action;

        // Check if user has liked - remove like first
        if (comment.hasUserLiked(userId)) {
            await commentDAL.unlikeComment(commentId, userId);
        }

        if (comment.hasUserDisliked(userId)) {
            // Undislike
            updatedComment = await commentDAL.undislikeComment(commentId, userId);
            action = 'undisliked';
        } else {
            // Dislike
            updatedComment = await commentDAL.dislikeComment(commentId, userId);
            action = 'disliked';
        }

        return {
            comment: this.formatComment(updatedComment, userId),
            action,
        };
    }

    /**
     * Format comment for response
     * @param {Object} comment - Comment document
     * @param {string} userId - Current user ID
     * @returns {Object} Formatted comment
     */
    formatComment(comment, userId = null) {
        const formatted = {
            id: comment._id,
            content: comment.content,
            author: {
                id: comment.author._id,
                username: comment.author.username,
            },
            parentComment: comment.parentComment,
            likeCount: comment.likeCount,
            dislikeCount: comment.dislikeCount,
            replyCount: comment.replyCount || 0,
            hasLiked: userId ? comment.hasUserLiked(userId) : false,
            hasDisliked: userId ? comment.hasUserDisliked(userId) : false,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
        };

        return formatted;
    }
}

module.exports = new CommentService();
