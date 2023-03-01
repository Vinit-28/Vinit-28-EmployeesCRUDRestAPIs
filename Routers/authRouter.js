const router = require('express').Router();
const authController = require('../Controllers/authController');



router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);


module.exports = router;