const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const fs = require('fs');
const models = require('../models');
const History = models.history;

const checkDBConn = (req, res) => {
    let sequelize;
    if (config.use_env_variable) {
        sequelize = new Sequelize(process.env[config.use_env_variable], config);
    } else {
        sequelize = new Sequelize(config.database, config.username, config.password, config);
    }

    sequelize
        .authenticate()
        .then(() => {
            res.send({
                status: 'success',
                message: 'Connected'
            });
        })
        .catch(e => {
            res.send({
                status: 'errorConn',
                message: 'Connection Error'
            })
        })
}

// ------------ EXPERIMENTAL ----------- //
const createHistory = (data) => {
    // History
    // .create(data)
    // .then(result => {
    //     return result;
    // })
}

const getHistories = () => {
    // History
    // .findAll()
    // .then(result => {
    //     return result;
    // })
}

// ------------------------------------- //

module.exports =  {
    checkDBConn,
    createHistory,
    getHistories
}