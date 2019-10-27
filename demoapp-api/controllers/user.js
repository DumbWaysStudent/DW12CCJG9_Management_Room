const models = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = models.user;

exports.login = (req, res) => {
    const { username, password } = req.body

    User.findOne({ where: { username    } })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) {
                        res.send({
                            error: true,
                            message: 'Verify Error  '
                        });
                    } else if (result) {
                        const token = jwt.sign({ userId: user.id }, 'checkinhotelonline');
                        res.send({
                            name: user.name,
                            token: `Bearer ${token}`
                        });
                    } else {
                        res.send({
                            error: true,
                            message: 'Wrong password!'
                        });
                    }
                });
            } else {
                res.send({
                    error: true,
                    message: `Can't find user with username ${username}`
                })
            }
        })
        .catch(err => {
            if (err) throw err;
        })
}

exports.register = (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            res.send({
                error: true,
                message: 'error while encrypted data'
            });
        } else if (hash) {
            const { username, password, email, name, avatar } = req.body
            User.create({
                username,
                password: hash,
                email,
                name,
                avatar
            })
                .then(user => {
                    const token = jwt.sign({ userID: user.id }, 'checkinhotelonline');
                    res.send({
                        name: user.name,
                        token: `Bearer ${token}`
                    });
                })
                .catch(err => {
                    if (err) throw err;
                })
        }
    })
}