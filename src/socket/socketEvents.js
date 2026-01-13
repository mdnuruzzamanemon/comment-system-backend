/**
 * Socket.io event emitters for real-time updates
 */
class SocketEvents {
    constructor() {
        this.io = null;
    }

    /**
     * Set Socket.io instance
     * @param {Object} io - Socket.io instance
     */
    setIO(io) {
        this.io = io;
    }

    /**
     * Emit comment created event
     * @param {Object} comment - Created comment
     */
    emitCommentCreated(comment) {
        if (!this.io) return;

        this.io.emit('comment:created', {
            event: 'comment:created',
            data: {
                ...comment,
                // Frontend can check: comment.author.id === currentUserId
                isOwnComment: false, // Frontend will determine this
            },
            timestamp: new Date().toISOString(),
        });

        console.log(`[Socket] Comment created by ${comment.author.username}: ${comment.id}`);
    }

    /**
     * Emit comment updated event
     * @param {Object} comment - Updated comment
     */
    emitCommentUpdated(comment) {
        if (!this.io) return;

        this.io.emit('comment:updated', {
            event: 'comment:updated',
            data: {
                ...comment,
                // Frontend can check: comment.author.id === currentUserId
            },
            timestamp: new Date().toISOString(),
        });

        console.log(`[Socket] Comment updated by ${comment.author.username}: ${comment.id}`);
    }

    /**
     * Emit comment deleted event
     * @param {string} commentId - Deleted comment ID
     * @param {Object} author - Author who deleted (optional)
     */
    emitCommentDeleted(commentId, author = null) {
        if (!this.io) return;

        this.io.emit('comment:deleted', {
            event: 'comment:deleted',
            data: {
                id: commentId,
                deletedBy: author ? {
                    id: author.id,
                    username: author.username
                } : null,
            },
            timestamp: new Date().toISOString(),
        });

        console.log(`[Socket] Comment deleted: ${commentId}`);
    }

    /**
     * Emit comment liked/unliked event
     * @param {Object} comment - Comment with updated like count
     * @param {string} action - 'liked' or 'unliked'
     * @param {Object} user - User who performed the action
     */
    emitLikeUpdate(comment, action, user) {
        if (!this.io) return;

        this.io.emit('comment:like_updated', {
            event: 'comment:like_updated',
            data: {
                commentId: comment.id,
                likeCount: comment.likeCount,
                dislikeCount: comment.dislikeCount,
                action, // 'liked' or 'unliked'
                // User who performed the action
                actionBy: {
                    id: user.id,
                    username: user.username
                },
                // Frontend can check if current user has liked/disliked
                // by comparing comment.hasLiked and comment.hasDisliked
                // But those are user-specific, so frontend should track separately
            },
            timestamp: new Date().toISOString(),
        });

        console.log(`[Socket] Comment ${action} by ${user.username}: ${comment.id}, likes: ${comment.likeCount}, dislikes: ${comment.dislikeCount}`);
    }

    /**
     * Emit comment disliked/undisliked event
     * @param {Object} comment - Comment with updated dislike count
     * @param {string} action - 'disliked' or 'undisliked'
     * @param {Object} user - User who performed the action
     */
    emitDislikeUpdate(comment, action, user) {
        if (!this.io) return;

        this.io.emit('comment:dislike_updated', {
            event: 'comment:dislike_updated',
            data: {
                commentId: comment.id,
                likeCount: comment.likeCount,
                dislikeCount: comment.dislikeCount,
                action, // 'disliked' or 'undisliked'
                // User who performed the action
                actionBy: {
                    id: user.id,
                    username: user.username
                },
            },
            timestamp: new Date().toISOString(),
        });

        console.log(`[Socket] Comment ${action} by ${user.username}: ${comment.id}, likes: ${comment.likeCount}, dislikes: ${comment.dislikeCount}`);
    }

    /**
     * Emit reply created event
     * @param {Object} reply - Created reply
     * @param {string} parentId - Parent comment ID
     */
    emitReplyCreated(reply, parentId) {
        if (!this.io) return;

        this.io.emit('comment:reply_created', {
            event: 'comment:reply_created',
            data: {
                reply: {
                    ...reply,
                    // Frontend can check: reply.author.id === currentUserId
                },
                parentId,
            },
            timestamp: new Date().toISOString(),
        });

        console.log(`[Socket] Reply created by ${reply.author.username}: ${reply.id} for parent: ${parentId}`);
    }
}

module.exports = new SocketEvents();
