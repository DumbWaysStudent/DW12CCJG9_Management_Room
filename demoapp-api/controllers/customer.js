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

exports.updateCustomer = (req, res) => {
    Customer
    .update(req.body, {
        where: {id: req.params.id}
    })
    .then(result => {
        const {name, identity_number, phone_number, image} = req.body;
        res.send({
            id: req.params.id,
            name,
            identity_number,
            phone_number,
            image
        })
    })
    .catch(e => {
        throw e;
    })
}