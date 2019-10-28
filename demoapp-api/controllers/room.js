const models = require('../models');
const Room = models.room;

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
    Room.findOne({
        where: { name: req.body.name }
    })
        .then(result => {
            if (!result) {
                Room
                .create(req.body)
                .then((result) => {
                    res.send(result);
                })
                .catch(e => {
                    throw e;
                });
            } else {
                res.send({
                    status: 'error',
                    message: 'Room is Exists!'
                })
            }
        })
        .catch(e => {
            throw e;
        })
}

exports.updateRoom = (req, res) => {
    Room
        .update(req.body, {
            where: { id: req.params.id }
        })
        .then(result => {
            res.send({
                status: 'success',
                id: req.params.id,
                name: req.body.name
            })
        })
        .catch(e => {
            throw e;
        })
}

exports.deleteRoom = (req, res) => {
    Room
    .destroy({where: {id: req.params.id}})
    .then(result => {
        res.send({
            status: 'success',
            id: req.params.id
        });
    })
    .catch(e => {
        throw e;
    })
}