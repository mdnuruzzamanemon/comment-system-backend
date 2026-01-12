const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');
const {
    isCommentOwner,
    validateCommentExists,
    validateParentComment,
} = require('../middleware/commentMiddleware');
const {
    commentValidation,
    commentUpdateValidation,
    validate,
} = require('../middleware/validationMiddleware');

// Optional authentication middleware (sets req.user if token present)
const optionalAuth = (req, res, next) => {
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        return protect(req, res, next);
    }
    next();
};

// Public routes (with optional auth for hasLiked)
router.get('/', optionalAuth, commentController.getComments.bind(commentController));

router.get(
    '/:id/replies',
    validateCommentExists,
    optionalAuth,
    commentController.getReplies.bind(commentController)
);

// Protected routes
router.post(
    '/',
    protect,
    commentValidation,
    validate,
    commentController.createComment.bind(commentController)
);

router.post(
    '/:id/reply',
    protect,
    validateParentComment,
    commentValidation,
    validate,
    commentController.replyToComment.bind(commentController)
);

router.put(
    '/:id',
    protect,
    isCommentOwner,
    commentUpdateValidation,
    validate,
    commentController.updateComment.bind(commentController)
);

router.delete(
    '/:id',
    protect,
    isCommentOwner,
    commentController.deleteComment.bind(commentController)
);

router.post(
    '/:id/like',
    protect,
    validateCommentExists,
    commentController.toggleLike.bind(commentController)
);

module.exports = router;
