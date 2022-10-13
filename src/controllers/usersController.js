const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require ('../models/User');

const usersFilePath = path.join(__dirname, "../data/usersDataBase.json");
let users = JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));

const usersController = {
    register: (req, res) => {
        res.render("./users/register")
    },

    store: (req, res) => {
        const resultValidation = validationResult(req); 

        //Consulto si existen errores y renderizo nuevamente la vista con los mismos
        if(resultValidation.errors.length > 0){
            console.log(req.body)
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
        User.create(newUser);
        res.redirect("/users/login");
    },

    login: (req, res) => {
        res.render("./users/login")
    },
    loginProcess: (req, res) => {
        const userToLogin = users.find(oneUser => oneUser.email == req.body.email);
        if (userToLogin) {
            const isPaswordCorrect = bcrypt.compareSync(req.body.password, userToLogin.password)
            if (isPaswordCorrect) {
                delete userToLogin.password;
                req.session.userLogged = userToLogin;
                if (req.body.recordame != undefined) {
                    res.cookie('recordame', req.session.userLogged.email, { maxAge: 100000 })
                }
                res.redirect('/');
            };
        };
    },
    logout: (req,res) => {
        req.session.destroy();
        return res.redirect('/');
    }
}

module.exports = usersController;