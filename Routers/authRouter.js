// Importing Dependencies //
const router = require('express').Router();
const authController = require('../Controllers/authController');
const {authenticateUser} = require('../Middlewares/authMiddleware');
const rateLimiter = require('express-rate-limit');
const loginLimiter = rateLimiter({
    windowMs: 10000,
    max: 4
});


router.post('/register', authController.register);
router.post('/login', loginLimiter, authController.login);
router.route('/logout')
.get(authenticateUser, authController.logout)
.post(authenticateUser, authController.logout);


module.exports = router;