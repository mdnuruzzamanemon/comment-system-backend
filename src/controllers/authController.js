const authService = require('../services/authService');

/**
 * Controller for authentication endpoints
 */
class AuthController {
    /**
     * @route   POST /api/auth/register
     * @desc    Register a new user
     * @access  Public
     */
    async register(req, res) {
        try {
            const result = await authService.register(req.body);

            // Set refresh token as httpOnly cookie
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            // Send access token in response
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    user: result.user,
                    accessToken: result.accessToken,
                },
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * @route   POST /api/auth/login
     * @desc    Login user
     * @access  Public
     */
    async login(req, res) {
        try {
            const result = await authService.login(req.body);

            // Set refresh token as httpOnly cookie
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            // Send access token in response
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    user: result.user,
                    accessToken: result.accessToken,
                },
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * @route   POST /api/auth/refresh
     * @desc    Refresh access token
     * @access  Public
     */
    async refreshToken(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;
            const result = await authService.refreshAccessToken(refreshToken);

            res.status(200).json({
                success: true,
                message: 'Token refreshed successfully',
                data: result,
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * @route   POST /api/auth/logout
     * @desc    Logout user
     * @access  Private
     */
    async logout(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;
            await authService.logout(refreshToken);

            // Clear refresh token cookie
            res.clearCookie('refreshToken');

            res.status(200).json({
                success: true,
                message: 'Logged out successfully',
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * @route   POST /api/auth/logout-all
     * @desc    Logout from all devices
     * @access  Private
     */
    async logoutAll(req, res) {
        try {
            await authService.logoutAll(req.user._id);

            // Clear refresh token cookie
            res.clearCookie('refreshToken');

            res.status(200).json({
                success: true,
                message: 'Logged out from all devices successfully',
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    /**
     * @route   GET /api/auth/profile
     * @desc    Get user profile
     * @access  Private
     */
    async getProfile(req, res) {
        try {
            const result = await authService.getProfile(req.user._id);

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message,
            });
        }
    }
}

module.exports = new AuthController();
