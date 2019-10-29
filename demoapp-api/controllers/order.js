const models = require('../models');
const moment = require('moment');
const Order = models.order;

exports.showCheckIn = (req, res) => {
    Order.findAll()
    .then( result => {
        res.send(result);
    })
    .catch(e => {
        throw e;
    })
}

exports.addCheckin = (req, res) => {
    let {room_id, customer_id, duration, is_booked, is_done, order_end_time} = req.body;

    order_end_time = moment(order_end_time).add((Number.parseInt(duration) + 1), 'minute').toDate().toISOString();
    Order
    .create({
        room_id,
        customer_id,
        duration,
        is_booked,
        is_done,
        order_end_time
    })
    .then((result) => {
        res.send({
            status: 'success',
            result
        })
    })
}

exports.deleteOrder = (req, res) => {
    Order
    .destroy({ where: {room_id: req.params.room_id}})
    .then(() => {
        res.send({
            status: 'success',
            room_id: req.params.room_id
        })
    })
}