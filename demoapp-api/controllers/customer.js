const models = require('../models');
const Customer = models.customer;
const fs = require('fs');

exports.getCustomers = (req, res) => {
    Customer
        .findAll()
        .then(result => {
            res.send({
                status: 'success',
                result
            });
        })
        .catch(e => {
            res.send({
                status: 'error',
                message: "Error: Can't load customers, please check your internet connection and try again.",
                error: e
            });
        });
}

exports.addCustomer = (req, res) => {
    const { name, identity_number, phone_number } = req.body;
    Customer
        .findOne({ where: { identity_number } })
        .then((result) => {
            if (!result) {
                Customer
                    .create({
                        name,
                        identity_number,
                        phone_number,
                        image: req.file.path
                    })
                    .then(result => {
                        res.send({
                            status: 'success',
                            result
                        });
                    })
                    .catch(e => {
                        throw e;
                    });
            } else {
                res.send({
                    status: 'error',
                    message: `Customer with identity number '${req.body.identity_number}' is exists0`
                })
            }
        })
        .catch(e => {
            console.log(e)
            res.send({
                status: 'error',
                message: "Can't add Customer",
                error: e
            });
        })
}

exports.updateCustomer = (req, res) => {
    const { name, identity_number, phone_number } = req.body;
    Customer
        .update({
            id: req.params.id,
            name,
            identity_number,
            phone_number,
            image: ((req.hasOwnProperty('file') == false) ? req.body.prevPic : req.file.path)
        }, {
            where: { id: req.params.id }
        })
        .then(result => {
            res.send({
                status: 'success',
                result: {
                    id: req.params.id,
                    name,
                    identity_number,
                    phone_number,
                    image: ((req.hasOwnProperty('file') == false) ? req.body.prevPic : req.file.path)
                }
            })
        })
        .catch(e => {
            res.send({
                status: 'error',
                message: "Can't edit Customer",
                error: e
            });
        })
}

exports.deleteCustomer = (req, res) => {
    fs.exists(req.body.prevPic, (exists) => {
        if (exists) {
            fs.unlink(req.body.prevPic, (err) => {
                if (err) throw err;
                console.log('image deleted');
            })
        } else {
            console.log(req.body.prevPic)
        }
    });

    Customer
        .destroy({ where: { id: req.params.id } })
        .then(result => {
            res.send({
                status: 'success',
                id: req.params.id
            });
        })
        .catch(e => {
            res.send({
                status: 'error',
                message: "Can't delete",
                error: e
            });
        })
}