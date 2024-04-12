const app = require('express').Router();
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


app.post('/register', userController.userRegisterEmail);
app.post("/sms", userController.sendSMSOtp)
app.post('/otp', userController.userRegisterEmail);
app.post('/otp_login', userController.userLoginEmail);
app.post('/otp_login_sms', userController.userLoginSMS);
app.post("/user_verify", userController.verfiyUserName);
app.post("/email_valid", userController.verifyEmail);
app.post('/otp_sms', userController.userRegisterSMS);
app.post('/login', userController.sendEmailOtpLogin);
app.post('/login_sms', userController.sendSMSOtpLogin);
app.post('/forgot_password_otp', userController.forgotPasssordOtpSend);
app.post('/validate_otp', userController.forgotPasssordOtpVerify);
app.post('/reset_password', userController.resetPassword);
app.post('/logout', userController.logout);
app.post('/upload', upload.single('Image'), userController.imageUpload);
app.post('/profile', userController.getProfile);
app.post('/get-users', userController.getUsers);



module.exports = app

