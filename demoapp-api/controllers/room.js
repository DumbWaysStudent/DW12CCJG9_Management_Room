const models = require('../models');
const Room = models.room;

exports.getRooms = (req, res) => {
    Room
        .findAll()
        .then(rooms => {
            res.send(rooms);
        })
        .catch(e => {
            res.send({
                status: 'error',
                message: "Error: Can't load rooms, please check your internet connection and try again.",
                error: e
            });
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
            res.send({
                status: 'error',
                message: "Can't add room",
                error: e
            });
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
            res.send({
                status: 'error',
                message: "Can't edit room",
                error: e
            });
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
        res.send({
            status: 'error',
            message: "Can't delete room",
            error: e
        });
    })
}