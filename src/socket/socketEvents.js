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
            data: comment,
            timestamp: new Date().toISOString(),
        });

        console.log(`[Socket] Comment created: ${comment.id}`);
    }

    /**
     * Emit comment updated event
     * @param {Object} comment - Updated comment
     */
    emitCommentUpdated(comment) {
        if (!this.io) return;

        this.io.emit('comment:updated', {
            event: 'comment:updated',
            data: comment,
            timestamp: new Date().toISOString(),
        });

        console.log(`[Socket] Comment updated: ${comment.id}`);
    }

    /**
     * Emit comment deleted event
     * @param {string} commentId - Deleted comment ID
     */
    emitCommentDeleted(commentId) {
        if (!this.io) return;

        this.io.emit('comment:deleted', {
            event: 'comment:deleted',
            data: { id: commentId },
            timestamp: new Date().toISOString(),
        });

        console.log(`[Socket] Comment deleted: ${commentId}`);
    }

    /**
     * Emit comment liked event
     * @param {Object} comment - Comment with updated like count
     * @param {string} action - 'liked' or 'unliked'
     */
    emitLikeUpdate(comment, action) {
        if (!this.io) return;

        this.io.emit('comment:like_updated', {
            event: 'comment:like_updated',
            data: {
                commentId: comment.id,
                likeCount: comment.likeCount,
                action,
            },
            timestamp: new Date().toISOString(),
        });

        console.log(`[Socket] Comment ${action}: ${comment.id}, count: ${comment.likeCount}`);
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
                reply,
                parentId,
            },
            timestamp: new Date().toISOString(),
        });

        console.log(`[Socket] Reply created: ${reply.id} for parent: ${parentId}`);
    }
}

module.exports = new SocketEvents();
