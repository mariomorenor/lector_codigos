const { Sequelize, DataTypes } = require('sequelize');
const { app } = require("electron");
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(app.getPath("userData"), "database.sqlite")
});

const Ingresos = sequelize.define("ingresos", {
  fecha: DataTypes.DATE,
  nombres: DataTypes.STRING,
  apellidos: DataTypes.STRING,
  cedula: DataTypes.STRING,
  email: DataTypes.STRING,
});

Ingresos.sync();

module.exports = {
  Ingresos
}