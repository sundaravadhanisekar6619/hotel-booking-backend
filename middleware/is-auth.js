module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn)
    {
        return res.redirect('/login');
    }
    req.userType = req.session.user.user_type;
    next();
}