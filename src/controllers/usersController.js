const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const User = require ('../models/User');

const usersController = {
    register: (req, res) => {
        res.render("./users/register")
    },

    store: (req, res) => {
        const resultValidation = validationResult(req); 

        //Consulto si existen errores y renderizo nuevamente la vista con los mismos
        if(resultValidation.errors.length > 0){
            return res.render("./users/register", {
                errors: resultValidation.mapped(),
                oldData: req.body
            })
        }

        //Chequeo que no existan usuarios con ese mail
        if(User.findByField('email', req.body.email)){
            return res.render("./users/register", {
                errors: {
                    email: {
                        msg: 'Este email ya está registrado'
                    }
                },
                oldData: req.body
            })
        }

        //Comparo que las dos contaseñas coincidan
        if(req.body.password != req.body.passwordCheck){
            return res.render("./users/register", {
                errors: {
                    password: {
                        msg: 'Las contraseñas no coinciden'
                    }
                },
                oldData: req.body
            })
        }

        let userToRegister = req.body;
        delete userToRegister.passwordCheck;
        let newUser = {
            id: User.generateID(),
            ...userToRegister,
            password: bcrypt.hashSync(userToRegister.password , 10),
            image: req.file ? req.file.filename : "default.jpg",
            admin: req.body.admin ? req.body.admin : "false"
        }
        let userCreated = User.create(newUser);

        res.redirect("/users/login");
    },

    login: (req, res) => {
        res.render("./users/login")
    },

    loginProcess: (req, res) => {
        const userToLogin = User.findByField('email', req.body.email);
        if (userToLogin) {
            const isPaswordCorrect = bcrypt.compareSync(req.body.password, userToLogin.password)
            if (isPaswordCorrect) {
                delete userToLogin.password;
                req.session.userLogged = userToLogin;
                if (req.body.remember) {
                    res.cookie('remember', req.session.userLogged.email, { maxAge: 100000 })
                }
                return res.redirect('/');
            };
            return res.render("./users/login", {
                errors: {
                    email: {
                        msg: 'Las credenciales son inválidas'
                    }
                }
            });

        };
        return res.render("./users/login", {
            errors: {
                email: {
                    msg: 'No se encuentra el email registrado'
                }
            }
        });
    },

    logout: (req,res) => {
        res.clearCookie('remember');
        req.session.destroy();
        return res.redirect('/');
    }
}

module.exports = usersController;