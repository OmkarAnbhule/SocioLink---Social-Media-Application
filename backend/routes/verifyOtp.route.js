const app = require('express')();
const verify = require('../controllers/VerifyOtp.controller')

app.post('/otp',verify);