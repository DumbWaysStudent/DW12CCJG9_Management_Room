const models = require('../models');
const moment = require('moment');
const Order = models.order;

exports.showCheckIn = (req, res) => {
    Order.findAll()
        .then(result => {
            res.send(result);
        })
        .catch(e => {
            res.send({
                status: 'error',
                message: "Error: Can't load data",
                error: e
            });
        })
}

exports.addCheckin = (req, res) => {
    let { room_id, customer_id, duration, is_booked, is_done, order_end_time } = req.body;

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
        .catch(e => {
            res.send({
                status: 'error',
                message: "Can't add Check In",
                error: e
            });
        })
}

exports.deleteOrder = (req, res) => {
    Order
        .destroy({ where: { room_id: req.params.room_id } })
        .then(() => {
            res.send({
                status: 'success',
                room_id: req.params.room_id
            })
        })
        .catch(e => {
            res.send({
                status: 'error',
                message: "Can't Check Out",
                error: e
            });
        })
}