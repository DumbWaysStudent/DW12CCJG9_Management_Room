const models = require('../models');
const Order = models.order;
const Customer = models.customer;
const Room = models.room;

exports.showCheckIn = (req, res) => {
    Room.findAll({
        include: [{
            model: Order,
            as: 'roomOrder'
        }, {
            model: Customer,
            as: 'customerOrder'
        }]
    })
    .then( result => {
        res.send(result);
    })
    .catch(e => {
        throw e;
    })
}
