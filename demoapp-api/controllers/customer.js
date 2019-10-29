const models = require('../models');
const Customer = models.customer;

exports.getCustomers = (req, res) => {
    Customer
        .findAll()
        .then(customers => {
            res.send(customers);
        })
        .catch(e => {
            res.send({
                status: 'error',
                message: "Can't load data",
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
                    res.send(result);
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
    Customer
        .update(req.body, {
            where: { id: req.params.id }
        })
        .then(result => {
            const { name, identity_number, phone_number, image } = req.body;
            res.send({
                id: req.params.id,
                name,
                identity_number,
                phone_number,
                image
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