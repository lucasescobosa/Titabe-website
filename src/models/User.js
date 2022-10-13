const fs = require("fs");
const path = require('path');
const bcrypt = require("bcryptjs");

const usersFilePath = path.join(__dirname, "../data/usersDataBase.json");

const User = {
    getData: function () {
        return JSON.parse(fs.readFileSync(usersFilePath, "utf-8"))
    },

    generateID: function () {
        let allUsers = this.findAll();
        let lastUser = allUsers.pop();
        if (lastUser){
            return lastUser.id + 1;
        }
        return 1;
    },

    findAll: function () {
        return this.getData();
    },

    findByPk: function (id) {
        let allUsers = this.findAll();
        let userFound = allUsers.find(oneUser => oneUser.id === id);
        return userFound;
    },

    findByField: function (field, data) {
        let allUsers = this.findAll();
        let userFound = allUsers.find(oneUser => oneUser[field] === data);
        return userFound;
    },

    create: function (userData) {
        let allUsers = this.findAll();
        allUsers.push(userData);
        fs.writeFileSync(usersFilePath, JSON.stringify(allUsers, null, " "));
        return userData;
    },

    delete: function (id) {
        let allUsers = this.findAll();
        let finalUsers = allUsers.filter(oneUser => oneUser.id !== id);
        fs.writeFileSync(usersFilePath, JSON.stringify(finalUsers, null, " "));
        return true;
    }
}

module.exports = User;
