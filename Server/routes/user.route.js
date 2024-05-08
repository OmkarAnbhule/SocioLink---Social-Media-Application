const app = require('express').Router();
const multer = require('multer');
const userController = require('../controllers/User.controller');

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(32).substring(1);
}
const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../src/images/profile");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = guid();
        cb(null, uniqueSuffix + file.originalname)
    }
})

const upload = multer({ storage: storage })


app.post('/sendOTP', userController.sendOtp);
app.post('/create', userController.userRegister);
app.post('/login', userController.userLogin);
app.delete('/logout/:id', userController.userlogout);
app.get("/verify/email/:id", userController.verifyEmail);
app.get("/verfiy/username/:id", userController.verfiyUserName);
app.post('/forgotPassword/resetPassword', userController.resetPassword);
app.post('/forgotPassword/ValidateOtp', userController.forgotPasssordOtpVerify);
app.post('/uploadImage', upload.single('Image'), userController.imageUpload);
app.get('/getProfile/:id', userController.getProfile);
app.get('/get-users/:host/:target', userController.getUsers);
app.post('/followUser', userController.follow);




module.exports = app

