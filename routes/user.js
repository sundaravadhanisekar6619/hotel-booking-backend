const express = require('express');
const { body } = require('express-validator');

const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// List users
router.get('/users', isAuth, userController.getUser);

// Create form
router.get('/create-user', isAuth, userController.getUserForm);

// Edit form
router.get('/user/edit/:userId', isAuth, userController.getUserForm);

// Create user
router.post(
  '/user',
  isAuth,
  [
    body('name').isLength({ min: 2 }).trim().withMessage('Please enter a name'),
    body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
    body('password')
      .isLength({ min: 5 })
      .withMessage('Please enter a password with at least 5 characters')
      .isAlphanumeric()
      .withMessage('Password must contain letters and numbers')
      .trim(),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) throw new Error('Password must match');
      return true;
    }),
    body('user_type').isIn(['user', 'admin', 'super_admin']).withMessage('Please select a user type'),
    body('phone').trim(),
  ],
  userController.saveUser
);

// Edit user
router.post(
  '/user/edit/:userId',
  isAuth,
  [
    body('name').isLength({ min: 2 }).trim().withMessage('Please enter a name'),
    body('password')
      .optional({ checkFalsy: true })
      .isLength({ min: 5 })
      .withMessage('Password must be at least 5 characters')
      .isAlphanumeric()
      .withMessage('Password must contain letters and numbers')
      .trim(),
    body('confirmPassword')
      .optional({ checkFalsy: true })
      .custom((value, { req }) => {
        if (value !== req.body.password) throw new Error('Password must match');
        return true;
      }),
    body('user_type').isIn(['user', 'admin', 'super_admin']).withMessage('Please select a user type'),
    body('phone').trim(),
  ],
  userController.saveUser
);

// Delete user
router.delete('/user/:userId', isAuth, userController.deleteUser);

module.exports = router;
