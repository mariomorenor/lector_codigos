const { Sequelize } = require('sequelize');
const {app} = require("electron");
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(app.getPath("userData"),"database.sqlite")
  });