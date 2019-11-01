const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
require('express-group-routes');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

//------- Controllers -------//
const UserController = require('./controllers/user');
const RoomController = require('./controllers/room');
const CustomerController = require('./controllers/customer');
const OrderController = require('./controllers/order');

//------- Middleware -------//
const {authenticated} = require('./middleware');
const { upload } = require('./upload');

app.get('/', (req, res) => {
    res.send('CONNECTED TO LEAF HOTEL API');
})

app.group('/api/v2/', (router) => {
    // ---------- User ----------//
    router.post('/login', UserController.login);
    router.post('/register', UserController.register);
    router.get('/profile/:id', authenticated, UserController.getProfile);
    router.post('/profile/:id', authenticated, upload.single('avatar_profile'), UserController.updateProfile);

    // ---------- Room ----------//
    router.get('/rooms', authenticated, RoomController.getRooms);
    router.post('/room', authenticated, RoomController.addRoom);
    router.put('/room/:id', authenticated, RoomController.updateRoom);
    router.delete('/room/:id', authenticated, RoomController.deleteRoom);


    // ---------- Customer ----------//
    router.get('/customers', authenticated, CustomerController.getCustomers);
    router.post('/customer', authenticated, upload.single('avatar_customer'), CustomerController.addCustomer);
    router.put('/customer/:id', authenticated, upload.single('avatar_customer'), CustomerController.updateCustomer);
    router.delete('/customer/:id', authenticated, CustomerController.deleteCustomer);

    // ---------- Orders ------------//
    router.get('/checkin', authenticated, OrderController.showCheckIn);
    router.post('/checkin', authenticated, OrderController.addCheckin);
    router.delete('/checkout/:room_id', authenticated, OrderController.deleteOrder);

});

app.listen(port, () => console.log(`Listen on Port ${port}`));