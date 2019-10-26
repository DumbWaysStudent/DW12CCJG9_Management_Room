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