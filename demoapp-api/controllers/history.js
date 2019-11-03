const models = require('../models');
const History = models.history;

exports.getHistory = (req, res) => {
    History
    .findAll()
    .then((result) => {
        res.send({
            status: 'success',
            result
        });
    })
    .catch((e) => {
        res.send({
            status: 'error',
            message: "Error: Can't load histories, please check your internet connection and try again.",
            e
        });
    });
}

exports.createHistory = (data) => {
    History
    .create(data)
    .then((result) => {
        // console.log({
        //     status: 'success',
        //     result
        // })
    })
    .catch((e) => {
        console.log({
            status: 'error',
            message: "Error: Can't load customers, please check your internet connection and try again.",
            e
        })
    })
}