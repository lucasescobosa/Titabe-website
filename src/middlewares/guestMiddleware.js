function guestMiddleware (req, res, next) {
    if (req.session.userLogged && req.session.userLogged.role_id !== 1) {
        return res.redirect('/')
    }
    next();
}
module.exports = guestMiddleware;