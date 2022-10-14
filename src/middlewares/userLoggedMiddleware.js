const User = require('../models/User');

function userLoggedMiddleware (req,res,next) {
    res.locals.isLogged = false;
    
    const userFromCookie = User.findByField('email', req.cookies.remember)
    if (req.cookies.remember != undefined && req.session.userLogged == undefined) {
        req.session.userLogged = userFromCookie;
    }

    if(req.session.userLogged) {
        res.locals.isLogged = true;
        res.locals.userLogged = req.session.userLogged
    }

    next();
}

module.exports = userLoggedMiddleware;