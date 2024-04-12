const OTP = require('./otp/models/otp_model');
const User = require('../../user/models/UserModel');
const Log = require('../../user/models/LoginUserModel');
const OTP = require('../models/otp_model')
const bcrypt = require('bcrypt');
const multer = require('multer')
const { sendEmailOtp, verifyEmailOtp, sendSMSOtp, verfiySMSOtp } = require('../utils/otpUtils');

User.createIndexes();
Log.createIndexes();

exports.sendEmailOtp = async (req, resp) => {
    const { email } = req.body;
    if (await sendEmailOtp(email))
        resp.status(201).send({ Response: 'Success' })
}

exports.sendSMSOtp = async (req, resp) => {
    const { email } = req.body
    try {
        if (await sendSMSOtp(email));
        resp.status(201).send({ Response: 'Success' });
    }
    catch (e) {
        resp.status(500).send({ Response: 'Failed' })
    }
}

exports.sendSMSOtpLogin = async (req, resp) => {
    const { text, val, password } = req.body;
    try {
        let existingUser;
        if (val == 'username') {
            existingUser = await User.findOne({ username: text });
        }
        else {
            existingUser = await User.findOne({ email: text });
        }
        if (existingUser) {
            result = await bcrypt.compare(password, existingUser.password);
            if (result) {
                if (await sendSMSOtp(text))
                    resp.status(201).send({ Response: 'Success', email: existingUser.email });
            }
            else {
                resp.status(400).send({ Response: 'Incorrect' })
            }
        }
        else {
            resp.status(400).send({ Response: 'NF' })
        }
    }
    catch (e) {
        resp.status(500).send({ Response: 'internal server error' });
    }
}

exports.sendEmailOtpLogin = async (req, resp) => {
    try {
        const { text, password, val } = req.body;
        let existingUser;
        if (val == 'username') {
            existingUser = await User.findOne({ username: text });
        }
        else {
            existingUser = await User.findOne({ email: text });
        }
        if (existingUser) {
            result = await bcrypt.compare(password, existingUser.password);
            if (result) {
                if (await sendEmailOtp(existingUser.email))
                    resp.status(201).send({ Response: 'Success', email: existingUser.email })
            }
            else {
                resp.status(400).send({ Response: 'Incorrect' })
            }
        }
        else {
            resp.status(404).send({ Response: 'NF' })
        }
    }
    catch (e) {
        resp.status(500).send({ Response: 'internal server error' })
    }
}

exports.userRegisterEmail = async (req, resp) => {
    try {
        const { email, name, password, username, otp } = req.body;
        if (await verifyEmailOtp(email, otp)) {
            let hashedPassword;
            hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ email, name, password: hashedPassword, username });
            const login = await Log.create({ log_id: email })
            let temp = await login.save()
            let result = await user.save();
            result = result.toObject();
            temp = temp.toObject()
            if (result) {
                delete temp.password;
                delete result.password;
                resp.send({ Response: "Success" });
            }
        }
    }
    catch (e) {
        resp.status(500).send({ Response: "internal Server Error" });
    }
}

exports.userRegisterSMS = async (req, resp) => {
    const { email, name, password, username, otp } = req.body;
    try {
        if (await verfiySMSOtp(email, otp)) {
            let hashedPassword;
            hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ email, name, password: hashedPassword, username });
            let result = await user.save();
            result = result.toObject();
            if (result) {
                delete result.password;
                resp.send({ Response: "Success" });
            }
        }
    }
    catch (e) {
        resp.status(500).send({ Response: 'internal server error' });
    }
}


exports.userLoginEmail = async (req, resp) => {
    const { log_id, otp } = req.body;
    const response = await OTP.find({ email: log_id }).sort({ createdAt: -1 }).limit(1);
    if (response.length === 0 || otp !== response[0].otp) {
        resp.send({ Response: 'Invalid' })
    } else {
        try {
            const user = await Log.create({ log_id });
            let result = await user.save();
            result = result.toObject();
            if (result) {
                delete result.password;
                resp.status(201).send({ Response: "Success" });
            }
        }
        catch (e) {
            resp.status(500).send({ Response: 'Internal server error' });
        }
    }
}

exports.userLoginSMS = async (req, resp) => {
    const { log_id, otp } = req.body;
    try {
        if (await verfiySMSOtp(log_id, otp)) {
            const user = await Log.create({ log_id });
            let result = await user.save();
            console.log(result)
            result = result.toObject();
            if (result) {
                delete result.password;
                resp.status(201).send({ Response: "Success" });
                console.log(result);
            }
        }
    }
    catch (e) {
        resp.status(500).send({ Response: "internal server error" });
    }
}

