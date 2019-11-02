const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        switch (file.fieldname) {
            case 'avatar_profile':
                if (fs.existsSync('./public/uploads/profile')) {
                    cb(null, './public/uploads/profile')
                } else {
                    fs.mkdir('./public/uploads/profile', (err) => {
                        if (err) throw err
                        cb(null, './public/uploads/profile')
                    })
                }
                break;
            case 'avatar_customer':
                if (fs.existsSync('./public/uploads/customer')) {
                    cb(null, './public/uploads/customer')
                } else {
                    fs.mkdir('./public/uploads/customer', (err) => {
                        if (err) throw err
                        cb(null, './public/uploads/customer')
                    })
                }
                break;

            default:
                if (fs.existsSync('./public/uploads/temp')) {
                    cb(null, './public/uploads/temp')
                } else {
                    fs.mkdir('./public/uploads/temp', (err) => {
                        if (err) throw err
                        cb(null, './public/uploads/temp')
                    })
                }
                break;
        }
    },
    filename: function (req, file, cb) {
        let fileName = file.originalname;
        switch (file.fieldname) {
            case 'avatar_profile':
                if (fs.existsSync(`${req.body.prevPic}`)) {
                    fs.unlink(`${req.body.prevPic}`, (err) => {
                        if (err) throw err
                    })
                }
                fileName = `-profile-${req.body.name}.${file.mimetype.split('/')[1]}`;
                break;
            case 'avatar_customer':
                if (fs.existsSync(`${req.body.prevPic}`)) {
                    fs.unlink(`${req.body.prevPic}`, (err) => {
                        if (err) throw err
                    })
                }
                fileName = `-customer-${req.body.name}.${file.mimetype.split('/')[1]}`;
                break;

            default:
                break;
        }
        console.log(fileName)
        cb(null, new Date().toISOString().toString().replace(/(\:)/g, '-' ) + fileName)
    }
})

exports.upload = multer({ storage })