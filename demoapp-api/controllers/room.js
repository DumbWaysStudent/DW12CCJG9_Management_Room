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

exports.updateRoom = (req, res) => {
    Room
    .update(req.body, {
        where: {id: req.params.id}
    })
    .then(result => {
        res.send({
            id: req.params.id,
            name: req.body.name
        })
    })
}