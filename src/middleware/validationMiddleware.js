const { body, validationResult } = require('express-validator');

/**
 * Validation rules for user registration
 */
const registerValidation = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
];

/**
 * Validation rules for user login
 */
const loginValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
];

/**
 * Middleware to handle validation errors
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map((err) => ({
                field: err.path,
                message: err.msg,
            })),
        });
    }
    next();
};

/**
 * Validation rules for comment creation
 */
const commentValidation = [
    body('content')
        .trim()
        .notEmpty()
        .withMessage('Comment content is required')
        .isLength({ min: 1, max: 2000 })
        .withMessage('Comment must be between 1 and 2000 characters'),
];

/**
 * Validation rules for comment update
 */
const commentUpdateValidation = [
    body('content')
        .trim()
        .notEmpty()
        .withMessage('Comment content is required')
        .isLength({ min: 1, max: 2000 })
        .withMessage('Comment must be between 1 and 2000 characters'),
];

module.exports = {
    registerValidation,
    loginValidation,
    commentValidation,
    commentUpdateValidation,
    validate,
};
