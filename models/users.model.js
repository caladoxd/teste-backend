const sequelize = require('sequelize');
const { fileURLToPath } = require('url');
const db = new sequelize('testebackend','root','femonemo',{
    host: "localhost",
    dialect: "mysql"
});


const usuario = db.define('usuarios', {
    nome:{
        type: sequelize.STRING,
        unique:true
    },
    hash:{
        type: sequelize.STRING
    },
})
