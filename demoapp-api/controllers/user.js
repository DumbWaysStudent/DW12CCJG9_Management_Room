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
                            status: 'error',
                            message: 'Verify Error  ',
                            err
                        });
                    } else if (result) {
                        const token = jwt.sign({ userId: user.id }, 'checkinhotelonline');
                        res.send({
                            status: 'success',
                            id: user.id,
                            name: user.name,
                            username: user.username,
                            email: user.email,
                            avatar: user.avatar,
                            token: `Bearer ${token}`
                        });
                    } else {
                        res.send({
                            status: 'error',
                            message: 'Wrong password!'
                        });
                    }
                });
            } else {
                res.send({
                    status: 'error',
                    message: `Can't find user with username ${username}`
                })
            }
        })
        .catch(err => {
            res.send({
                status: 'error',
                message: "Can't Sign In",
                err
            });
        })
}

exports.register = (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            res.send({
                status: 'error',
                message: 'error while encrypted data',
                err
            });
        } else if (hash) {
            const { username, email, name, avatar } = req.body
            User.create({
                username,
                password: hash,
                email,
                name,
                avatar: 'default-pic'
            })
                .then(user => {
                    const token = jwt.sign({ userID: user.id }, 'checkinhotelonline');
                    res.send({
                        status: 'success',
                        id: user.id,
                        username,
                        email,
                        name,
                        avatar,
                        token: `Bearer ${token}`
                    });
                })
                .catch(err => {
                    res.send({
                        status: 'error',
                        err
                    })
                })
        }
    })
}

exports.getProfile = (req, res) => {
    User
    .findOne(
        {where: {id: req.params.id}, attributes: ['name', 'email', 'avatar']}
    )
    .then((result) => {
        res.send({
            status: 'succes',
            result
        })
    })
    .catch(err => {
        res.send({
            status: 'error',
            err
        })
    })
}