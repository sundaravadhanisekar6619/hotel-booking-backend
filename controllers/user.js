const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const User = require('../models/user');

// GET /users → list all users
exports.getUser = async (req, res, next) => {
  const currentUrl = req.originalUrl;
  try {
    const users = await User.find();
    const userType = req.session.user.user_type;
    let isAdmin = userType === 'admin';
    let isSuperAdmin = userType === 'super_admin';

    res.render('user/users', {
      users,
      pageTitle: 'Admin users',
      path: '/users',
      isAuthenticated: true,
      isAdmin,
      isSuperAdmin,
      userDetail: req.session.user,
      currentUrl,
      userType
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

// GET /user/:userId? → display form for create or edit
exports.getUserForm = async (req, res, next) => {
  const currentUrl = req.originalUrl;
  const userId = req.params.userId; // undefined for create
  const editMode = !!userId;

  const userType = req.session.user.user_type;
  let isAdmin = userType === 'admin';
  let isSuperAdmin = userType === 'super_admin';

  let oldInput = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    user_type: '',
    status: 'inactive'
  };

  if (editMode) {
    try {
      const user = await User.findById(userId);
      if (!user) return res.redirect('/users');

      oldInput = {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        user_type: user.user_type,
        status: user.status || 'inactive'
      };
    } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
  }

  res.render('user/create-user', {
    pageTitle: editMode ? 'Edit User' : 'Add User',
    path: editMode ? `/user/edit/${userId}` : '/user',
    isAuthenticated: true,
    userType,
    oldInput,
    validationErrors: [],
    isAdmin,
    isSuperAdmin,
    editing: editMode,
    userDetail: req.session.user,
    currentUrl
  });
};

// POST /user → create or update user
exports.saveUser = async (req, res, next) => {
  const userId = req.body.userId; // present if editing
  const editing = !!userId;

  const errors = validationResult(req);
  const isSuperAdmin = req.session.user && req.session.user.user_type === 'super_admin';

  if (!errors.isEmpty()) {
    return res.status(422).render('user/create-user', {
      pageTitle: editing ? 'Edit User' : 'Add User',
      editing: editing,
      oldInput: req.body,
      validationErrors: errors.array(),
      isSuperAdmin: isSuperAdmin,
    });
  }

  const { name, email, password, confirmPassword, user_type, phone, status } = req.body;

  try {
    let user;

    if (editing) {
      user = await User.findById(userId);
      if (!user) return res.status(404).send('User not found');

      user.name = name;
      user.email = email;
      user.phone = phone;
      user.status = status === 'active' ? 'active' : 'inactive';

      // ✅ Only Super Admin can update user_type
      if (isSuperAdmin && user_type && ['user', 'admin', 'super_admin'].includes(user_type)) {
        user.user_type = user_type;
      }

      // Update password only if provided
      if (password && password.trim().length >= 5) {
        const hashedPassword = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
      }
    } else {
      // Creating new user: password required
      const hashedPassword = await bcrypt.hash(password, 12);

      user = new User({
        name,
        email,
        password: hashedPassword,
        user_type: isSuperAdmin && user_type ? user_type : 'user',
        phone,
        status: status === 'active' ? 'active' : 'inactive',
      });
    }

    await user.save();
    res.redirect('/users');
  } catch (err) {
    // Handle duplicate email
    if (err.name === 'MongoServerError' && err.code === 11000 && err.keyPattern.email) {
      return res.status(422).render('user/create-user', {
        pageTitle: editing ? 'Edit User' : 'Add User',
        editing: editing,
        oldInput: req.body,
        validationErrors: [{ path: 'email', msg: 'Email already exists' }],
        isSuperAdmin: isSuperAdmin,
      });
    }
    next(err);
  }
};


// DELETE /user/:userId
exports.deleteUser = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    await user.deleteOne();
    res.status(200).json({ message: 'User deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Deleting user failed.' });
  }
};
