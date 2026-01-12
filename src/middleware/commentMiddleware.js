const commentDAL = require('../dal/commentDAL');

/**
 * Middleware to verify user owns the comment
 */
const isCommentOwner = async (req, res, next) => {
    try {
        const commentId = req.params.id;
        const userId = req.user._id;

        const comment = await commentDAL.findByIdMinimal(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found',
            });
        }

        if (comment.isDeleted) {
            return res.status(404).json({
                success: false,
                message: 'Comment has been deleted',
            });
        }

        if (!comment.author.equals(userId)) {
            return res.status(403).json({
                success: false,
                message: 'You can only modify your own comments',
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error verifying comment ownership',
            error: error.message,
        });
    }
};

/**
 * Middleware to validate comment exists and is not deleted
 */
const validateCommentExists = async (req, res, next) => {
    try {
        const commentId = req.params.id;

        const exists = await commentDAL.exists(commentId);

        if (!exists) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found or has been deleted',
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error validating comment',
            error: error.message,
        });
    }
};

/**
 * Middleware to validate parent comment for replies
 */
const validateParentComment = async (req, res, next) => {
    try {
        const parentId = req.params.id || req.body.parentComment;

        if (!parentId) {
            return next(); // No parent, it's a root comment
        }

        const exists = await commentDAL.exists(parentId);

        if (!exists) {
            return res.status(404).json({
                success: false,
                message: 'Parent comment not found or has been deleted',
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error validating parent comment',
            error: error.message,
        });
    }
};

module.exports = {
    isCommentOwner,
    validateCommentExists,
    validateParentComment,
};