exports.verfiyUserName = async (req, resp) => {
    try {
        const { Username } = req.body;
        const existingUser1 = await User.findOne({ Username });
        if (existingUser1) {
            resp.status(400).send({ Response: 'Failed' })
        }
        else {
            resp.status(201).send({ Response: 'Success' })
        }
    }
    catch (e) {
        resp.status(500).send({ Response: 'Internal server error' })
    }
}

exports.verifyEmail = async (req, resp) => {
    try {
        const { Email } = req.body;
        const email = Email;
        const existingUser2 = await User.findOne({ email });
        if (existingUser2) {
            resp.status(400).send({ Response: 'Failed' })
        }
        else {
            resp.status(201).send({ Response: 'Success' })
        }
    }
    catch (e) {
        resp.status(500).send({ Respond: 'wrong' })
    }
}

exports.forgotPasssordOtpSend = async (req, resp) => {
    try {
        const { text, val } = req.body
        let existingUser;
        if (val != 'number') {
            existingUser = await User.findOne({ email: text });
            if (existingUser) {
                if (await sendEmailOtp(text))
                    resp.status(201).send({ Response: 'Success', email: existingUser.email })
            }
            else {
                resp.status(400).send({ Response: 'NF' })
            }
        }
        else {
            existingUser = await User.findOne({ email: text });
            if (existingUser) {
                if (await sendSMSOtp(text))
                    resp.status(201).send({ Response: 'Success', email: existingUser.email });
            }
            else {
                resp.status(400).send({ Response: 'NF' })
            }
        }
    }
    catch (e) {
        resp.status(500).send({ Response: 'internal server error' });
    }
}

exports.forgotPasssordOtpVerify = async (req, resp) => {
    const { val, text, otp } = req.body
    if (val == 'email' || val == 'username') {
        if (await verifyEmailOtp(text))
            resp.status(201).send({ Response: 'Success' });
    }
    else {
        if (val == 'number') {
            try {
                if (await verfiySMSOtp(text))
                    resp.status(201).send({ Response: 'Success' })
            }
            catch (e) {
                resp.status(500).send({ Response: 'internal server error' });
            }
        }
    }
}

exports.resetPassword = async (req, resp) => {
    try {
        let hashedPassword
        const { password, text } = req.body;
        hashedPassword = await bcrypt.hash(password, 10);
        response = await User.findOneAndUpdate({ email: text }, { password: hashedPassword }, { new: true })
        if (response) {
            resp.status(201).send({ Response: 'Success' })
        }
    }
    catch (e) {
        resp.status(500).send({ Response: 'internal server error' })
    }
}

exports.logout = async (req, resp) => {
    console.log('logging out')
    try {
        const { email } = req.body;
        const res = await Log.findOneAndDelete({ log_id: email });
        if (res) {
            resp.status(201).send({ Response: 'Success' })
        }
        else {
            resp.status(400).send({ Response: 'Failed' })
        }
    }
    catch (e) {
        resp.status(500).send({ Response: 'internal server error' });
    }
}



exports.imageUpload = async (req, resp) => {
    console.log(req.file.filename)
    const imageName = req.file.filename
    const email = req.body.email
    try {
        const existingUser = User.find({ email })
        if (existingUser) {
            const img = await User.findOneAndUpdate({ email: email }, { image: imageName }, { new: true })
            if (img) {
                resp.status(201).send({ Response: 'Success' })
            }
            else {
                resp.status(400).send({ Response: 'Failed' })
            }
        }
    }
    catch (e) {
        resp.status(500).send({ Response: 'internal server error' });
    }
}

exports.getProfile = async (req, resp) => {
    const { email } = req.body;
    try {
        const res = User.findOne({ email: email }).then(res => {
            const data = res.toJSON()
            resp.status(201).send({ Response: 'Success', data: data })
        })
    }
    catch (e) {
        resp.status(500).send({ Response: 'internal server error' });
    }
}

exports.getUsers = async (req, resp) => {
    console.log(req.body.id)
    const res = await User.find({ $or: [{ username: { $regex: '^' + req.body.target, $options: 'i' } }, { name: { $regex: '^' + req.body.target, $options: 'i' } }] }).exec()
    if (res) {
        const res2 = await User.find({ email: req.body.host })
        resp.status(201).send({ Response: 'Success', data: res })
    }
}