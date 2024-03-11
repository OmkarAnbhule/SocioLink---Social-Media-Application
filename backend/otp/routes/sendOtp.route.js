const app = require('express')();
const user = require('../controllers/UserController');

app.post('/register',user);