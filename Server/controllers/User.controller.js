const User = require('../models/UserModel');
const Log = require('../models/LoginUserModel');
const OTP = require('../models/otp_model')
const bcrypt = require('bcrypt');
const { sendEmailOtp, verifyEmailOtp, sendSMSOtp, verfiySMSOtp } = require('../utils/otpUtils');

User.createIndexes();
Log.createIndexes();

exports.sendOtp = async (req, resp) => {
    const { email } = req.body;
    if (req.body.type == 'email') {
        try {
            console.log(req.body)
            if (await sendEmailOtp(email))
                resp.status(201).send({ Response: 'Success' })
        }
        catch (e) {
            resp.status(500).send({ Response: 'Failed' })
        }
    }
    else {
        try {
            if (await sendSMSOtp(email));
            resp.status(201).send({ Response: 'Success' });
        }
        catch (e) {
            resp.status(500).send({ Response: 'Failed' })
        }
    }
}


const createUser = async (req, resp) => {
    try {
        const { email, name, password, username } = req.body;
        let hashedPassword;
        hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, name, password: hashedPassword, username });
        const login = await Log.create({ log_id: email })
        if (user && login) {
            resp.status(201).send({ Response: "Success" });
        }
    }
    catch (e) {
        resp.status(500).send({ Response: "internal server error" })
    }
}

exports.userRegister = async (req, resp) => {
    try {
        const { email, otp } = req.body;
        if (req.body.type == 'email') {
            if (await verifyEmailOtp(email, otp)) {
                await createUser(req, resp);
            }
            else {
                resp.status(500).send({ Response: 'Invalid' })
            }
        }
        else {
            if (await verfiySMSOtp(email, otp)) {
                await createUser(req, resp);
            }
        }
    }
    catch (e) {
        resp.status(500).send({ Response: 'internal server error' });
    }
}


exports.userLogin = async (req, resp) => {
    try {
        const { log_id, otp } = req.body;
        if (req.body.type == 'email') {
            if (await verifyEmailOtp(log_id, otp)) {
                const user = await Log.create({ log_id });
                if (user) {
                    resp.status(201).send({ Response: "Success" });
                }
            }
            else {
                resp.status(400).send({ Response: 'Invalid' })
            }
        }
        else {
            if (await verfiySMSOtp(log_id, otp)) {
                const result = await Log.create({ log_id });
                if (result) {
                    resp.status(201).send({ Response: "Success" });
                }
            }
        }
    }
    catch (e) {
        console.log(e)
        resp.status(500).send({ Response: 'Internal server error' });
    }
}

exports.verfiyUserName = async (req, resp) => {
    try {
        const { id } = req.params;
        const existingUser1 = await User.findOne({ username: id });
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
        const { id } = req.params;
        const existingUser2 = await User.findOne({ email: id });
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



exports.forgotPasssordOtpVerify = async (req, resp) => {
    const { val, text, otp } = req.body
    try {
        if (val == 'email' || val == 'username') {
            if (await verifyEmailOtp(text, otp))
                resp.status(201).send({ Response: 'Success' });
        }
        else {
            if (val == 'number') {

                if (await verfiySMSOtp(text, otp))
                    resp.status(201).send({ Response: 'Success' })
            }
        }
    }
    catch (e) {
        resp.status(500).send({ Response: 'internal server error' });
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

exports.userlogout = async (req, resp) => {
    try {
        const { id } = req.params;
        const res = await Log.findOneAndDelete({ log_id: id });
        if (res) {
            resp.status(201).send({ Response: 'Success' })
        }
        else {
            resp.status(400).send({ Response: 'Failed' })
        }
    }
    catch (e) {
        console.log(e)
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
    const { id } = req.params;
    try {
        const res = User.findOne({ email: id }).then(res => {
            const data = res.toJSON()
            resp.status(201).send({ Response: 'Success', data: data })
        })
    }
    catch (e) {
        resp.status(500).send({ Response: 'internal server error' });
    }
}

exports.getUsers = async (req, resp) => {
    console.log(req.params)
    const res = await User.find({ $or: [{ username: { $regex: '^' + req.params.target, $options: 'i' } },{ name: { $regex: '^' + req.params.target, $options: 'i' } }] }).exec()
    if (res) {
        resp.status(201).send({ Response: 'Success', data: res })
    }
}

exports.follow = async (req, resp) => {
    const { host, target } = req.body
    const res = await User.findOneAndUpdate({ email: host }, { $push: { following: target } }, { new: true })
    const res2 = await User.findOneAndUpdate({ email: target }, { $push: { followers: host } }, { new: true })
    if (res) {
        resp.status(201).send({ Response: 'Success' })
    }
}