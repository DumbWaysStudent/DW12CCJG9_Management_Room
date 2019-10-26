const models = require('../models');
const Room = models.room;
const Order = models.order;

exports.getRooms = (req, res) => {
    Room
    .findAll()
    .then(rooms => {
        res.send(rooms);
    })
    .catch(e => {
        throw e;
    })
}

exports.addRoom = (req, res) => {
    Room
    .create(req.body)
    .then((result) => {
        res.send(result);
    })
    .catch(e => {
        throw e;
    });
}