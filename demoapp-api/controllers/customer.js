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
    })
}