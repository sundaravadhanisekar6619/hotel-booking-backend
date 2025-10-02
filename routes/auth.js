const express = require('express');
const { check, body } = require('express-validator');
const router = express.Router();

const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);

router.get('/', authController.getLogin);

router.post('/login', 
[
check('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .normalizeEmail(),
body('password', 'Please enter a correct password.')
    .isLength({ min: 5 })
    .trim()
],
authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
