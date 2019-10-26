const models = require('../models');
const Customer = models.customer;

exports.getCustomers = (req, res) => {
    Customer
    .findAll()
    .then( customers => {
        res.send(customers);
    })
    .catch(e => {
        throw e;
    });
}

exports.addCustomer = (req, res) => {
    Customer
    .create(req.body)
    .then(result => {
        res.send(result);
    })
    .catch(e => {
        throw e;
    });
}