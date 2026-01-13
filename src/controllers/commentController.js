const commentService = require('../services/commentService');
const socketEvents = require('../socket/socketEvents');

/**
 * Controller for comment endpoints
 */
class CommentController {
    /**
     * @route   POST /api/comments
     * @desc    Create a root comment
     * @access  Private
     */
    async createComment(req, res) {
        try {
            const { content } = req.body;
            const userId = req.user._id;

            const comment = await commentService.createComment(
                userId,
                content,
                null
            );

            // Emit real-time event
            socketEvents.emitCommentCreated(comment);

            res.status(201).json({
                success: true,
                message: 'Comment created successfully',
                data: comment,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * @route   POST /api/comments/:id/reply
     * @desc    Reply to a comment
     * @access  Private
     */
    async replyToComment(req, res) {
        try {
            const { content } = req.body;
            const userId = req.user._id;
            const parentId = req.params.id;

            const comment = await commentService.createComment(
                userId,
                content,
                parentId
            );

            // Emit real-time event
            socketEvents.emitReplyCreated(comment, parentId);

            res.status(201).json({
                success: true,
                message: 'Reply created successfully',
                data: comment,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * @route   GET /api/comments
     * @desc    Get root comments with pagination
     * @access  Public
     */
    async getComments(req, res) {
        try {
            const {
                page = 1,
                limit = 20,
                sortBy = 'newest',
            } = req.query;

            const userId = req.user ? req.user._id : null;

            const result = await commentService.getComments(
                {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    sortBy,
                },
                userId
            );

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * @route   GET /api/comments/:id/replies
     * @desc    Get replies for a comment
     * @access  Public
     */
    async getReplies(req, res) {
        try {
            const commentId = req.params.id;
            const {
                page = 1,
                limit = 20,
                sortBy = 'oldest',
            } = req.query;

            const userId = req.user ? req.user._id : null;

            const result = await commentService.getReplies(
                commentId,
                {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    sortBy,
                },
                userId
            );

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * @route   PUT /api/comments/:id
     * @desc    Update comment
     * @access  Private (owner only)
     */
    async updateComment(req, res) {
        try {
            const commentId = req.params.id;
            const { content } = req.body;
            const userId = req.user._id;

            const comment = await commentService.updateComment(
                commentId,
                userId,
                content
            );

            // Emit real-time event
            socketEvents.emitCommentUpdated(comment);

            res.status(200).json({
                success: true,
                message: 'Comment updated successfully',
                data: comment,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * @route   DELETE /api/comments/:id
     * @desc    Delete comment
     * @access  Private (owner only)
     */
    async deleteComment(req, res) {
        try {
            const commentId = req.params.id;
            const userId = req.user._id;

            const result = await commentService.deleteComment(commentId, userId);

            console.log('[Controller] Delete result:', {
                parentCommentId: result.parentCommentId,
                hasParentComment: !!result.parentComment,
                parentReplyCount: result.parentComment?.replyCount
            });

            // Emit real-time event with author info, parent ID, and updated parent comment
            const author = { id: userId, username: req.user.username };
            socketEvents.emitCommentDeleted(
                commentId,
                author,
                result.parentCommentId,
                result.parentComment
            );

            res.status(200).json({
                success: true,
                message: 'Comment deleted successfully',
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * @route   POST /api/comments/:id/like
     * @desc    Toggle like on comment
     * @access  Private
     */
    async toggleLike(req, res) {
        try {
            const commentId = req.params.id;
            const userId = req.user._id;

            const result = await commentService.toggleLike(commentId, userId);

            // Emit real-time event with user info
            const user = { id: userId, username: req.user.username };
            socketEvents.emitLikeUpdate(result.comment, result.action, user);

            res.status(200).json({
                success: true,
                message: `Comment ${result.action} successfully`,
                data: result.comment,
                action: result.action,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * @route   POST /api/comments/:id/dislike
     * @desc    Toggle dislike on comment
     * @access  Private
     */
    async toggleDislike(req, res) {
        try {
            const commentId = req.params.id;
            const userId = req.user._id;

            const result = await commentService.toggleDislike(commentId, userId);

            // Emit real-time event with user info
            const user = { id: userId, username: req.user.username };
            socketEvents.emitDislikeUpdate(result.comment, result.action, user);

            res.status(200).json({
                success: true,
                message: `Comment ${result.action} successfully`,
                data: result.comment,
                action: result.action,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
}

module.exports = new CommentController();
