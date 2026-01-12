const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {
    registerValidation,
    loginValidation,
    validate,
} = require('../middleware/validationMiddleware');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post(
    '/register',
    registerValidation,
    validate,
    authController.register.bind(authController)
);

router.post(
    '/login',
    loginValidation,
    validate,
    authController.login.bind(authController)
);

router.post('/refresh', authController.refreshToken.bind(authController));

// Protected routes
router.get('/profile', protect, authController.getProfile.bind(authController));

router.post('/logout', protect, authController.logout.bind(authController));

router.post('/logout-all', protect, authController.logoutAll.bind(authController));

module.exports = router;
