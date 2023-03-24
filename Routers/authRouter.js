// Importing Dependencies //
const router = require('express').Router();
const authController = require('../Controllers/authController');
const {authenticateUser} = require('../Middlewares/authMiddleware');



router.post('/register', authController.register);
router.post('/login', authController.login);
router.route('/logout')
.get(authenticateUser, authController.logout)
.post(authenticateUser, authController.logout);


module.exports = router;