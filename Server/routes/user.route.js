const app = require('express').Router();
const userController = require('../controllers/User.controller');
const { auth } = require('../middlewares/auth.user')



app.post('/sendOTP', userController.sendOtp);
app.post('/create', userController.userRegister);
app.post('/login', userController.userLogin);
app.delete('/logout/:id', auth, userController.userlogout);
app.get("/verify/email/:id", userController.verifyEmail);
app.get("/verfiy/username/:id", userController.verfiyUserName);
app.post('/forgotPassword/resetPassword', userController.resetPassword);
app.post('/forgotPassword/ValidateOtp', userController.forgotPasssordOtpVerify);
app.post('/uploadImage', auth, userController.imageUpload);
app.get('/getProfile/:id', userController.getProfile);
app.get('/get-users/:id/:target', auth, userController.getUsers);
app.post('/followUser', auth, userController.follow);
app.post('/unfollowUser', auth, userController.unfollow);




module.exports = app

