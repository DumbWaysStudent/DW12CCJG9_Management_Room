const express = require('express');
const bodyParser = require('body-parser');
require('express-group-routes');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use('/public', express.static('public'));

//------- Controllers -------//
const UserController = require('./controllers/user')

//------- Middleware -------//
const {authenticated} = require('./middleware');

app.get('/', (req, res) => {
    res.send('CONNECTED TO LEAF HOTEL API');
})

app.group('/api/v2/', (router) => {
    router.post('/login', UserController.login);
    router.post('/register', UserController.register);
});

app.listen(port, () => console.log(`Listen on Port ${port}`));