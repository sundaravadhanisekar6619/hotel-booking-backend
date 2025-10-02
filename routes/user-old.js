const path = require('path');

const express = require('express');
const { check, body } = require('express-validator');

const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');
const user = require('../models/user');

const router = express.Router();

router.get('/users',isAuth, userController.getUser);

router.get('/create-user',isAuth, userController.getCreateUser);

router.post('/create-user',isAuth, [
    body('name', 'Please enter a name.')
    .isLength({ min: 2 })
    .isString()
    .trim(),
    body(
        'password', 
        'Please enter a password with only numbers and text with atleast 5 characters'
        )
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim(),
    body('confirmPassword')
    .trim()
    .custom((value, {req}) => {
            if (value !== req.body.password){
                throw new Error('Password have to match!');
            }
            return true;
        }),
    body('user_type', 'Please Select user type.')
    .isLength({ min: 2 })
    .isString()
    .trim(),
    body('phone', 'Please enter phone number.')
    .trim(),
    ],
 userController.postCreateUser);

router.get('/edit-user/:userId', isAuth, userController.getEditUser);

router.post('/edit-user',isAuth, [
    body('name', 'Please enter a name.')
    .isLength({ min: 2 })
    .isString()
    .trim(),
    
    body('user_type', 'Please Select user type.')
    .isLength({ min: 2 })
    .isString()
    .trim(),
    body('phone', 'Please enter phone number.')
    .trim(),
    ],
 userController.postEditUser);

router.delete('/user/:userId', isAuth, userController.deleteUser);

module.exports = router;